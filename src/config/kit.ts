/**
 * astro-landing-kit — kit's own config.
 *
 * Replaces the former src/config.yaml + vendor/integration virtual module.
 * Consumer sites write their own src/config.ts with defineConfig().
 */
import { defineConfig } from './index';

export const config = defineConfig({
  site: {
    name: 'astro-landing-kit',
    site: 'https://kit.krolik.run',
    base: '/',
    trailingSlash: false,
  },

  metadata: {
    title: {
      default: 'astro-landing-kit',
      template: '%s — astro-landing-kit',
    },
    description:
      'Structural foundation for Astro landing pages. Design tokens, PWA, forms, SEO, and impeccable design quality — built in.',
    robots: { index: true, follow: true },
    openGraph: {
      site_name: 'astro-landing-kit',
      images: [{ url: '~/assets/images/default.png', width: 1200, height: 628 }],
      type: 'website',
    },
    twitter: { cardType: 'summary_large_image' },
  },

  i18n: { language: 'en', textDirection: 'ltr' },

  blog: {
    isEnabled: true,
    postsPerPage: 6,
    isRelatedPostsEnabled: true,
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
  },

  analytics: {
    vendors: {
      googleAnalytics: { id: undefined, partytown: true },
    },
  },

  ui: { theme: 'system' },
});

// Named exports for backward-compat with kit internals
export const SITE = config.site;
export const I18N = config.i18n;
export const METADATA = config.metadata;
export const APP_BLOG = config.blog;
export const UI = config.ui;
export const ANALYTICS = config.analytics;
