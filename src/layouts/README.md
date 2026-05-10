# layouts

Page shell components — head, meta, tailwind injection, nav chrome.

## What

Three layered Astro layouts: `Layout` (bare HTML shell), `PageLayout` (Layout + Header + Footer), `LandingLayout` (PageLayout variant with sticky header). `MarkdownLayout` wraps `PageLayout` for `.md` files.

## When to use

- Every page needs `PageLayout` as its outermost component
- Blog posts / MDX docs use `MarkdownLayout`
- Landing pages with minimal nav use `LandingLayout`

## API

```astro
<!-- PageLayout.astro -->
<PageLayout metadata={MetaData} headerData?={...} footerData?={...}>
  <slot />
</PageLayout>

<!-- LandingLayout.astro -->
<LandingLayout metadata={MetaData}>
  <slot />
</LandingLayout>

<!-- MarkdownLayout.astro -->
<MarkdownLayout frontmatter={MetaData}>
  <slot />
</MarkdownLayout>
```

`MetaData` type: `{ title, description, canonical?, noindex?, openGraph?, twitter? }` from `~/types`.

## Example

```astro
---
import PageLayout from '@krolik/landing-kit/layouts/PageLayout';
const meta = { title: 'Home', description: 'Welcome' };
---
<PageLayout metadata={meta}>
  <main>content</main>
</PageLayout>
```

## Dependencies

- `widgets` — Header, Footer, Announcement
- `common` (internal) — CommonMeta, Metadata, Favicons, Analytics, BasicScripts

## Status

stable
