# design

DESIGN.md → CSS theme token pipeline.

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

Why `--aw-color-*` and not Tailwind `@theme { --color-* }`: every widget and `tailwind.css`
(`--color-primary: var(--aw-color-primary)`) derive from `--aw-color-*`. Overriding those
re-skins everything; overriding the Tailwind names would miss `.btn-primary`, `.bg-page`, etc.

## Precedence — three SOURCES of `--aw-color-*`

There are three places `--aw-color-*` can come from. Their INTENDED relative priority is
expressed via named CSS cascade layers, declared once by `src/design/theme-layers.css`:

| Priority (low → high) | Layer name | Source | Nature |
|---|---|---|---|
| 1 | `landing-kit-defaults` | `src/components/CustomStyles.astro` | always present, kit-neutral teal |
| 2 | `landing-kit-theme-starter` | `src/assets/styles/theme.css` | opt-in, consumer `@import`s it manually |
| 3 | `landing-kit-design-theme` | this integration | opt-in, generated from `DESIGN.md` |

Per the CSS Cascading Level 5 spec, a named layer's priority is fixed by the order its
NAME is first encountered while the browser parses the page's cascade — **not** by where
that layer's actual rule bodies physically sit. `theme-layers.css`'s bare
`@layer landing-kit-defaults, landing-kit-theme-starter, landing-kit-design-theme;`
statement is what establishes that order, and it **must be the first stylesheet
`Layout.astro` imports** (it's the import at `Layout.astro:2` — do not move it later).

**What this reliably guarantees:** `CustomStyles.astro`'s defaults vs the `DESIGN.md`
theme. Both render from the SAME `Layout.astro` document in the SAME build, so their
layer-name-first-encounter order is fixed by our own component render order — a future
accidental reorder of `<CustomStyles />` / `<DesignTheme />` can't silently flip
precedence, because named-layer priority (not DOM position) is what the browser
evaluates.

**What this does NOT unconditionally guarantee:** where a consumer's OWN
`@import "astro-landing-kit/styles/theme.css"` lands in their build's final bundled CSS
relative to `theme-layers.css`'s declaration is outside this kit's control — a bundler
could, in principle, emit `theme.css`'s `@layer landing-kit-theme-starter { ... }` body in
a position where that layer name is first encountered before our pre-declaration runs,
which would establish a different relative order than intended for that one layer. In
practice this holds correctly when `theme.css` is imported from within the same
Astro page/layout tree as `Layout.astro` (this kit's own dogfood setup, and the common
consumer pattern of a global stylesheet import in a shared layout) — verified against a
real build with `theme.css` imported from a page alongside a mounted DESIGN.md theme. If
`theme.css`'s palette is ever observed NOT losing to a mounted DESIGN.md theme, check that
nothing in the consumer's build defines/references `landing-kit-theme-starter` or
`landing-kit-design-theme` before `theme-layers.css` is parsed.

A consumer's own **un-layered** `:root { --aw-color-primary: ... }` override (the pattern
shown in `src/assets/styles/README.md`) still reliably wins over all three layers,
regardless of the above — un-layered rules always beat any named layer, unconditionally,
per spec. This is intentional: an explicit manual override is the most specific signal a
consumer can give.

## Opt-in (and backward compatibility)

The integration is **opt-in**. Add it to your `astro.config`:

```ts
// astro.config.mjs
import designMdIntegration from 'astro-landing-kit/design/integration';

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
```

## Color bullet format

Section 2 (`## 2. Colors`) bullets look like `* **Name** (VALUE) — role`. `VALUE` accepts
a 6-digit hex code (`#RRGGBB`) or a single-level `oklch(...)`/`rgb(...)`/`rgba(...)`/
`hsl(...)`/`hsla(...)` function call — value-format tolerance only, the bullet/section
structure itself is unchanged. Role words route to targets (via the shared
`classifyColorRoles()` in `color-roles.ts`, used by both `theme-generator.ts` and
`dark-mode.ts` so the two never diverge): the first color is `primary` (also
`secondary`/`accent` unless a `Secondary`/`Accent` color is named); `surface`/`background`/
`cream`/`parchment`/`light`/`white`/`warm`/`paper`/`canvas`/`base`/`page`/`panel` →
`bg-page`; `text`/`foreground`/`body`/`dark`/`deep`/`forest` → `text-default`; `muted` →
`text-muted`; `heading`/`display`/`title` → `text-heading`. A role that ALSO mentions
`border`/`highlight`/`divider`/`shadow` is treated as decoration and routed to neither
bucket (still eligible for the `accent` pick) — otherwise e.g. "dark accent for borders"
would hijack the body-text slot merely for containing "dark".

**Surface/text pairing (load-bearing, both directions):** `--aw-color-bg-page` is only
overridden when a text-role color is ALSO present in the same `DESIGN.md` — a `Surface`
bullet with no `text`/`foreground`/`body` bullet does **not** flip the background,
because the default `--aw-color-text-default` would stay near-black against it (~1.07:1
contrast, invisible body text). The REVERSE is mirrored too: a lone text-role color (no
`Surface` — e.g. its intended surface bullet used a role word the classifier doesn't
recognize) is only applied when it's verified (or at least not verified UNSAFE) against
the kit's own default `bg-page`; a light lone text color, or one in a format this checker
can't parse (oklch/hsl), is skipped rather than silently rendering invisible on the
default light background. Either skip is logged via the contrast check below, never
silent.

**Dark background:** `--aw-color-bg-page-dark` (dark-mode chrome — footers, headers,
mobile menus) is set from an explicit dark-role color (a bullet whose name/role contains
the word "dark") **only if that color is itself dark enough** (the same ≤0.2 relative
luminance gate the derived pick uses — a "dark accent for borders" bullet can't hijack
the whole site's dark chrome with a color that isn't actually dark, or isn't a background
at all). Failing an explicit pick, it's derived from the darkest classifiable (hex/rgb)
color in the palette. An oklch/hsl "dark"-named color is not trusted on the label alone
(unverifiable) — it falls through to the derived pick, which also requires a
parseable/dark-enough value. Otherwise the kit default (`rgb(3 6 32)`) is kept.

## Contrast check (build-time, non-blocking)

`checkThemeContrast()` runs against whichever override `generateThemeCss` is about to
apply:
- **Surface + text both present** → checks the two DESIGN.md values against each other.
  Logs a WCAG AA warning (ratio below 4.5:1) but still APPLIES both — an intentionally
  low-contrast pairing where the author explicitly chose both ends is their call.
- **Text only, no Surface** → checks the lone text value against the kit's own default
  `bg-page` (an estimate — there's no oklch→sRGB converter here, see Dependencies below).
  Unlike the paired case, an unsafe or unverifiable result here means `generateThemeCss`
  **skips** the override (see "Surface/text pairing" above) — this half-pairing was never
  something the author explicitly authored on both ends, so the fail-safe default wins.

This only verifies hex/rgb values — an oklch/hsl pair or lone value logs "could not
verify contrast", never a false pass. Never silent, but only the paired case is a
"warning, not a failure" in the sense of still shipping as authored.

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

Stable. No dependencies beyond Node `fs` — safe to adopt on any Astro site.
