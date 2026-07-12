# Agent guide

## Source of truth

- `DESIGN.md` defines the reference visual contract. Consumer repositories own their brand-specific `DESIGN.md`.
- `src/assets/styles/README.md` lists the CSS variables that components actually consume.
- `src/types.d.ts` is the public component prop contract.
- `package.json#exports` is the public import surface. Do not import unexported internals.

## Choose the right layer

- Use `ui/*` primitives for production brand pages: `WidgetWrapper`, `Headline`, `Button`, and the item primitives.
- Use `widgets/*` only as scaffold markup for prototypes or internal/product-register pages. Do not try to create a distinct brand by changing only widget colors and fonts.
- Use `islands/*` only when interaction requires client JavaScript. Prefer Astro components otherwise.
- Keep content in the consumer repository; adapters are optional boundaries, not a requirement.

## Customization order

1. Capture the consumer's visual decisions in its `DESIGN.md`.
2. Override semantic `--aw-*` tokens in one consumer stylesheet or enable `designMdIntegration()`.
3. Compose sections from `ui/*` primitives.
4. Add component-scoped CSS only for product-specific structure.
5. Fork a kit component only when its semantic structure is wrong for the product.

Do not patch generated CSS, target undocumented Tailwind internals, duplicate accessibility utilities, or add a second token source for values already represented by `--aw-*` variables.

## Verification

Run `npm test`, `npm run check`, and `npm run build`. For consumer-facing changes, build at least one real npm-style consumer and inspect 320px, 375px, 768px, and 1440px layouts plus keyboard focus and reduced-motion behavior.
