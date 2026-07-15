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

rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section-y: "96px"

components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.accent-strong}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
---

# astro-landing-kit design

This document defines the kit's neutral reference theme. Consumer sites should keep their own `DESIGN.md`; use the kit's UI primitives as structural seams and replace scaffold widget markup on brand-led pages.

## Overview

The kit ships a neutral teal-on-warm-paper default. Every color flows through `--aw-color-*` semantic tokens so a consumer's DESIGN.md override (or `designMdIntegration()`) replaces the full palette in one pass. Inter Variable is the zero-config fallback — consumers should self-host a distinctive face where brand character matters.

## Colors

A two-chord palette: warm-paper neutrals with a near-imperceptible teal tint, plus one desaturated teal accent. No secondary or tertiary accents in the core system — the restraint is doctrinal. All neutrals are tinted (chroma 0.005–0.01), never pure #000 or #fff.

### Primary

- **Accent** (#0D9488): The one vibrant voice. Primary CTAs, active navigation states, focus indicators, links. Never used as a gradient, never as a background wash, never as text fill. Rarity is the design choice.
- **Accent Strong** (#08776E): Hover/active state for Accent. Small darkening, confirms interaction without shouting.

### Neutral

- **Page Background** (#FCFCFD): Primary page background. Near-white with a near-imperceptible tint that creates subconscious cohesion with the teal accent. Used on `body` and standard surfaces.
- **Card Surface** (#F5F7F8): Raised card and panel surface. Differentiated from page background by color, not shadow depth.
- **Body Text** (#101010): Primary text for body copy and headlines. Softer than pure black, reads as confident-but-not-aggressive on warm paper.
- **Muted Text** (#5C6268): Secondary text — taglines, supporting copy, captions. Clearly subordinate to Body Text without being washed out.
- **Hairline** (#C8CDD2): Borders, dividers, the barely-visible structural seams.
- **On-Accent** (#FCFCFD): Text on accent fills. Same tinted-white as page background for cohesion.
- **Dark Surface** (#030620): Dark page background surface. Deep navy-black, tinted toward the accent hue family.

### Named Rules

**The One Accent Rule.** Accent is the only vibrant color in the system. No supporting accent is added, ever. If a second emphasis point is needed, use scale or weight, never a second hue.

**The Tinted-Neutral Rule.** Every neutral is tinted toward the brand hue (chroma 0.005–0.01). Pure #000 and #fff are banned — they read as generic and harsh.

**The Token-First Rule.** All colors must flow through `--aw-color-*` semantic tokens. Hard-coded hex values in components are a bug, not a shortcut.

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

## Typography

**Display Font:** Inter Variable (with sans-serif fallback)
**Body Font:** Inter Variable (with sans-serif fallback)

Inter Variable is the zero-config fallback. Consumers should self-host a distinctive face where brand character matters. Keep body text at least 1rem, use a 60–72ch reading measure.

### Hierarchy

- **Display** (Inter Variable, weight 700, max 4rem, line-height 1.1): Hero headlines and page titles. One per page.
- **Headline** (Inter Variable, weight 600, max 2.5rem, line-height 1.2): Section headings. The structural backbone of the page.
- **Body** (Inter Variable, weight 400, 1rem, line-height 1.6): Body copy, paragraphs, list items. The reading layer.
- **Caption** (Inter Variable, weight 400, 0.875rem, line-height 1.5): Micro-labels, captions, meta lines, supporting metadata.

| Role | Font | Size | Weight | Line height |
|---|---|---|---|---|
| Display | Inter Variable | clamp(2.5rem, 6vw, 4rem) | 700 | 1.1 |
| Headline | Inter Variable | clamp(1.75rem, 4vw, 2.5rem) | 600 | 1.2 |
| Body | Inter Variable | 1rem | 400 | 1.6 |
| Caption | Inter Variable | 0.875rem | 400 | 1.5 |

## Elevation

Flat surfaces at rest. Shadows are reserved for floating elements only — sticky CTA, dropdown menus, modal overlays. Cards use surface color differentiation (`--aw-color-bg-card` vs `--aw-color-bg-page`), not shadow depth.

### Shadows

- **Floating** (`box-shadow: 0 4px 12px rgba(0,0,0,0.08)`): Sticky CTA bar, dropdown menus. Subtle, functional.
- **Overlay** (`box-shadow: 0 12px 40px rgba(0,0,0,0.12)`): Modal dialogs and full-screen overlays. Diffused, not sharp.

**The Flat-At-Rest Rule.** Cards and panels at rest use color differentiation, never shadow. Shadow implies motion — a resting element casting a shadow reads as floating without reason.

## Components

### Buttons

- **Primary**: Accent background, on-accent text. Used for the one primary action per page.
- **Secondary**: Transparent background, accent border, accent text. Used for secondary actions.
- **Ghost**: Transparent background, no border, muted text. Used for tertiary navigation.

All button states (hover, focus, active, disabled) must remain visible in light, dark, reduced-motion, and forced-colors modes. Focus ring uses `--aw-color-primary` at 2px offset.

### Forms

- **Inputs**: Hairline border, body-text color, accent focus ring at 2px.
- **Labels**: Caption typography, muted color.
- **Error states**: Accent-strong border, no red — the kit's accent is the semantic color for all states.

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
