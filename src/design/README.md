# design

DESIGN.md → CSS theme token pipeline. Krolik-private toolchain.

## What

Parses a structured `DESIGN.md` (awesome-design-md format) and generates the
`--aw-color-*` CSS custom properties the kit's widgets and `tailwind.css` actually read,
plus an auto `.dark` override. Ships an Astro integration that wires this at build time.

## How it flows (one path)

There is exactly **one** apply path — the Astro integration:

```
DESIGN.md
  → parseDesignMd()            (parser.ts)
  → generateThemeCss()         (:root { --aw-color-* })      (theme-generator.ts)
  + generateSmartDarkMode()    (.dark { --aw-color-* })      (dark-mode.ts)
  → designMdIntegration        overrides theme-source.ts via a Vite `load` hook
  → <DesignTheme />            injects it as an inline <style> after <CustomStyles />
  → the browser                DESIGN.md --aw-color-* win by cascade order
```

Why `--aw-color-*` and not Tailwind `@theme { --color-* }`: every widget, `tailwind.css`
(`--color-primary: var(--aw-color-primary)`) and `pm7-bridge.css` derive from
`--aw-color-*`. Overriding those re-skins everything; overriding the Tailwind names would
miss `.btn-primary`, `.bg-page`, pm7, etc.

**Load order (load-bearing):** `CustomStyles.astro` renders the kit-neutral defaults
FIRST; `<DesignTheme />` renders immediately after it, so the DESIGN.md `:root` / `.dark`
overrides come LATER in the cascade and win. Do not reorder them in `Layout.astro`.

## Opt-in (and backward compatibility)

The integration is **opt-in**. Add it to your `astro.config`:

```ts
// astro.config.mjs
import designMdIntegration from '@krolik/landing-kit/design/integration';

export default defineConfig({
  integrations: [
    designMdIntegration({ designMd: './DESIGN.md' }), // designMd is the default; can omit
  ],
});
```

A consumer that does **not** add the integration is unaffected: `theme-source.ts` keeps
its `export const designThemeCss = ''`, `<DesignTheme />` injects nothing, and the site
renders exactly the `CustomStyles.astro` defaults — identical to before this pipeline
existed. A consumer that hand-wires its own `--aw-color-*` (e.g. a manual `tokens.css`)
also keeps working; opting in simply replaces that manual step.

## API

```ts
// design/index.ts
export function parseDesignMd(content: string, sourcePath?: string): DesignTokens
export function generateThemeCss(tokens: DesignTokens): string        // :root { --aw-color-* }
export function generateSmartDarkMode(tokens: DesignTokens): string   // .dark { --aw-color-* }
export default designMdIntegration  // AstroIntegration

// Catalogs
export function searchComponents(query: string): CatalogEntry[]
export function getComponent(id: string): CatalogEntry | undefined
export function listComponents(): CatalogEntry[]
export function searchSections(query: string): SectionRecipe[]
export function getSection(id: string): SectionRecipe | undefined
export function listSections(): SectionRecipe[]
```

## Color bullet format

Section 2 (`## 2. Colors`) bullets look like `* **Name** (VALUE) — role`. `VALUE` accepts
a 6-digit hex code (`#RRGGBB`) or a single-level `oklch(...)`/`rgb(...)`/`rgba(...)`/
`hsl(...)`/`hsla(...)` function call — value-format tolerance only, the bullet/section
structure itself is unchanged. Role words route to targets: the first color is `primary`
(also `secondary`/`accent` unless a `Secondary`/`Accent` color is named);
`surface`/`background` → `bg-page`; `text`/`foreground`/`body` → `text-default`; `muted` →
`text-muted`; `heading`/`display`/`title` → `text-heading`.

## Failure behavior

A `DESIGN.md` that parses to **zero colors** — wrong heading, wrong bullet format, or an
unsupported document structure (e.g. a token table instead of bullets) — is a loud, thrown
error naming the source file, not a silent fallback. This applies both to
`parseDesignMd()` directly and to the integration, which does not catch-and-warn: a build
with a broken `DESIGN.md` fails instead of shipping an unthemed site. A **missing**
`DESIGN.md` is not an error — the integration logs an info line and the kit renders its
defaults. Non-hex color values are handled without NaN-poisoning the dark-mode
classification (a non-hex value it cannot classify is skipped, never counted as dark).

## Dependencies

- None external beyond Node `fs`. Internal-only: `parser`, `theme-generator`, `dark-mode`.

## Status

krolik-private — Astro integration + pm7 catalog are specific to the krolik stack.
