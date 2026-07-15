---
publishDate: 2026-07-16
title: 'Why a landing kit, not a template'
excerpt: "Templates lock you into someone else's design decisions. A kit gives you structural primitives and lets you compose your own."
category: 'Philosophy'
tags: ['design', 'architecture', 'astro']
author: 'Anatoly Koptev'
---

Templates are fast until they're not. You pick one, swap the colors, change the copy, and ship. Then you need a section the template doesn't have. You hack it in. Then another. Six months later, the codebase is a template-shaped pile of exceptions.

A kit is different. It gives you primitives — `WidgetWrapper`, `Headline`, `Button`, `ItemGrid` — and lets you compose sections from them. The structure is reusable; the design is yours.

## The template trap

The template trap works like this:

1. You find a template that looks close enough.
2. You change the colors and fonts.
3. You ship it.
4. A month later, you need a feature the template doesn't support.
5. You write around the template's structure, not with it.
6. The codebase drifts. Every new section is a fight.

The root cause: a template encodes someone else's design decisions at the markup level. Changing colors doesn't change the structure. The icon-grid features section is still an icon-grid features section, no matter what color you paint it.

## What a kit gives you instead

The kit provides three layers:

- **UI primitives** (`ui/*`): `Button`, `Headline`, `WidgetWrapper`, `ItemGrid`. These are structure-only — no opinionated content, no locked layout.
- **Scaffold widgets** (`widgets/*`): Fast-prototype shapes for MVPs and internal pages. Not for brand-register pages.
- **Islands** (`islands/*`): Svelte 5 components for interactive elements — forms, accordions, sliders, counters.

You compose sections from `ui/*` primitives. The widget layer exists for prototyping, not shipping. The distinction matters: a scaffold widget is a starting point, not a finished surface.

## The DESIGN.md contract

The kit's `DESIGN.md` format is the bridge between design decisions and code. You write one file in Stitch-spec format:

```yaml
---
colors:
  accent: "#0D9488"
  bg: "#FCFCFD"
typography:
  display:
    fontFamily: "Spline Sans Variable"
---
```

The kit parses it into `--aw-color-*` CSS variables. The impeccable plugin parses the same file for design-system context. No separate token file, no sync drift.

## When to use a template instead

Templates are the right choice when:

- You need a site live in a weekend, not a codebase you'll maintain for years.
- The template's structure matches your needs exactly.
- You don't need to differentiate visually.

A kit is the right choice when:

- You're building a product that needs its own visual identity.
- You'll add sections the original template didn't anticipate.
- You want design tokens, PWA, forms, and SEO built in, not bolted on.

Both are valid. The trap is picking a template when you need a kit, then fighting the template for years.
