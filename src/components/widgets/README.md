# widgets

Full-width section components for marketing pages.

## What

20 composable Astro components covering the standard landing-page sections. Each wraps `ui/WidgetWrapper` for consistent padding, background variants, and id anchors.

## When to use

- Assembling a landing page from JSON-driven sections
- Embedding a single section (e.g. `FAQs`) into an existing page
- Any section that spans the full viewport width

## API

All widgets accept typed props matching `~/types`. Key components:

| Component | Props type | Description |
|---|---|---|
| `Hero.astro` / `Hero2.astro` | `Hero` | Above-the-fold hero with image + CTA |
| `HeroText.astro` | `HeroText` (local Props) | Text-only hero variant |
| `Features.astro` / `Features2.astro` / `Features3.astro` | `Features` | Icon grid features |
| `FAQs.astro` | `FAQs` | Accordion-ready FAQ list |
| `Stats.astro` | `Stats` | Stat counters widget |
| `Steps.astro` / `Steps2.astro` | `Steps` | Numbered step list |
| `CallToAction.astro` | `Widget` + local | CTA band |
| `Contact.astro` | `Contact` | Contact form wrapper |
| `Pricing.astro` | `Pricing` | Pricing table |
| `Testimonials.astro` | `Testimonials` | Testimonial cards |
| `Brands.astro` | `Brands` | Logo strip |
| `Content.astro` | `Content` | Rich text + media section |
| `Header.astro` / `Footer.astro` | nav config | Site chrome |
| `Announcement.astro` | — | Top-of-page banner |
| `Note.astro` | — | Inline callout |
| `BlogLatestPosts.astro` / `BlogHighlightedPosts.astro` | `Widget` | Blog entry points |

## New in 0.2.0

### `align` prop (Hero, HeroText, Stats, Features, Steps, CallToAction)

```astro
<Hero align="left" title="Build faster" />
<Features align="left" items={...} />
```

- `'center'` — default (backwards-compat, centered headline + actions)
- `'left'` — left-aligns headline group; no mx-auto on headline container

### `layout` prop (Features via ItemGrid)

```astro
<Features layout="grid" items={...} />     <!-- default card-grid -->
<Features layout="chapters" items={...} /> <!-- editorial list with chapter numbers -->
<Features layout="log" items={...} />      <!-- monospace terminal log block -->
```

#### `layout="chapters"` — editorial chapter list

Full-width list with hairline rules between items. Each item renders a chapter number
(`item.chapter` or auto-generated `"01"`, `"02"`, ...). No card chrome. Icons
suppressed unless `item.icon` explicitly set.

```astro
<Features
  layout="chapters"
  items={[
    { chapter: "01", title: "Distributed systems", description: "..." },
    { chapter: "02", title: "ML serving", icon: null, description: "..." },
  ]}
/>
```

#### `layout="log"` — terminal log block

Monospace dense list. Items render inline with a `>` prompt prefix. No icons,
no card chrome. Good for tech stack lists, changelog entries, terminal-style copy.

```astro
<Features
  layout="log"
  items={[
    { title: "Rust", description: "axum + tokio" },
    { title: "Go", description: "standard library, zero deps" },
  ]}
/>
```

### `item.chapter` — custom chapter string

```ts
interface Item {
  chapter?: string; // "01", "S 1", "A" — rendered by 'chapters' layout
}
```

### `item.icon = null` — explicit icon suppression

```astro
<Features items={[{ title: "No icon", icon: null, description: "..." }]} />
```

Previously, an empty string still left an empty container div. `null` skips icon
rendering entirely.

### `animate` prop on WidgetWrapper (BREAKING)

```astro
<!-- 0.1.x: fade-in was always on -->
<!-- 0.2.x: must opt in -->
<WidgetWrapper animate={true}>...</WidgetWrapper>
```

Default is `false` — no animation. Existing consumers that relied on the
intersect-observer fade-in must pass `animate={true}` explicitly.

### `animate` prop on Hero / Hero2 / HeroText

Same opt-in pattern as WidgetWrapper. When `animate={true}`, per-element
`intersect-once motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade`
is applied to tagline, title, subtitle, actions, and image individually.

```astro
<Hero animate={true} title="Ship faster" />
```

## Semantic color tokens (0.2.0)

Widgets now use semantic Tailwind classes instead of literal color scales.
Override via CSS custom properties in your site's stylesheet:

| CSS variable | Default | Token class |
|---|---|---|
| `--aw-color-eyebrow` | `--aw-color-primary` | `text-eyebrow` |
| `--aw-color-bg-card` | `--aw-color-bg-page` | `bg-card` |
| `--aw-color-hairline` | `--aw-color-text-muted` / `oklch(0.5 0 0)` | `border-hairline` |
| `--aw-color-text-muted` | — | `text-muted` |

Legacy `--aw-color-*` variables are preserved — no migration needed.

## Example

```astro
---
import Hero from '@krolik/landing-kit/widgets/Hero';
import Features from '@krolik/landing-kit/widgets/Features';
import FAQs from '@krolik/landing-kit/widgets/FAQs';
---
<Hero align="left" title="Build faster" tagline="Ship landing pages in minutes" />
<Features layout="chapters" align="left" items={projectItems} />
<FAQs items={faqItems} />
```

## Dependencies

- `ui` — WidgetWrapper, Headline, Button, ItemGrid, Timeline, Form
- `blog` — Grid (for blog widgets)
- `utils/permalinks`, `utils/blog` — for blog widgets

## Status

stable (0.2.0)
