# astro-landing-kit

**Composable landing-page primitives for Astro.** Layouts, sections, and content
adapters you assemble — not a template you fight, not a framework you're locked
into. Pick a module, import it, ship. Skip the rest.

[![npm version](https://img.shields.io/npm/v/astro-landing-kit.svg)](https://www.npmjs.com/package/astro-landing-kit)
[![license: MIT](https://img.shields.io/npm/l/astro-landing-kit.svg)](LICENSE.md)
[![built with Astro](https://img.shields.io/badge/built%20with-Astro-BC52EE.svg)](https://astro.build)

## Why this exists

Landing-page starter kits are usually one giant template: fork it, and every
future upstream fix means re-merging your customizations. **astro-landing-kit
is the opposite bet** — independent modules (layouts, widgets, UI primitives,
blog, Svelte islands, content adapters, image optimization, styles, a
versioned service worker), each importable on its own, none of them requiring
the others. Update one module without touching the rest of your site.

It started as a fork of [AstroWind](https://github.com/onwidget/astrowind)
(MIT, © onWidget) and has since diverged with hardening AstroWind doesn't
have: `unpic`-backed CDN image optimization, and a versioned service-worker
integration that force-refreshes stale tabs on deploy instead of silently
serving last week's build.

## Install

```bash
npm i astro-landing-kit
```

```astro
---
import PageLayout from 'astro-landing-kit/layouts/PageLayout';
import Hero from 'astro-landing-kit/widgets/Hero';
import { loadJson } from 'astro-landing-kit/adapters/json';

const page = await loadJson('home', 'src/content');
---
<PageLayout metadata={page.meta}>
  <Hero title="Ship faster" tagline="Landing pages in hours, not sprints" />
</PageLayout>
```

That's the whole quickstart — no CLI, no scaffolding step, no config file
required before your first import resolves.

## Modules

| Module | Purpose | Status |
|---|---|---|
| [layouts](src/layouts/README.md) | `PageLayout` / `LandingLayout` / `MarkdownLayout` shells | stable |
| [widgets](src/components/widgets/README.md) | `Hero`, `Footer`, `FAQs`, `CTA`, `Stats`, `Steps`, `Features`, … | stable |
| [ui](src/components/ui/README.md) | `Button`, `Headline`, `ItemGrid`, `WidgetWrapper` primitives | stable |
| [islands](src/components/islands/README.md) | `ContactForm`, `StatsCounter`, `FaqAccordion` (Svelte 5) | stable |
| [blog](src/components/blog/README.md) | Grid, List, SinglePost, Pagination, Tags | stable |
| [adapters](src/adapters/README.md) | `LandingPage` types + a JSON file-based content loader | stable |
| [seo](src/seo/README.md) | JSON-LD + structured-data builders | stable |
| [images](src/utils/README.md) | Astro image optimization + `unpic` CDN support | stable |
| [styles](src/assets/styles/README.md) | Tailwind v4 base stylesheet | stable |
| [sw](src/sw/README.md) | Versioned service worker — auto cache-bust, force-refresh stale tabs | stable |
| [design](src/design/README.md) | `DESIGN.md` → CSS theme tokens | opinionated — reads its own README before adopting |
| [integration](vendor/README.md) | `astrowindIntegration`: `config.yaml` loader for Astro | experimental |

Each module ships its own README with its exact exports and cross-module
dependencies (widgets depend on `ui`; blog depends on `ui` + `utils`; `seo`
depends only on `adapters`' types — nothing pulls in the whole kit by
accident).

## Compatibility

Requires Astro `^7.0.0`, Svelte `^5.0.0`. See [CLAUDE.md](CLAUDE.md) for
consumer-compatibility notes if you're pinning a pre-0.3.0 version against an
Astro 6 site.

## Changelog

Releases are cut automatically via [release-please](https://github.com/googleapis/release-please)
from conventional commits — see [CHANGELOG.md](CHANGELOG.md) or the
[Releases page](https://github.com/anatolykoptev/astro-landing-kit/releases)
for the full history. Every version is also on
[npm](https://www.npmjs.com/package/astro-landing-kit).

## Contributing

Issues and PRs welcome. Fork of [AstroWind](https://github.com/onwidget/astrowind),
MIT licensed — see [LICENSE.md](LICENSE.md).
