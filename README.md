# @krolik/landing-kit

Thin, composable Astro + Svelte landing page primitives. No CMS, no forms backend, no opinionated routing. Bring your own content.

## Install

```bash
npm install @krolik/landing-kit
# or local workspace:
# "dependencies": { "@krolik/landing-kit": "file:../../src/landing-kit" }
```

## Exports

| Import path | What you get |
|---|---|
| `@krolik/landing-kit/layouts/PageLayout` | Base HTML shell with head, meta, Tailwind |
| `@krolik/landing-kit/widgets/*` | Footer, Header, Hero, Features, FAQs, Stats, Steps, … |
| `@krolik/landing-kit/ui/*` | Button, Headline, ItemGrid, WidgetWrapper, … |
| `@krolik/landing-kit/blog/*` | Grid, List, SinglePost, Pagination, Tags, … |
| `@krolik/landing-kit/islands/ContactForm` | Svelte 5 contact form (endpoint prop) |
| `@krolik/landing-kit/seo` | `buildJsonLd` — schema.org JSON-LD builder |
| `@krolik/landing-kit/adapters/json` | `loadJson(slug, basePath?)` — read JSON content files |
| `@krolik/landing-kit/adapters/types` | TypeScript types: `LandingPage`, `PageMeta`, etc. |
| `@krolik/landing-kit/styles` | Tailwind v4 base styles |
| `@krolik/landing-kit/design` | `designMdIntegration` — DESIGN.md → CSS theme tokens |
| `@krolik/landing-kit/integration` | `astrowindIntegration` — config.yaml loader |

## Usage (3 lines)

```astro
---
import PageLayout from '@krolik/landing-kit/layouts/PageLayout';
import Hero from '@krolik/landing-kit/widgets/Hero';
import { loadJson } from '@krolik/landing-kit/adapters/json';

const page = await loadJson('home', 'src/content');
---
<PageLayout metadata={page.meta}>
  <Hero {...page.sections[0].props} />
</PageLayout>
```

## JSON-LD

```ts
import { buildJsonLd } from '@krolik/landing-kit/seo';

const jsonLd = buildJsonLd(page.meta.structuredData, {
  siteUrl: 'https://example.com',
  siteName: 'Example',
});
```
