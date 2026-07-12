# styles

Tailwind v4 base stylesheet and canonical theme tokens.

## What

Two CSS files:

- **tailwind.css** — Tailwind v4 entry point. Imports base, typography plugin, sets Tailwind `@theme` mappings to `--aw-color-*` CSS variables, and defines utility/component classes (`btn`, `btn-primary`, etc.). Consumed by `Layout.astro` — already wired in.
- **theme.css** — Canonical color token starter. Import this in your consumer to apply a ready-made neutral-teal palette that you can then override per brand. Wrapped in the `landing-kit-theme-starter` cascade layer — see `src/design/README.md` "Precedence" for how this ranks against `CustomStyles.astro` defaults and an opt-in `DESIGN.md` theme.

## theme.css usage

```css
/* In your consumer's entry stylesheet (e.g. src/styles/app.css) */
@import "astro-landing-kit/styles/theme.css";

/* Then override any token for your brand */
:root {
  --aw-color-primary: #10b981;
  --aw-color-secondary: #059669;
}
```

Or import in an Astro layout:

```astro
---
import 'astro-landing-kit/styles/theme.css';
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
| `--aw-color-on-primary` | Text on primary action fills |
| `--aw-color-focus-ring` | Keyboard focus indicator |
| `--aw-color-focus-offset` | Focus-ring separation from the page |
| `--aw-color-border` | Interactive borders and header dividers |
| `--aw-color-surface-hover` | Neutral hover surface |
| `--aw-font-sans` | Sans-serif font stack |
| `--aw-font-serif` | Serif font stack |
| `--aw-font-heading` | Heading font stack |
| `--section-y` | Section vertical rhythm (clamp) — the one wired spacing token |

## Spacing system

The kit spaces everything on Tailwind's native **4px-base grid** — the same
math as the industry-standard 8-point scale (Apple HIG, Material 8dp): every
gap a multiple of 4/8px, so the rhythm reads deliberate: **tight within a
group, generous between sections**, at every breakpoint including mobile.

**There is intentionally no separate `--space-*` custom-property scale.**
Widgets already sit on the grid via Tailwind's own spacing utilities (`gap-8`,
`mb-12`, `p-6`, …) — introducing a parallel set of CSS variables that nothing
in the kit reads would be dead weight a consumer could "override" with no
effect. If you want to re-scale intra-widget spacing, override the Tailwind
theme's `--spacing` unit yourself, or pass `classes.container`/`classes.items`
overrides per widget (every widget forwards these — see each widget's props).

The reference table below is **informational** (which Tailwind utility to
reach for at each step) — not a set of overridable tokens:

| 4px-grid step | Tailwind utility | Typical use in this kit |
|---|---|---|
| 4px | `*-1` | Tiny gaps: status dots, inline icon nudges |
| 8px | `*-2` | Compact inline gaps: chips, badge padding |
| 12px | `*-3` | Tight list gaps, title→description |
| 16px | `*-4` | Standard inner padding, title→subtitle, page gutter (mobile) |
| 24px | `*-6` | CTA card padding, action-row gap, page gutter (≥md) |
| 32px | `*-8` | Card padding, base grid gap, section-head margin (mobile) |
| 48px | `*-12` | Large grid gaps, section-head margin (desktop) |
| 64px | `*-16` | Hero sub-block bottom pad (desktop) |

### Section rhythm — the one real token

```css
--section-y: clamp(56px, 10vw, 104px);
```

This is the **only** spacing custom property the kit ships, because it's the
only one anything reads: `WidgetWrapper` renders `.aw-section { padding-block:
var(--section-y) }`, and the heroes (`Hero`/`HeroText`/`Hero2`, which don't use
`WidgetWrapper`) consume the same token via `py-[var(--section-y)]` — so the
whole page shares one rhythm, and overriding this one line re-tempos every
section, everywhere, at once. It replaces the old ad-hoc `py-12 / md:py-16 /
lg:py-20` spread across three media queries.

- **Floor 56px** below a ~560px viewport (phones) — tight enough not to crowd,
  never a desktop-sized gap crammed onto a phone.
- **Ceiling 104px** above a ~1040px viewport (desktop) — generous band
  separation.
- **Ramps linearly (`10vw`) between those two widths** — which is exactly the
  tablet band (~560–1040px, i.e. roughly 768–1024px viewports). This
  coefficient was tuned (from an earlier `8vw`) specifically so the tablet
  band doesn't dip below the old desktop value on the way up — see "Tablet
  band" below.

### Tablet band — why `10vw`, not `8vw`

The kit's default `Hero` had a **flat 80px** padding for any viewport ≥768px
(`py-12 md:py-20`, no `lg:` step) under the old ad-hoc rules. A first pass at
this clamp used `8vw`, which put the tablet band (~768px) at only `61.44px` —
a **-23% dip** right at the phone→tablet transition, i.e. Hero would visibly
get *tighter* switching from mobile to tablet before opening back up on
desktop. `10vw` fixes this: at 768px the clamp evaluates to `76.8px` (-4% vs
the old flat 80px — within normal responsive variance, not a visible cramp),
and by 1024px it's `102.4px` (+28%, already almost at the desktop ceiling). See
"Enumerated shifts" below for the full breakpoint table.

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
on ≥md (the standard marketing gutters; both land on the 4px grid). Left as
Tailwind utilities on purpose — no token needed, and a consumer can override
them per-widget via `containerClass`.

### Overriding

```css
:root {
  --section-y: clamp(48px, 7vw, 88px); /* tighter overall tempo, same shape */
}
```

Because `.aw-section` and the heroes both read `var(--section-y)`, one override
cascades everywhere the token is used — the whole page re-tempos from one line.

### Enumerated default-render shifts (vs. the pre-PR kit)

| Breakpoint | WidgetWrapper sections (before → after) | Hero (before → after) |
|---|---|---|
| Mobile ~390px | 0px¹ → **56px** | 48px → **56px** (+17%) |
| Tablet ~768px | 64px → **76.8px** (+20%) | 80px → **76.8px** (**-4%**, negligible) |
| Tablet/laptop ~1024px | 80px → **102.4px** (+28%) | 80px → **102.4px** (+28%) |
| Desktop ≥1040px (e.g. 1440px) | 80px → **104px** (+30%) | 80px → **104px** (+30%) |

¹ The pre-PR `.aw-section` mobile rule never actually compiled — a stray `*/`
inside its own CSS comment closed the comment early and silently ate the base
(<768px) padding rule (see commit history). So mobile sections rendered at
**0px** padding on the unpatched kit, not the 48px the code intended; "after" is
both the retune *and* a bug fix. Hero's own padding wasn't affected by that bug
(it's a plain `<section>`, not a `.aw-section`), so its mobile 48px→56px number
above is purely the retune.

**Net**: roughly **+20–30% more section air on tablet/desktop**, a restored
(and slightly tightened) mobile floor, and — the point of the `10vw` tune — no
breakpoint where the page gets visibly *tighter* than before on the way up.

> Note: this spacing reference lives here (not in a root `DESIGN.md`) because in
> this repo the root `DESIGN.md` path is claimed by the color theme integration
> (`src/design/integration.ts`), which requires a `## 2. Colors` section and
> fails the build on a colorless doc by design. See `src/design/README.md`.

## Dependencies

- `tailwindcss` v4
- `@tailwindcss/typography`

## Status

stable
