# design

DESIGN.md → CSS theme token pipeline. Krolik-private toolchain.

## What

Parses a structured `DESIGN.md` (awesome-design-md format) and generates the
`--aw-color-*` CSS custom properties the kit's widgets and `tailwind.css` actually read,
plus an auto `.dark` override. Ships an Astro integration that wires this at build time.

## How it flows (one GENERATION path)

There is exactly **one** path that generates CSS FROM a `DESIGN.md` — the Astro
integration:

```
DESIGN.md
  → parseDesignMd()            (parser.ts)
  → classifyColorRoles()        shared role classifier               (color-roles.ts)
  → generateThemeCss()         (:root { --aw-color-* })              (theme-generator.ts)
  + generateSmartDarkMode()    (.dark { --aw-color-* })              (dark-mode.ts)
  + checkThemeContrast()        build-time WCAG warning              (theme-generator.ts)
  → designMdIntegration        overrides theme-source.ts via a Vite `load` hook,
                                wrapped in the `landing-kit-design-theme` cascade layer
  → <DesignTheme />            injects it as an inline <style>
  → the browser                DESIGN.md --aw-color-* win (layer priority — see below)
```

Why `--aw-color-*` and not Tailwind `@theme { --color-* }`: every widget, `tailwind.css`
(`--color-primary: var(--aw-color-primary)`) and `pm7-bridge.css` derive from
`--aw-color-*`. Overriding those re-skins everything; overriding the Tailwind names would
miss `.btn-primary`, `.bg-page`, pm7, etc.

## Precedence — three SOURCES of `--aw-color-*`, one guaranteed order

There are three places `--aw-color-*` can come from, and — separately from the one
generation path above — their relative priority is fixed by `src/design/theme-layers.css`
via named CSS cascade layers, **not** by import/DOM order:

| Priority (low → high) | Layer name | Source | Nature |
|---|---|---|---|
| 1 | `landing-kit-defaults` | `src/components/CustomStyles.astro` | always present, kit-neutral teal |
| 2 | `landing-kit-theme-starter` | `src/assets/styles/theme.css` | opt-in, consumer `@import`s it manually |
| 3 | `landing-kit-design-theme` | this integration | opt-in, generated from `DESIGN.md` |

Per the CSS Cascading Level 5 spec, layer priority is fixed by the order layer NAMES are
first encountered, independent of where each layer's rules physically appear later. That
means:

- A consumer who imports `theme.css` gets its palette over the kit defaults, **no matter
  where** in their build they `@import` it.
- A consumer who ALSO mounts the design integration gets the `DESIGN.md` theme over
  `theme.css`, again regardless of order.
- A consumer's own **un-layered** `:root { --aw-color-primary: ... }` override (the
  pattern shown in `src/assets/styles/README.md`) still wins over all three layers —
  un-layered rules always beat any named layer per spec. This is intentional: an explicit
  manual override is the most specific signal a consumer can give.
- `theme-layers.css` is imported FIRST in `Layout.astro`, before any of the three
  layers' actual rules, so this order is locked in before anything else is parsed. A
  future reorder of `<CustomStyles />` / `<DesignTheme />` in `Layout.astro` (or a fork of
  it) cannot silently revert a branded consumer to the kit defaults.

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
existed. A consumer that hand-wires its own `--aw-color-*` (e.g. a manual `tokens.css`, or
`theme.css`) also keeps working; opting in simply adds a higher-priority layer on top.

## API

```ts
// design/index.ts
export function parseDesignMd(content: string, sourcePath?: string): DesignTokens
export function classifyColorRoles(colors: ColorToken[]): RoleClassification
export function generateThemeCss(tokens: DesignTokens): string        // :root { --aw-color-* }
export function generateSmartDarkMode(tokens: DesignTokens): string   // .dark { --aw-color-* }
export function checkThemeContrast(tokens: DesignTokens): ContrastCheck | null
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
structure itself is unchanged. Role words route to targets (via the shared
`classifyColorRoles()` in `color-roles.ts`, used by both `theme-generator.ts` and
`dark-mode.ts` so the two never diverge): the first color is `primary` (also
`secondary`/`accent` unless a `Secondary`/`Accent` color is named); `surface`/`background`/
`cream`/`parchment`/`light`/`white`/`warm` → `bg-page`; `text`/`foreground`/`body`/`dark`/
`deep`/`forest` → `text-default`; `muted` → `text-muted`; `heading`/`display`/`title` →
`text-heading`.

**Surface/text pairing (load-bearing):** `--aw-color-bg-page` is only overridden when a
text-role color is ALSO present in the same `DESIGN.md` — a `Surface` bullet with no
`text`/`foreground`/`body` bullet does **not** flip the background, because the default
`--aw-color-text-default` would stay near-black against it (~1.07:1 contrast, invisible
body text). A lone text/heading color is safe to apply alone; the default background
stays the kit's known-light default.

**Dark background:** `--aw-color-bg-page-dark` (dark-mode chrome — footers, headers,
mobile menus) is set from an explicit dark-role color (a bullet whose name/role contains
the word "dark") or, failing that, derived from the darkest classifiable (hex/rgb) color
in the palette, if it's dark enough to serve as one. Otherwise the kit default
(`rgb(3 6 32)`) is kept.

## Contrast check (build-time, non-blocking)

When a paired surface+text override fires, the build logs a WCAG AA warning (ratio below
4.5:1) via `checkThemeContrast()`. This only verifies hex/rgb values — an oklch/hsl pair
logs "could not verify contrast", never a false pass. This is a **warning, not a build
failure**: an intentionally low-contrast pairing is the DESIGN.md author's call, but it
must never be silent.

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

- None external beyond Node `fs`. Internal-only: `parser`, `color-roles`, `contrast`,
  `theme-generator`, `dark-mode`. No color-space conversion library is added on purpose
  (oklch/hsl → sRGB math) — see `contrast.ts`'s doc comment.

## Status

krolik-private — Astro integration + pm7 catalog are specific to the krolik stack.
