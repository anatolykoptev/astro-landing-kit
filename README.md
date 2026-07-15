# astro-landing-kit

**Composable landing-page primitives for Astro.** Layouts, sections, content
adapters, design tokens, PWA, forms, SEO, and blog — each importable on its own,
none requiring the others. Not a template you fight, not a framework you're
locked into. Pick a module, import it, ship. Skip the rest.

[![npm version](https://img.shields.io/npm/v/astro-landing-kit.svg)](https://www.npmjs.com/package/astro-landing-kit)
[![license: MIT](https://img.shields.io/npm/l/astro-landing-kit.svg)](LICENSE.md)
[![built with Astro](https://img.shields.io/badge/built%20with-Astro-BC52EE.svg)](https://astro.build)

## Why this exists

Landing-page starter kits are usually one giant template: fork it, and every
future upstream fix means re-merging your customizations. **astro-landing-kit
is the opposite bet** — independent modules (layouts, widgets, UI primitives,
blog, Svelte islands, content adapters, image optimization, styles, a
versioned service worker, design tokens, forms, SEO), each importable on its
own, none of them requiring the others. Update one module without touching
the rest of your site.

It started as a fork of [AstroWind](https://github.com/onwidget/astrowind)
(MIT, © onWidget) and has since diverged with hardening AstroWind doesn't
have:

- **DESIGN.md → CSS tokens**: Write a Stitch-spec `DESIGN.md`, the kit parses
  it into `--aw-color-*` CSS custom properties at build time.
- **Versioned service worker**: Force-refreshes stale tabs on deploy instead
  of silently serving last week's build. No `@vite-pwa` dependency.
- **Impeccable design gate**: CI runs `impeccable detect` on build output —
  catches AI slop tells (hardcoded colors, overused fonts, border accents).
- **Forms layer**: Honeypot anti-spam, CSRF tokens, webhook submission.
  Svelte 5 island with progressive enhancement.
- **Content adapters**: JSON files, Directus, or a custom provider — switch
  sources without touching page components.

## Install

```bash
npm i astro-landing-kit
```

```astro
---
import PageLayout from 'astro-landing-kit/layouts/PageLayout';
import { designMdIntegration } from 'astro-landing-kit/design';
import { serviceWorkerIntegration } from 'astro-landing-kit/sw';
import { loadJson } from 'astro-landing-kit/adapters/json';

const page = await loadJson('home', 'src/content');
---

<PageLayout metadata={page.meta}>
  <!-- compose sections from ui/* primitives -->
</PageLayout>
```

Astro config:

```ts
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import { designMdIntegration } from 'astro-landing-kit/design';
import { serviceWorkerIntegration } from 'astro-landing-kit/sw';

export default defineConfig({
  integrations: [
    svelte(),
    designMdIntegration(),        // DESIGN.md → CSS tokens
    serviceWorkerIntegration(),   // PWA offline
  ],
});
```

No CLI, no scaffolding step, no config file required before your first
import resolves.

## Modules

| Module | Import | Purpose | Status |
|---|---|---|---|
| [layouts](src/layouts/README.md) | `astro-landing-kit/layouts/*` | `PageLayout`, `LandingLayout` shells | stable |
| [ui](src/components/ui/README.md) | `astro-landing-kit/ui/*` | `Button`, `Headline`, `ItemGrid`, `WidgetWrapper`, `Form`, `Timeline` | stable |
| [widgets](src/components/widgets/README.md) | `astro-landing-kit/widgets/*` | 29 prototype scaffolds: `Hero`, `Features`, `Stats`, `Steps`, `Pricing`, `FAQs`, `Gallery`, `ComparisonTable`, … | scaffold |
| [islands](src/components/islands/README.md) | `astro-landing-kit/islands/*` | `ContactForm`, `StatsCounter`, `FaqAccordion`, `PricingToggle`, `TestimonialSlider` (Svelte 5) | stable |
| [blog](src/components/blog/README.md) | `astro-landing-kit/blog/*` | `Grid`, `List`, `SinglePost`, `PostShell`, `Pagination`, `Tags`, `RelatedPosts` | stable |
| [adapters](src/adapters/README.md) | `astro-landing-kit/adapters` | `ContentProvider` interface, `JsonContentProvider`, `DirectusContentProvider` | stable |
| [seo](src/seo/README.md) | `astro-landing-kit/seo` | `buildJsonLd` structured-data builder | stable |
| [forms](src/forms/README.md) | `astro-landing-kit/forms` | CSRF tokens, rate limiting, webhook adapters (`JsonWebhook`, `FormspreeWebhook`) | stable |
| [design](src/design/README.md) | `astro-landing-kit/design` | `designMdIntegration()` — DESIGN.md → `--aw-color-*` CSS tokens | stable |
| [sw](src/sw/README.md) | `astro-landing-kit/sw` | `serviceWorkerIntegration()` — versioned SW, auto cache-bust, force-refresh | stable |
| [compose](src/compose/README.md) | `astro-landing-kit/compose` | `RenderSections` + widget registry — render sections from JSON | stable |
| [images](src/utils/README.md) | `astro-landing-kit/images` | Astro image optimization + `unpic` CDN support | stable |
| [styles](src/assets/styles/README.md) | `astro-landing-kit/styles` | Tailwind v4 base stylesheet + `--aw-color-*` token system | stable |
| [integration](vendor/README.md) | `astro-landing-kit/integration` | `astrowindIntegration`: `config.yaml` loader for Astro | experimental |

Each module ships its own README with its exact exports and cross-module
dependencies. Widgets depend on `ui`; blog depends on `ui` + `utils`; `seo`
depends only on `adapters`' types — nothing pulls in the whole kit by
accident.

### Widgets = scaffold, not shippable

`widgets/*` are fast-prototype shapes for MVPs and internal pages. They are
NOT for brand-register pages (marketing/landing — where design IS the
product). Compose bespoke sections from `ui/*` primitives instead. See
[CLAUDE.md](CLAUDE.md) for the full policy.

## Design tokens

Write a `DESIGN.md` in [Stitch-spec format](https://stitch.withgoogle.com/docs/design-md/format/):
YAML frontmatter (colors, typography, rounded, spacing, components) + 6
canonical markdown sections (Overview, Colors, Typography, Elevation,
Components, Do's and Don'ts). The kit parses it into CSS custom properties.
The [impeccable](https://impeccable.style) plugin parses the same file for
design-system context. One file, two parsers, zero drift.

See [DESIGN.md](DESIGN.md) for the kit's own reference theme.

## Blog

Content collections with `src/content/config.ts` (Zod schema), blog list
with pagination, single post with related posts, category and tag filters,
RSS feed at `/rss.xml`. Reading time via `reading-time` remark plugin.

Posts live in `src/data/post/*.md` with frontmatter: `title`, `excerpt`,
`publishDate`, `category`, `tags`, `author`.

## PWA

```ts
import { serviceWorkerIntegration } from 'astro-landing-kit/sw';

export default defineConfig({
  integrations: [serviceWorkerIntegration()],
});
```

Generates `sw.js` with:
- **Network-first navigations** with cache fallback (offline works)
- **Cache-first hashed assets** (skips network on warm cache)
- **Auto-reload on deploy** (skipWaiting + clients.claim — no stale tabs)
- **Web App Manifest** with maskable icons

No `@vite-pwa` dependency. See [src/sw/README.md](src/sw/README.md).

## Compatibility

Requires Astro `^7.0.0`, Svelte `^5.0.0`, Tailwind CSS `^4.0.0`,
TypeScript `^6.0.0`. Node `>=20` (developed on 24).

**v0.3.0+ requires the consumer's own `astro` to be `^7.0.0`**
(peer-required by `@astrojs/svelte@9`). A consumer still on Astro 6 must
NOT widen its kit version past `^0.2.x` until it bumps its own astro
dependency. See [CLAUDE.md](CLAUDE.md) for consumer-compatibility notes.

## Changelog

Releases are cut automatically via [release-please](https://github.com/googleapis/release-please)
from conventional commits — see [CHANGELOG.md](CHANGELOG.md) or the
[Releases page](https://github.com/anatolykoptev/astro-landing-kit/releases)
for the full history. Every version is also on
[npm](https://www.npmjs.com/package/astro-landing-kit).

## Contributing

Issues and PRs welcome. Fork of [AstroWind](https://github.com/onwidget/astrowind),
MIT licensed — see [LICENSE.md](LICENSE.md).
