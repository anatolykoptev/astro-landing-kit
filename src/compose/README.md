# compose

JSON-driven section rendering: maps `LandingSection.type` strings to widget
components via a registry, so a full page renders from a content file without
hand-rolled imports.

## What

- `registry.ts` — framework-agnostic widget registry (`registerWidget`,
  `getWidget`, `hasWidget`, `listWidgetTypes`, `createRegistry`)
- `RenderSections.astro` — imports all kit widgets, registers them as
  defaults, and renders an array of `LandingSection` objects

## When to use

- Rendering a landing page from `landing.json` (or any `ContentProvider` output)
- Adding a custom section type without forking the kit

## API

```ts
// compose/registry
export function registerWidget(type: string, component: unknown): void;
export function getWidget(type: string): unknown | undefined;
export function hasWidget(type: string): boolean;
export function listWidgetTypes(): string[];
export function createRegistry(): WidgetRegistry;
```

```astro
---
// compose/RenderSections
import RenderSections from 'astro-landing-kit/compose';
import { loadJson } from 'astro-landing-kit/adapters/json';
const page = await loadJson('landing');
---
<RenderSections sections={page.sections} />
```

## Default section types

| `type` string | Widget component |
|---|---|
| `hero` | `Hero.astro` |
| `hero-2` | `Hero2.astro` |
| `hero-text` | `HeroText.astro` |
| `features` | `Features.astro` |
| `features-2` | `Features2.astro` |
| `features-3` | `Features3.astro` |
| `steps` | `Steps.astro` |
| `steps-2` | `Steps2.astro` |
| `stats` | `Stats.astro` |
| `faqs` | `FAQs.astro` |
| `pricing` | `Pricing.astro` |
| `testimonials` | `Testimonials.astro` |
| `brands` | `Brands.astro` |
| `contact` | `Contact.astro` |
| `content` | `Content.astro` |
| `cta` | `CallToAction.astro` |
| `note` | `Note.astro` |
| `blog-latest-posts` | `BlogLatestPosts.astro` |
| `blog-highlighted-posts` | `BlogHighlightedPosts.astro` |
| `comparison-table` | `ComparisonTable.astro` |
| `logo-cloud` | `LogoCloud.astro` |
| `video-embed` | `VideoEmbed.astro` |

## Registering a custom widget

```ts
import { registerWidget } from 'astro-landing-kit/compose/registry';
import MyComparison from './components/Comparison.astro';

// Call this before RenderSections renders (e.g. in a layout's frontmatter):
registerWidget('comparison', MyComparison);
```

Now `landing.json` can include `{ "type": "comparison", "props": { ... } }` and
`<RenderSections>` will render it.

## Unknown section types

In dev mode, an unregistered `type` logs a warning to the console with the list
of registered types. In production, it is silently skipped (no crash).

## Dependencies

- `adapters/types` — `LandingSection` type
- `components/widgets/*` — default widget registrations

## Status

stable (0.6.0)
