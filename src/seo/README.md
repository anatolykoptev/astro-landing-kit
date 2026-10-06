# seo

JSON-LD structured data builder for schema.org markup.

## What

Generates `<script type="application/ld+json">` blocks from typed config objects. Covers the entity types common on marketing and SaaS landing pages.

## When to use

- Adding Organization / ProfessionalService schema to a homepage
- Embedding FAQPage markup alongside an FAQ widget
- Adding SoftwareApplication schema to a product page

## API

```ts
// src/seo/index.ts
export function buildJsonLd(
  configs: StructuredDataConfig[],
  options: { siteUrl: string; siteName: string; faqs?: { q: string; a: string }[] }
): string

// src/seo/jsonld.ts (same function, re-exported)
export { buildJsonLd } from './jsonld'
```

Supported `StructuredDataConfig.type` values: `Organization`, `ProfessionalService`, `Person`, `FAQPage`, `SoftwareApplication`.

## Example

```ts
import { buildJsonLd } from 'astro-landing-kit/seo';

const html = buildJsonLd(
  [
    { type: 'Organization', props: { logo: 'https://example.com/logo.png' } },
    { type: 'FAQPage', props: {} },
  ],
  { siteUrl: 'https://example.com', siteName: 'Acme', faqs: page.meta.faqs }
);
// Inject into <head> via set:html={html}
```

## Dependencies

- `adapters/types` — imports `StructuredDataConfig` type

## Status

stable

## Page metadata

`<Metadata>` (rendered by every layout) turns a page's `metadata` prop into `<title>`, canonical, robots, Open Graph and Twitter tags. Precedence: page props > `METADATA` in the kit config > defaults. Everything the kit accepts is rendered; `toSeoProps` (`src/seo/metadata.ts`) is the one place that maps it onto `astro-seo`, which skips what it is not given without an error.

```ts
const metadata = {
  title: 'Post title',
  description: '…',
  openGraph: {
    type: 'article',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'What the card shows' }], // → og:image:alt, twitter:image:alt
    article: { publishedTime: '2026-10-06T00:00:00Z', modifiedTime: '…', authors: ['…'], section: '…', tags: ['…'] }, // → article:*
  },
  twitter: { cardType: 'summary_large_image' }, // default: large card when there is an image, summary otherwise
  links: [{ rel: 'alternate', type: 'application/rss+xml', title: 'Blog', href: '/rss.xml' }], // → <link>, appended to METADATA.links
};
```

`twitter.title`, `twitter.description`, `twitter.image` and `twitter.imageAlt` only need setting when they must differ from the Open Graph values; `twitter:image` defaults to the primary Open Graph image.
