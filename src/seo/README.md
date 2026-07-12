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
