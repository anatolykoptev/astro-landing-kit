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

## WCAG landmark rule — do NOT add a second `<main>`

**`PageLayout` already wraps slot content in `<main>`.** Consumers must NOT add their own
`<main>` element inside `PageLayout` — doing so creates a duplicate ARIA landmark that
violates WCAG SC 1.3.1 and confuses screen readers.

Correct usage:

```astro
---
import PageLayout from 'astro-landing-kit/layouts/PageLayout';
const meta = { title: 'Home', description: 'Welcome' };
---
<PageLayout metadata={meta}>
  <!-- slot content here — no <main> wrapper needed -->
  <section>content</section>
</PageLayout>
```

If you need the bare HTML shell without a pre-baked `<main>`, use `Layout` directly and
add your own `<main>` there. `Layout` does not inject a landmark element.

## Dependencies

- `widgets` — Header, Footer, Announcement
- `common` (internal) — CommonMeta, Metadata, Favicons, Analytics, BasicScripts

## Status

stable
