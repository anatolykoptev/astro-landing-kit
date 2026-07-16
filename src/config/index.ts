/**
 * astro-landing-kit config module.
 *
 * Replaces the former `astrowind:config` virtual module with a plain
 * TypeScript module that any tooling (IDE, tsc, vitest, go-code) can
 * resolve without a running Vite server.
 *
 * Consumer writes:
 *
 *   // src/config.ts (consumer project root)
 *   import { defineConfig } from 'astro-landing-kit/config';
 *   export const config = defineConfig({
 *     site: { name: 'My Site', site: 'https://example.com' },
 *     blog: { isEnabled: true, postsPerPage: 6 },
 *   });
 *
 * Then imports anywhere:
 *
 *   import { SITE, APP_BLOG } from '~/config';
 *
 * Or, for npm consumers:
 *
 *   import { SITE } from 'astro-landing-kit/config/defaults';
 *
 * The kit itself uses `~/config` (alias for `src/config.ts`).
 */

import type { MetaData } from '~/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SiteConfig {
  name: string;
  site?: string;
  base?: string;
  trailingSlash?: boolean;
  googleSiteVerificationId?: string;
}

export interface I18NConfig {
  language: string;
  textDirection: 'ltr' | 'rtl';
  dateFormatter?: Intl.DateTimeFormat;
}

export interface MetaDataConfig extends Omit<MetaData, 'title'> {
  title?: {
    default: string;
    template: string;
  };
}

export interface BlogPostConfig {
  isEnabled: boolean;
  permalink: string;
  robots: { index: boolean; follow: boolean };
}

export interface BlogListConfig {
  isEnabled: boolean;
  pathname: string;
  robots: { index: boolean; follow: boolean };
}

export interface AppBlogConfig {
  isEnabled: boolean;
  postsPerPage: number;
  isRelatedPostsEnabled: boolean;
  relatedPostsCount: number;
  post: BlogPostConfig;
  list: BlogListConfig;
  category: BlogListConfig;
  tag: BlogListConfig;
}

export interface UIConfig {
  theme: 'system' | 'light' | 'dark' | 'light:only' | 'dark:only';
}

export interface AnalyticsConfig {
  vendors: {
    googleAnalytics: {
      id?: string;
      partytown?: boolean;
    };
  };
}

export interface KitConfig {
  site: SiteConfig;
  i18n: I18NConfig;
  metadata: MetaDataConfig;
  blog: AppBlogConfig;
  ui: UIConfig;
  analytics: AnalyticsConfig;
}

// ---------------------------------------------------------------------------
// Input type (everything optional, defaults merged in)
// ---------------------------------------------------------------------------

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface KitConfigInput extends DeepPartial<KitConfig> {}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_SITE: SiteConfig = {
  name: 'Website',
  site: undefined,
  base: '/',
  trailingSlash: false,
  googleSiteVerificationId: '',
};

const DEFAULT_I18N: I18NConfig = {
  language: 'en',
  textDirection: 'ltr',
};

const DEFAULT_BLOG: AppBlogConfig = {
  isEnabled: false,
  postsPerPage: 6,
  isRelatedPostsEnabled: false,
  relatedPostsCount: 4,
  post: {
    isEnabled: true,
    permalink: 'blog/%slug%',
    robots: { index: true, follow: true },
  },
  list: {
    isEnabled: true,
    pathname: 'blog',
    robots: { index: true, follow: true },
  },
  category: {
    isEnabled: true,
    pathname: 'category',
    robots: { index: true, follow: true },
  },
  tag: {
    isEnabled: true,
    pathname: 'tag',
    robots: { index: false, follow: true },
  },
};

const DEFAULT_UI: UIConfig = {
  theme: 'system',
};

const DEFAULT_ANALYTICS: AnalyticsConfig = {
  vendors: {
    googleAnalytics: {
      id: undefined,
      partytown: true,
    },
  },
};

// ---------------------------------------------------------------------------
// Deep merge (no lodash dependency)
// ---------------------------------------------------------------------------

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function deepMerge<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (override === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override ?? base) as T;
  }
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const b = (base as Record<string, unknown>)[key];
    const o = (override as Record<string, unknown>)[key];
    result[key] = isPlainObject(b) && isPlainObject(o) ? deepMerge(b, o) : o ?? b;
  }
  return result as T;
}

// ---------------------------------------------------------------------------
// defineConfig — the public API
// ---------------------------------------------------------------------------

export function defineConfig(input: KitConfigInput = {}): KitConfig {
  const site = deepMerge(DEFAULT_SITE, input.site);
  const metadata: MetaDataConfig = deepMerge(
    {
      title: { default: site.name, template: '%s' },
      description: '',
      robots: { index: false, follow: false },
      openGraph: { type: 'website' },
    },
    input.metadata,
  );
  const i18n = deepMerge(DEFAULT_I18N, input.i18n);
  const blog = deepMerge(DEFAULT_BLOG, input.blog);
  const ui = deepMerge(DEFAULT_UI, input.ui);
  const analytics = deepMerge(DEFAULT_ANALYTICS, input.analytics);

  return { site, i18n, metadata, blog, ui, analytics };
}
