---
name: Astro Landing Kit
description: Neutral reference theme — teal accent on warm-paper surfaces, Inter Variable fallback, flat surfaces at rest.

colors:
  bg: "#FCFCFD"
  surface: "#F5F7F8"
  ink: "#101010"
  muted: "#5C6268"
  hairline: "#C8CDD2"
  accent: "#0D9488"
  accent-strong: "#08776E"
  on-accent: "#FCFCFD"
  dark: "#030620"

typography:
  display:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
---

# astro-landing-kit design

This document defines the kit's neutral reference theme. Consumer sites should keep their own `DESIGN.md`; use the kit's UI primitives as structural seams and replace scaffold widget markup on brand-led pages.

## Overview

The kit ships a neutral teal-on-warm-paper default. Every color flows through `--aw-color-*` semantic tokens so a consumer's DESIGN.md override (or `designMdIntegration()`) replaces the full palette in one pass. Inter Variable is the zero-config fallback — consumers should self-host a distinctive face where brand character matters.

## Colors

| Role | Token | Value | Use |
|---|---|---|---|
| Page background | `--aw-color-bg-page` | `#FCFCFD` | Page background surface |
| Card surface | `--aw-color-bg-card` | `#F5F7F8` | Raised card and panel surface |
| Body text | `--aw-color-text-default` | `#101010` | Primary body text foreground |
| Muted text | `--aw-color-text-muted` | `#5C6268` | Muted secondary text |
| Hairline | `--aw-color-border` | `#C8CDD2` | Borders and dividers |
| Accent | `--aw-color-primary` | `#0D9488` | Primary brand accent and focus indicator |
| Accent strong | `--aw-color-secondary` | `#08776E` | Strong action and hover accent |
| On-accent | `--aw-color-on-primary` | `#FCFCFD` | Text on accent fills |
| Dark surface | `--aw-color-bg-page-dark` | `#030620` | Dark page background surface |

All neutrals are tinted (chroma 0.005–0.01), never pure #000 or #fff. The accent is a desaturated teal (oklch ~62% 0.12 180) — distinctive enough to not read as "AI default blue/violet" while neutral enough to override cleanly.

## Typography

Use a consumer-owned, self-hosted typeface where brand character matters. The zero-config fallback is Inter Variable. Keep body text at least 1rem, use a 60–72ch reading measure, and define the product's hierarchy in the consumer design rather than inheriting widget defaults blindly.

| Role | Font | Size | Weight | Line height |
|---|---|---|---|---|
| Display | Inter Variable | clamp(2.5rem, 6vw, 4rem) | 700 | 1.1 |
| Headline | Inter Variable | clamp(1.75rem, 4vw, 2.5rem) | 600 | 1.2 |
| Body | Inter Variable | 1rem | 400 | 1.6 |
| Caption | Inter Variable | 0.875rem | 400 | 1.5 |

## Elevation

Flat surfaces at rest. Shadows are reserved for floating elements (sticky CTA, dropdown menus, modal overlays). Cards use surface color differentiation (`--aw-color-bg-card` vs `--aw-color-bg-page`), not shadow depth.

## Components

Buttons use semantic foreground, border, surface-hover, and focus-ring tokens. All interactive states must remain visible in light, dark, reduced-motion, and forced-colors modes. Form inputs inherit `--aw-color-border` for outlines and `--aw-color-primary` for focus rings.

## Do's and Don'ts

### Do

- Override `--aw-color-*` tokens in one consumer stylesheet or enable `designMdIntegration()`
- Compose sections from `ui/*` primitives (`WidgetWrapper`, `Headline`, `Button`)
- Self-host a distinctive typeface for brand-register pages
- Use `--aw-color-bg-card` for raised surfaces, not shadow elevation

### Don't

- Ship scaffold widgets (`widgets/*`) as-is on brand-register pages
- Hard-code colors (use semantic tokens instead)
- Use pure `#000` or `#fff` — tint every neutral toward the brand hue
- Animate CSS layout properties (use transform and opacity only)
