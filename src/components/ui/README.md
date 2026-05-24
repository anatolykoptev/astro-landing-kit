# ui

Primitive Astro components used as building blocks by widgets.

## What

Low-level, reusable components with no page-level semantics. Designed to be composed inside widgets, not used directly on pages.

## When to use

- Building a custom widget that needs consistent button, headline, or grid markup
- Overriding a widget's inner component in a fork

## API

| Component | Props type | Description |
|---|---|---|
| `Button.astro` | `CallToAction` | Styled button/link with optional icon |
| `Headline.astro` | `Headline` | Title + subtitle + tagline group |
| `ItemGrid.astro` / `ItemGrid2.astro` | `ItemGrid` | Grid of icon+text items |
| `WidgetWrapper.astro` | `Widget` | Section wrapper: id, bg variant, padding |
| `Background.astro` | — | Background color/image layer |
| `Timeline.astro` | `Item[]` | Vertical timeline for steps |
| `Form.astro` | `Form` | HTML form with Button submit |
| `DListItem.astro` | — | Definition list item |

All prop types are exported from `~/types`.

## New in 0.2.0

### Headline — `align` prop

```astro
<Headline title="..." align="left" />
<Headline title="..." align="center" /> <!-- default -->
```

`align="left"` drops `text-center` and `mx-auto` from the container.
`align="center"` is the default (backwards-compat).

Note: widget wrappers (Hero, Features, Stats, Steps, CallToAction) now accept
`align` and forward it to their internal `<Headline>`.

### ItemGrid — `layout` prop

```astro
<ItemGrid layout="grid" items={...} />     <!-- default -->
<ItemGrid layout="chapters" items={...} /> <!-- editorial list -->
<ItemGrid layout="log" items={...} />      <!-- terminal log -->
```

See `widgets/README.md` for full layout docs.

### WidgetWrapper — `animate` prop (BREAKING)

```astro
<!-- Opt in to intersection-observer fade-in: -->
<WidgetWrapper animate={true}>...</WidgetWrapper>

<!-- Default (0.2.0+): no animation -->
<WidgetWrapper>...</WidgetWrapper>
```

Previously, the wrapper always emitted `motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade`.
Now it only does so when `animate={true}`. This is a **breaking change**: consumers
that relied on the fade-in must add `animate` explicitly.

## Semantic utility classes

The kit now exposes semantic utility classes backed by CSS custom properties:

| Class | CSS variable | Purpose |
|---|---|---|
| `text-eyebrow` | `--aw-color-eyebrow` | Tagline / eyebrow text color |
| `bg-card` | `--aw-color-bg-card` | Card background |
| `border-hairline` | `--aw-color-hairline` | Divider / rule color |
| `text-muted` | `--aw-color-text-muted` | Secondary / muted text |
| `.chapter-num` | `--aw-color-eyebrow` + `--aw-font-mono` | Chapter number badge |

Override all of these via `:root { --aw-color-eyebrow: #d4f100; }` — no need to
override Tailwind class utilities directly.

## Example

```astro
---
import Button from '@krolik/landing-kit/ui/Button';
import Headline from '@krolik/landing-kit/ui/Headline';
import ItemGrid from '@krolik/landing-kit/ui/ItemGrid';
---
<Headline title="Our Features" tagline="Why us" align="left" />
<ItemGrid layout="chapters" items={items} />
<Button variant="primary" text="Get started" href="/signup" />
```

## Dependencies

- `astro-icon` — for icon rendering in Button, ItemGrid, Timeline
- `tailwind-merge` — class merging utility

No internal landing-kit cross-imports except `Background` (imported by `WidgetWrapper`).

## Status

stable (0.2.0)
