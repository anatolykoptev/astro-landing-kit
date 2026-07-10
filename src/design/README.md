# design

DESIGN.md → CSS theme token pipeline. Krolik-private toolchain.

## What

Parses a structured `DESIGN.md` (awesome-design-md format) and generates Tailwind v4-compatible CSS custom properties, dark-mode overrides, and pm7 theme overrides. Ships an Astro integration that does this automatically at build time.

## When to use

- Syncing a design system defined in `DESIGN.md` to CSS variables
- Auto-generating dark mode from semantic color tokens
- Searching the pm7 component catalog or section recipes

## API

```ts
// design/index.ts
export function parseDesignMd(content: string, sourcePath?: string): DesignTokens
export function generateThemeCss(tokens: DesignTokens): string
export function generateDarkModeOverrides(tokens: DesignTokens): string
export function generatePm7Overrides(tokens: DesignTokens): string
export function applyDesign(mdPath: string, outPath: string): Promise<void>
export function generateSmartDarkMode(tokens: DesignTokens): string
export default designMdIntegration  // AstroIntegration

// Catalogs
export function searchComponents(query: string): CatalogEntry[]
export function getComponent(id: string): CatalogEntry | undefined
export function listComponents(): CatalogEntry[]
export function searchSections(query: string): SectionRecipe[]
export function getSection(id: string): SectionRecipe | undefined
export function listSections(): SectionRecipe[]
```

## Example

```ts
// astro.config.mjs
import { designMdIntegration } from '@krolik/landing-kit/design/integration';

export default defineConfig({
  integrations: [designMdIntegration({ designMdPath: './DESIGN.md' })],
});
```

## Color bullet format

Section 2 (`## 2. Colors`) bullets look like `* **Name** (VALUE) — role`. `VALUE` accepts
a 6-digit hex code (`#RRGGBB`) or a single-level `oklch(...)`/`rgb(...)`/`rgba(...)`/
`hsl(...)`/`hsla(...)` function call — value-format tolerance only, the bullet/section
structure itself is unchanged.

## Failure behavior

A `DESIGN.md` that parses to **zero colors** — wrong heading, wrong bullet format, or an
unsupported document structure (e.g. a token table instead of bullets) — is a loud,
thrown error naming the source file, not a silent fallback. This applies both to
`parseDesignMd()` directly and to the Astro integration (`designMdIntegration`), which no
longer catches-and-warns on a parse failure: a build with a broken `DESIGN.md` fails
instead of shipping an unthemed site with no signal. A **missing** `DESIGN.md` is not an
error — the integration falls back to the default theme and logs an info line.

## Dependencies

- None external beyond Node `fs`. Internal-only: `parser`, `theme-generator`, `dark-mode`, `apply`.

## Status

krolik-private — Astro integration + pm7 catalog are specific to the krolik stack
