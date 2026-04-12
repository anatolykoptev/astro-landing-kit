import type { ContentProvider, LandingPage, LandingSection, PageMeta } from './types';

interface DirectusConfig {
  url: string;
  token?: string;
  cacheTtl?: number;
}

export class DirectusContentProvider implements ContentProvider {
  private url: string;
  private token?: string;
  private cache = new Map<string, { data: unknown; expires: number }>();
  private cacheTtl: number;

  constructor(config: DirectusConfig) {
    this.url = config.url.replace(/\/$/, '');
    this.token = config.token;
    this.cacheTtl = config.cacheTtl ?? 300_000; // 5min
  }

  private async fetch<T>(path: string): Promise<T> {
    const cacheKey = path;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) return cached.data as T;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const res = await fetch(`${this.url}${path}`, { headers });
    if (!res.ok) throw new Error(`Directus ${path}: ${res.status}`);
    const json = await res.json();
    const data = json.data as T;

    this.cache.set(cacheKey, { data, expires: Date.now() + this.cacheTtl });
    return data;
  }

  async loadPage(slug: string): Promise<LandingPage> {
    const pages = await this.fetch<any[]>(
      `/items/landing_pages?filter[slug][_eq]=${slug}&filter[status][_eq]=published&fields=*,sections.id,sections.collection,sections.item,sections.sort&deep[sections][_sort][]=sort&limit=1`
    );
    if (!pages.length) throw new Error(`Landing page '${slug}' not found`);
    return this.normalize(pages[0]);
  }

  private async normalize(raw: any): Promise<LandingPage> {
    const meta: PageMeta = {
      title: raw.title,
      description: raw.description,
      ogImage: raw.og_image || undefined,
      navLinks: raw.nav_links || [],
      socialLinks: raw.social_links || [],
      footerLinks: raw.footer_links || [],
      footerDescription: raw.footer_description || '',
      structuredData: raw.structured_data || [],
    };

    const sections: LandingSection[] = await Promise.all(
      (raw.sections || []).map(async (s: any) => {
        const item = await this.fetch<any>(`/items/${s.collection}/${s.item}?fields=*`);
        return {
          type: s.collection.replace('section_', ''),
          id: item.anchor_id || undefined,
          variant: item.variant || 'plain',
          cssClass: item.css_class || undefined,
          props: item,
        };
      })
    );

    return { slug: raw.slug, meta, sections: sections.filter(s => !s.props.hidden) };
  }
}

export function createDirectusProvider(config: DirectusConfig): ContentProvider {
  return new DirectusContentProvider(config);
}
