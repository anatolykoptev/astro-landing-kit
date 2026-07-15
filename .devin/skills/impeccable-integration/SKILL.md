---
name: impeccable-integration
description: Use the impeccable design plugin with astro-landing-kit — run anti-pattern detection, parse DESIGN.md in both parsers, wire the CI design gate, and use impeccable commands (audit, polish, critique) on kit widgets and consumer pages. Triggers: "impeccable", "design audit", "anti-pattern", "slop detection", "design gate", "DESIGN.md format", "audit design", "polish widgets".
---

# impeccable-integration

How astro-landing-kit and the impeccable Claude Code plugin work together. The kit provides the structural scaffolding; impeccable provides the design-quality enforcement. This skill covers both directions.

## Prerequisites

- Impeccable plugin installed: `~/.claude/plugins/marketplaces/impeccable/`
- CLI available: `node ~/.claude/plugins/marketplaces/impeccable/bin/cli.js`
- Kit repo at `/home/krolik/src/astro-landing-kit`

## Direction 1: Impeccable → Kit (design enforcement)

### Run anti-pattern detection on build output

```bash
# Build first (impeccable scans generated CSS/HTML, not source)
cd /home/krolik/src/astro-landing-kit && npm run build

# Detect on dist/ (jsdom mode — catches linked stylesheets)
node ~/.claude/plugins/marketplaces/impeccable/bin/cli.js detect --json dist/ | python3 -m json.tool

# Fast mode (regex only, no jsdom — faster but less thorough)
node ~/.claude/plugins/marketplaces/impeccable/bin/cli.js detect --fast --json dist/
```

### Known by-design findings (do NOT fix)

| Finding | Why it's by-design |
|---|---|
| `overused-font: Inter` | Inter Variable is the documented zero-config default. Consumers override via DESIGN.md. |
| `pure-black-white: #000` | Tailwind preflight internal CSS variables. Not in kit source. False positive. |

If NEW findings appear after a change, fix them before committing.

### Run on source files (catches issues before build)

```bash
node ~/.claude/plugins/marketplaces/impeccable/bin/cli.js detect --fast --json src/
```

### CI design gate (already wired)

`.github/workflows/actions.yaml` runs `npx impeccable detect --fast dist/` after build. Advisory mode (`|| true`) — doesn't fail CI yet. To harden: remove `|| true` once the team commits to zero new findings.

### Impeccable commands on kit widgets

The kit's 22 scaffold widgets are the ideal test surface for impeccable commands:

```bash
# Load context (PRODUCT.md + DESIGN.md)
node ~/.claude/plugins/marketplaces/impeccable/.agents/skills/impeccable/scripts/load-context.mjs

# Then in Claude Code:
# /impeccable audit src/components/widgets/Features.astro
# /impeccable polish src/components/widgets/Gallery.astro
# /impeccable critique src/components/widgets/Pricing.astro
```

Register = `brand` (set in PRODUCT.md). The kit's widgets are brand-register scaffolds.

## Direction 2: Kit → Impeccable (making impeccable's job easier)

### DESIGN.md dual-parser format

The kit's DESIGN.md is written to parse in BOTH:
- **Kit parser** (`src/design/parser.ts`): reads markdown tables + bullet format with `—` separator
- **Impeccable parser** (`design-parser.mjs`): reads YAML frontmatter + `### Subsection` bullets with `:` separator

Format rules for dual-parser compat:

1. **YAML frontmatter**: Stitch-spec format (colors, typography, rounded, spacing, components). Both parsers read this.
2. **Colors section**: `### Primary` / `### Neutral` subsections with `- **Name** (value): description` bullets (impeccable) + markdown table below (kit parser).
3. **Typography section**: `**Display Font:** Family` lines + `### Hierarchy` with `- **Role** (specs): purpose` bullets. Avoid nested parens like `clamp(...)` in bullets — use `max 4rem` instead.
4. **Elevation section**: `### Shadows` with `- **Name** (\`box-shadow: value\`): purpose` bullets.
5. **Components section**: `### Button` / `### Forms` subsections with `- **Variant**: description` bullets.
6. **Do's and Don'ts**: `### Do` and `### Don't` subsections with plain bullets.

### PRODUCT.md for context loader

`PRODUCT.md` at repo root provides impeccable's context loader with:
- Product purpose, users, register (brand), anti-references, strategic principles

Without PRODUCT.md, impeccable commands prompt to run `/impeccable teach` first.

### Kit widgets as impeccable test fixtures

The kit's scaffold widgets contain exactly the patterns impeccable detects:
- `Features.astro` → `icon-tile-stack` + `everything-centered`
- `Hero.astro` → `hero-eyebrow-chip`
- `Stats.astro` → `flat-type-hierarchy`
- `Pricing.astro` → `nested-cards`
- `Steps.astro` → `monotonous-spacing`

This makes the kit a real-world test fixture for impeccable's detector. To add the kit as a fixture in impeccable's test suite, see `tests/framework-fixtures/README.md` in the impeccable repo.

### Token discipline for impeccable's theming audit

The kit's `--aw-color-*` semantic token system aligns with impeccable's theming audit dimension:
- All colors flow through tokens (impeccable's "Theming" score benefits)
- Dark mode uses the same token names with different values
- No hard-coded colors in source (verified by `impeccable detect`)

When adding new components, use `--aw-color-*` tokens exclusively. Hard-coded colors trigger impeccable's `gray-on-color` or `pure-black-white` rules.

## Boundaries

- Do NOT run `npx impeccable skills install` inside the kit repo — the kit is a library, not a consumer project. Skills install is for consumer repos.
- Do NOT use `@vite-pwa/astro` or other PWA plugins — the kit ships its own SW integration (see pwa-setup skill).
- Do NOT fix the 2 known by-design findings (Inter Variable, Tailwind #000) — they are documented and expected.
- Do NOT add `|| false` to the CI gate without team consensus — advisory mode is intentional.
- Do NOT use impeccable's `/craft` or `/shape` commands on scaffold widgets — they're prototypes, not brand surfaces. Use `/audit` and `/polish` instead.
