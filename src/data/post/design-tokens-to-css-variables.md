---
publishDate: 2026-07-15
title: 'From DESIGN.md to CSS variables in one build step'
excerpt: 'How the kit parses a Stitch-spec DESIGN.md into semantic CSS custom properties — and why both the kit parser and the impeccable plugin read the same file.'
category: 'Engineering'
tags: ['design-tokens', 'css', 'astro']
author: 'Anatoly Koptev'
---

The kit's design-token pipeline has one source of truth: `DESIGN.md`. One file, two parsers, zero drift.

## The format

`DESIGN.md` follows the [Google Stitch spec](https://stitch.withgoogle.com/docs/design-md/format/): YAML frontmatter carrying machine-readable tokens, followed by a markdown body with six canonical sections.

```yaml
---
name: My Brand
colors:
  accent: "#0D9488"
  bg: "#FCFCFD"
  ink: "#101010"
typography:
  display:
    fontFamily: "Spline Sans Variable"
    fontWeight: 700
rounded:
  md: "8px"
  pill: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
---
```

The frontmatter is the machine-readable layer. The markdown body — Overview, Colors, Typography, Elevation, Components, Do's and Don'ts — provides context for how to apply the tokens.

## The kit parser

`src/design/parser.ts` reads the frontmatter and markdown body, extracts color tokens, typography hierarchy, border-radius, and fonts, and emits them as CSS custom properties:

```css
:root {
  --aw-color-primary: #0D9488;
  --aw-color-bg-page: #FCFCFD;
  --aw-color-text-default: #101010;
  --aw-font-heading: 'Spline Sans Variable', sans-serif;
}
```

The `designMdIntegration()` Astro integration runs this parser at build time and injects the CSS into a named cascade layer (`landing-kit-design-theme`) that sits above the kit's defaults and the theme-starter layer.

## The impeccable parser

The [impeccable](https://impeccable.style) plugin ships its own `design-parser.mjs` that reads the same `DESIGN.md` file. It extracts:

- **Colors** grouped by subsection (Primary, Neutral) with named rules
- **Typography** hierarchy with font, weight, size, line-height per role
- **Elevation** shadows with name and value
- **Components** with variants and properties
- **Do's and Don'ts** as structured lists

This gives impeccable's `/audit`, `/polish`, and `/critique` commands the design-system context they need to evaluate a page against the project's own rules.

## Why one file, not two

The alternative is a token file for the build (JSON, YAML, or Style Dictionary) and a separate design doc for humans. This works until someone updates one and forgets the other. Then the build says one thing and the design review says another.

With one file:

- The build parses the frontmatter → CSS variables.
- The design plugin parses the same file → context for quality checks.
- The human reads the markdown body → understanding of how to apply the tokens.

No sync, no drift. The file is the contract.

## Token references in components

The frontmatter supports token references in component definitions:

```yaml
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
```

This lets you define a component's properties in terms of the design system's primitives, not hard-coded values. A consumer reading the file understands that the primary button uses the accent color and pill radius — they don't have to cross-reference a separate token table.
