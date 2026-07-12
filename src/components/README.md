# components

Top-level shared Astro components.

## What

- **Favicons.astro** — Renders favicon link tags in `<head>`. Used by `Layout.astro`.
- **CustomStyles.astro** — Injects `@fontsource-variable/inter` and sets default `--aw-color-*` CSS variables (in the `landing-kit-defaults` cascade layer). These defaults are kit-neutral (teal) and should be overridden by consumers via their own `:root` block, by importing `astro-landing-kit/styles/theme.css`, or via a `DESIGN.md` (see `src/design/README.md`).
- **DesignTheme.astro** — Injects the `DESIGN.md`-generated `--aw-color-*` overrides (in the highest-priority `landing-kit-design-theme` layer) as an inline `<style>`. No-op unless the design integration (`src/design/integration.ts`) is mounted. Rendered by `Layout.astro` after `CustomStyles`.
- **FontPreload.astro** — Optional font preload/preconnect hints. Add to `<head>` when you want early font loading.
- **Logo.astro** — Site logo component.

## Favicons

Accepts a `maskIconColor` prop (string or null) to control the Safari pinned-tab color.
Default: `#0d9488` (kit teal). Pass your brand hex to override. Pass `null` to omit the tag.

```astro
---
import Favicons from 'astro-landing-kit/components/Favicons';
---
<Favicons maskIconColor="#6366f1" />
```

## FontPreload

Two usage modes:

**Self-hosted fonts** (via `@fontsource/*`): pass WOFF2 file paths.

```astro
---
import FontPreload from 'astro-landing-kit/components/FontPreload';
---
<FontPreload paths={['/_astro/inter-variable-abc123.woff2']} />
```

Note: Astro hashes filenames at build time, so you'll need to get the actual
output path from your build. Omit this component if you rely on CSS
`@font-face` auto-discovery (acceptable for most sites).

**Google Fonts**: pass family strings to emit preconnect + stylesheet link.

```astro
<FontPreload families={['Inter:wght@400;500;700']} />
```

## Status

stable
