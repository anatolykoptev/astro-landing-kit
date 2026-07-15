import type { ContentProvider } from './provider';
import type { LandingPage, LandingSection } from './types';

/**
 * Directus content adapter — fetches landing pages from a Directus collection.
 *
 * Expected Directus schema:
 * - Collection `landing_pages`: slug (string, unique), meta (json), sections (O2M → landing_sections)
 * - Collection `landing_sections`: type (string), props (json), sort (int)
 *
 * The adapter reads from env vars by default:
 * - `DIRECTUS_URL` — e.g. https://directus.example.com
 * - `DIRECTUS_TOKEN` — static token (or use `directusToken` callback for per-request auth)
 *
 * @example
 * ```ts
 * import { DirectusContentProvider } from 'astro-landing-kit/adapters/directus';
 * const provider = new DirectusContentProvider({
 *   url: import.meta.env.DIRECTUS_URL,
 *   token: import.meta.env.DIRECTUS_TOKEN,
 * });
 * const page = await provider.loadPage('home');
 * ```
 */

export interface DirectusAdapterOptions {
  /** Directus base URL (e.g. https://directus.example.com). */
  url: string;
  /** Static API token. For per-request auth, use `tokenProvider`. */
  token?: string;
  /** Async function returning a token (e.g. for OAuth flows). Overrides `token`. */
  tokenProvider?: () => Promise<string>;
  /** Collection name for landing pages. Default: `landing_pages`. */
  pagesCollection?: string;
  /** Collection name for sections. Default: `landing_sections`. */
  sectionsCollection?: string;
  /** Fetch implementation (defaults to global fetch). */
  fetchFn?: typeof fetch;
}

export class DirectusContentProvider implements ContentProvider {
  private url: string;
  private token?: string;
  private tokenProvider?: () => Promise<string>;
  private pagesCollection: string;
  private sectionsCollection: string;
  private fetchFn: typeof fetch;

  constructor(opts: DirectusAdapterOptions) {
    if (!opts.url) throw new Error('DirectusContentProvider: url is required');
    this.url = opts.url.replace(/\/$/, '');
    this.token = opts.token;
    this.tokenProvider = opts.tokenProvider;
    this.pagesCollection = opts.pagesCollection ?? 'landing_pages';
    this.sectionsCollection = opts.sectionsCollection ?? 'landing_sections';
    this.fetchFn = opts.fetchFn ?? fetch;
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const token = this.tokenProvider ? await this.tokenProvider() : this.token;
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  async loadPage(slug: string): Promise<LandingPage> {
    const fields = [
      'slug',
      'meta',
      `sections.section_id.type`,
      `sections.section_id.props`,
      `sections.sort`,
    ].join(',');

    const filter = JSON.stringify({ slug: { _eq: slug } });
    const endpoint = `${this.url}/items/${this.pagesCollection}?fields=${encodeURIComponent(fields)}&filter=${encodeURIComponent(filter)}`;

    const res = await this.fetchFn(endpoint, { headers: await this.getHeaders() });
    if (!res.ok) {
      throw new Error(`Directus: failed to load page "${slug}" (status ${res.status})`);
    }
    const json = await res.json() as { data: Array<Record<string, unknown>> };
    const page = json.data?.[0];
    if (!page) {
      throw new Error(`Directus: page "${slug}" not found`);
    }

    const sections: LandingSection[] = (page.sections as Array<Record<string, any>> | undefined)
      ?.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
      ?.map((s) => ({
        type: s.section_id?.type ?? 'unknown',
        props: s.section_id?.props ?? {},
      })) ?? [];

    return {
      slug: page.slug as string,
      meta: page.meta as LandingPage['meta'],
      sections,
    };
  }
}
