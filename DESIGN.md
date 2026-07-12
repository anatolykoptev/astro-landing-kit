# astro-landing-kit design

This document defines the kit's neutral reference theme. Consumer sites should keep their own `DESIGN.md`; use the kit's UI primitives as structural seams and replace scaffold widget markup on brand-led pages.

## Color

| Role | Value | Use |
|---|---|---|
| `--bg` | `#FCFCFD` | Page background surface |
| `--surface` | `#F5F7F8` | Raised card and panel surface |
| `--ink` | `#101010` | Primary body text foreground |
| `--muted` | `#5C6268` | Muted secondary text |
| `--hairline` | `#C8CDD2` | Borders and dividers |
| `--accent` | `#0D9488` | Primary brand accent and focus indicator |
| `--accent-strong` | `#08776E` | Strong action and hover accent |
| `--on-accent` | `#FCFCFD` | Text on accent fills |
| `--dark` | `#030620` | Dark page background surface |

## Typography

Use a consumer-owned, self-hosted typeface where brand character matters. The zero-config fallback is Inter Variable. Keep body text at least 1rem, use a 60–72ch reading measure, and define the product's hierarchy in the consumer design rather than inheriting widget defaults blindly.

## Layout

Use `--section-y` for page-level vertical rhythm. Compose brand pages from `WidgetWrapper`, `Headline`, and focused custom markup. Stock widgets are scaffolds for prototypes, not a finished visual identity.

## Components

Buttons use semantic foreground, border, surface-hover, and focus-ring tokens. All interactive states must remain visible in light, dark, reduced-motion, and forced-colors modes.

## Motion

Motion is opt-in. Animate opacity and transforms only, and preserve a fully usable static render when reduced motion is requested or JavaScript does not run.
