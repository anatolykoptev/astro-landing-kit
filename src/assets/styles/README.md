# styles

Tailwind v4 base stylesheet and canonical theme tokens.

## What

Two CSS files:

- **tailwind.css** — Tailwind v4 entry point. Imports base, typography plugin, sets Tailwind `@theme` mappings to `--aw-color-*` CSS variables, and defines utility/component classes (`btn`, `btn-primary`, etc.). Consumed by `Layout.astro` — already wired in.
- **theme.css** — Canonical color token starter. Import this in your consumer to apply a ready-made neutral-teal palette that you can then override per brand. Wrapped in the `landing-kit-theme-starter` cascade layer — see `src/design/README.md` "Precedence" for how this ranks against `CustomStyles.astro` defaults and an opt-in `DESIGN.md` theme.

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

The override block above is un-layered, so it wins over `theme.css` (and even over a
`DESIGN.md` theme, if the design integration is also mounted) regardless of import order
— un-layered CSS always beats any named cascade layer.

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
| `--space-1` … `--space-11` | 8pt spacing scale (see below) |
| `--section-y` | Section vertical rhythm (clamp) |

## Spacing system

The kit spaces everything on a **canonical 8-point grid** — the industry
standard (Apple HIG, Material 8dp, most professional design systems). Every gap
is a multiple of 4/8px, so the vertical rhythm reads deliberate: **tight within a
group, generous between sections**, at every breakpoint including mobile. The
tokens are declared unlayered on `:root` in `tailwind.css` and are overridable
from a consumer's own unlayered `:root` (later same-specificity wins).

### The scale — 11 named steps

| Token | Value | Tailwind equiv | Typical use |
|-------|-------|----------------|-------------|
| `--space-1` | 4px | `*-1` | Tiny gaps: status dots, inline icon nudges |
| `--space-2` | 8px | `*-2` | Compact inline gaps: chips, badge padding |
| `--space-3` | 12px | `*-3` | Tight list gaps, title→description |
| `--space-4` | 16px | `*-4` | Standard inner padding, title→subtitle |
| `--space-5` | 24px | `*-6` | Card padding (compact), CTA action-row gap |
| `--space-6` | 32px | `*-8` | Card padding, base grid gap, section-head margin (mobile) |
| `--space-7` | 48px | `*-12` | Large grid gaps, section-head margin (desktop) |
| `--space-8` | 64px | `*-16` | Hero sub-block bottom pad (desktop) |
| `--space-9` | 80px | `*-20` | Reserved (tall dividers) |
| `--space-10` | 96px | `*-24` | Reserved (generous section air) |
| `--space-11` | 128px | `*-32` | Reserved (full-page spacers) |

The scale is realized **two coherent ways — both the same 4px grid:**

1. **Named `--space-*` custom properties** — for direct `var()` use in kit CSS
   and for consumer override.
2. **Tailwind's native spacing utilities** — `gap-8`, `mb-12`, `p-6`, … resolve
   to the identical 4px-base grid (Tailwind's default `--spacing` is `0.25rem`).
   `--space-6` == `gap-8`/`p-8` == 32px, `--space-7` == `gap-12`/`mb-12` == 48px
   (see the *Tailwind equiv* column). Widgets use the Tailwind utilities for
   intra-section spacing — the framework-idiomatic way to sit on the grid,
   without fighting it via arbitrary values.

### Section rhythm — one clamp

```css
--section-y: clamp(56px, 8vw, 104px);
```

A **single canonical token** drives section top+bottom padding at every
breakpoint, replacing the old ad-hoc `py-12 / md:py-16 / lg:py-20` spread across
three media queries. It floors at **56px** on mobile (tight enough not to crowd,
never a desktop-sized gap crammed onto a phone) and ceils at **104px** on desktop
(generous band separation), tracking `8vw` in between. Tune this one token to
re-tempo the whole page. `WidgetWrapper` renders `.aw-section { padding-block:
var(--section-y) }`; the heroes (not `WidgetWrapper`) consume the same token via
`py-[var(--section-y)]`, so the whole page shares one rhythm.

**Adjacency rule (no doubled gaps).** A single symmetric value cannot *both*
give a filled (`isDark`/`bg`) band enough internal padding *and* avoid a doubled
gap where two open sections stack (`2 × --section-y`, which reads as a wall —
worst on mobile). So when an **open** section directly follows another section,
its top pad collapses to `0` and the two share **one** `--section-y` of rhythm:

```css
.aw-section { padding-block: var(--section-y); }              /* base symmetric rhythm */
section + section > .aw-section:not(.dark) { padding-top: 0; } /* collapse when open sections stack */
```

Filled bands keep symmetric padding so the color block always has equal air top
and bottom. This is the canonical expression of *"open sections share one
rhythm; filled bands own symmetric padding"* — driven entirely by the token, not
hardcoded values.

### Horizontal gutter

`WidgetWrapper` uses `px-4 md:px-6` — **16px** page-edge gutter on mobile, **24px**
on ≥md (the standard marketing gutters; both land on the grid, `--space-4` /
`--space-5`). Left as Tailwind utilities on purpose: they already sit on the grid,
and a consumer can override them per-widget via `containerClass`.

### Overriding

```css
:root {
  --section-y: clamp(48px, 7vw, 88px); /* tighter overall tempo */
  --space-6: 40px;                     /* re-scale a single step */
}
```

Because kit CSS reads these via `var()`, one override cascades everywhere.

> Note: this spacing reference lives here (not in a root `DESIGN.md`) because in
> this repo the root `DESIGN.md` path is claimed by the color theme integration
> (`src/design/integration.ts`), which requires a `## 2. Colors` section and
> fails the build on a colorless doc by design. See `src/design/README.md`.

## Dependencies

- `tailwindcss` v4
- `@tailwindcss/typography`

## Status

stable
