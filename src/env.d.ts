// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="../vendor/integration/types.d.ts" />

// astro-seo ships a raw .ts export with no "types" field in package.json —
// the TS resolver under `astro check` can't find it, so we declare the module
// here. The actual runtime import works fine (Vite handles .ts).
declare module 'astro-seo' {
  import type { Component } from 'astro/types';
  interface SEOProps {
    title?: string;
    titleTemplate?: string;
    canonical?: string;
    noindex?: boolean;
    nofollow?: boolean;
    description?: string;
    openGraph?: any;
    twitter?: any;
    [key: string]: any;
  }
  export const SEO: Component<SEOProps>;
  export type Props = SEOProps;
}

