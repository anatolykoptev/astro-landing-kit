# styles

Tailwind v4 base stylesheet.

## What

Single CSS entry point: `src/assets/styles/tailwind.css`. Imports Tailwind v4 base, adds typography plugin config, and sets CSS custom property defaults. Consumed by `Layout.astro`.

## When to use

- Imported once in `Layout.astro` — already wired in, no action needed for most consumers
- Override CSS variables from this file to customize the color palette

## API

No JS API. CSS import only:

```ts
import '@krolik/landing-kit/styles';
```

Or directly in Astro:

```astro
import '~/assets/styles/tailwind.css';
```

## Dependencies

- `tailwindcss` v4
- `@tailwindcss/typography`

## Status

stable
