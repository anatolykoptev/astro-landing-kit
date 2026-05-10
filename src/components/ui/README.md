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

## Example

```astro
---
import Button from '@krolik/landing-kit/ui/Button';
import Headline from '@krolik/landing-kit/ui/Headline';
---
<Headline title="Our Features" tagline="Why us" />
<Button variant="primary" text="Get started" href="/signup" />
```

## Dependencies

- `astro-icon` — for icon rendering in Button, ItemGrid, Timeline
- `tailwind-merge` — class merging utility

No internal landing-kit cross-imports except `Background` (imported by `WidgetWrapper`).

## Status

stable
