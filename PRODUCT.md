# PRODUCT.md — astro-landing-kit

## Product Purpose

Reusable Astro + Svelte 5 landing page kit for developers building marketing sites, landing pages, and product-register pages. Fork of AstroWind (MIT, onWidget), hardened with adapters, forms, SEO, PWA, and a design-token pipeline. Published on npm as `astro-landing-kit`.

## Users

- **Primary**: developers building consumer landing pages who need a structural starting point (widgets, layouts, forms) without a generic template look.
- **Secondary**: agencies and solo devs who want compose-from-primitives architecture, not a monolithic template.

## Register

brand

## Anti-references

- AstroWind's generic "icon-grid features, numbered steps, basic FAQ/stats/pricing cards" shape — instantly recognizable regardless of palette.
- Re-themed stock widgets (changing colors/fonts on AstroWind markup ≠ de-templating).
- `@vite-pwa/astro` and similar heavy PWA plugins — the kit ships its own SW integration.

## Strategic principles

- **Widgets = scaffold, not shippable.** `widgets/*` are fast-prototype shapes. Brand pages compose from `ui/*` primitives.
- **Design tokens over hard-coded colors.** All colors flow through `--aw-color-*` semantic tokens.
- **Consumer owns the brand.** The kit provides structure; the consumer provides identity via DESIGN.md + theme overrides.
