# styles

Tailwind v4 base stylesheet and canonical theme tokens.

## What

Two CSS files:

- **tailwind.css** — Tailwind v4 entry point. Imports base, typography plugin, sets Tailwind `@theme` mappings to `--aw-color-*` CSS variables, and defines utility/component classes (`btn`, `btn-primary`, etc.). Consumed by `Layout.astro` — already wired in.
- **theme.css** — Canonical color token starter. Import this in your consumer to apply a ready-made neutral-teal palette that you can then override per brand.

## theme.css usage

```css
/* In your consumer's entry stylesheet (e.g. src/styles/app.css) */
@import "@krolik/landing-kit/styles/theme.css";

/* Then override any token for your brand */
:root {
  --aw-color-primary: #10b981;
  --aw-color-secondary: #059669;
}
```

Or import in an Astro layout:

```astro
---
import '@krolik/landing-kit/styles/theme.css';
---
```

## tailwind.css usage

Already imported by `Layout.astro`. Consumers only need this if they are
NOT using `Layout` and still want Tailwind utilities from the kit.

## API

No JS API. CSS import only.

## Token reference

| CSS variable | Purpose |
|---|---|
| `--aw-color-primary` | Primary action color (buttons, links) |
| `--aw-color-secondary` | Secondary / hover state |
| `--aw-color-accent` | Highlight accent |
| `--aw-color-text-heading` | Heading text |
| `--aw-color-text-default` | Body text |
| `--aw-color-text-muted` | Muted / secondary text |
| `--aw-color-bg-page` | Page background |
| `--aw-color-bg-page-dark` | Dark-mode page background |
| `--aw-font-sans` | Sans-serif font stack |
| `--aw-font-serif` | Serif font stack |
| `--aw-font-heading` | Heading font stack |

## Dependencies

- `tailwindcss` v4
- `@tailwindcss/typography`

## Status

stable
