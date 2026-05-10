# @krolik/landing-kit

Composable Astro + Svelte primitives for marketing sites. Pick what you need.

## Modules

| Module | Purpose | Status |
|---|---|---|
| [seo](src/seo/README.md) | JSON-LD + structured data builders | stable |
| [layouts](src/layouts/README.md) | PageLayout / LandingLayout / MarkdownLayout shells | stable |
| [widgets](src/components/widgets/README.md) | Hero, Footer, FAQs, CTA, Stats, Steps, Features, … | stable |
| [ui](src/components/ui/README.md) | Button, Headline, ItemGrid, WidgetWrapper primitives | stable |
| [blog](src/components/blog/README.md) | Grid, List, SinglePost, Pagination, Tags | stable |
| [islands](src/components/islands/README.md) | ContactForm, StatsCounter, FaqAccordion (Svelte 5) | stable |
| [adapters](src/adapters/README.md) | `LandingPage` types + JSON file-based content loader | stable |
| [images](src/utils/README.md) | Astro image optimization helpers + unpic CDN support | stable |
| [styles](src/assets/styles/README.md) | Tailwind v4 base stylesheet | stable |
| [design](src/design/README.md) | DESIGN.md → CSS theme tokens, pm7 catalog | krolik-private |
| [integration](vendor/README.md) | astrowindIntegration: config.yaml loader for Astro | krolik-private |

## Install

```bash
npm install @krolik/landing-kit
# or local workspace reference:
# "dependencies": { "@krolik/landing-kit": "file:../../src/landing-kit" }
```

## Quickstart

```astro
---
import PageLayout from '@krolik/landing-kit/layouts/PageLayout';
import Hero from '@krolik/landing-kit/widgets/Hero';
import FAQs from '@krolik/landing-kit/widgets/FAQs';
import { buildJsonLd } from '@krolik/landing-kit/seo';
import { loadJson } from '@krolik/landing-kit/adapters/json';

const page = await loadJson('home', 'src/content');
const jsonLd = buildJsonLd(page.meta.structuredData ?? [], {
  siteUrl: 'https://example.com',
  siteName: 'Acme',
});
---
<PageLayout metadata={page.meta}>
  <Fragment slot="head" set:html={jsonLd} />
  <Hero title="Ship faster" tagline="Landing pages in hours" />
  <FAQs items={page.meta.faqs} />
</PageLayout>
```

## Philosophy

Every module is independently importable. No required "framework" entry point. Use only what you need. Cross-module coupling is documented per module — widgets depend on ui; blog depends on ui + utils; seo depends on adapters/types only.
