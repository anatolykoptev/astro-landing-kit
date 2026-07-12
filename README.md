# astro-landing-kit

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
| [sw](src/sw/README.md) | Versioned service-worker integration (auto cache-bust, force-refresh stale tabs) | stable |
| [integration](vendor/README.md) | astrowindIntegration: config.yaml loader for Astro | krolik-private |

## Install

```bash
npm i astro-landing-kit
# or local workspace reference:
# "dependencies": { "astro-landing-kit": "file:../../src/astro-landing-kit" }
```

## Quickstart

```astro
---
import PageLayout from 'astro-landing-kit/layouts/PageLayout';
import Hero from 'astro-landing-kit/widgets/Hero';
import FAQs from 'astro-landing-kit/widgets/FAQs';
import { buildJsonLd } from 'astro-landing-kit/seo';
import { loadJson } from 'astro-landing-kit/adapters/json';

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

## Recent changes

**PR #4** — go-kit-style modular structure: each module now has its own `README.md` (see module table above) documenting its public API, exports, and cross-module deps.

**PR #5** — `adaptOpenGraphImages` passthrough: URLs already starting with `/` or `https://` (public-prefix) are returned as-is instead of being processed through the image optimizer.

**PR #6** — design-token and layout fixes:
- `theme.css` added as the canonical export for all CSS custom-property tokens (import once at the app entry point).
- `FontPreload.astro` helper added: preloads WOFF2 fonts without layout-shift; accepts `fonts` array prop.
- `maskIconColor` prop added to `Favicons.astro` for SVG mask-icon color control.
- `--aw-color-primary` legacy leak fixed: the old AstroWind variable no longer bleeds into consumer stylesheets.
- `PageLayout` now wraps page content in a `<main>` landmark; consumers must **not** add a second `<main>` wrapper inside the default slot.

**PR #19** — `sw` module added: versioned service-worker integration (`astro-landing-kit/sw`), modeled on oxpulse-chat's SW pattern. Auto-derives the cache name from the consumer repo's git SHA — no manual version bump. See [src/sw/README.md](src/sw/README.md) for the adopt snippet and the reload-on-activate caveat.

**PR #26** — renamed from `@krolik/landing-kit` (git-only dependency) to `astro-landing-kit`, published to the public npm registry. GitHub repo renamed to match (`anatolykoptev/astro-landing-kit`); old git URLs still resolve via GitHub's redirect but new consumers should install from npm.
