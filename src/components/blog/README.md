# blog

Blog rendering components: lists, grids, single post, pagination, tags.

## What

Astro components for blog display. Works with Astro content collections (`astro:content`) and the `Post` type from `~/types`. Does not manage routing — that's the consuming app's responsibility.

## When to use

- Rendering `/blog` list pages (Grid or List layout)
- Rendering individual post pages (SinglePost)
- Embedding pagination controls
- Showing tag clouds or related posts

## API

| Component | Props | Description |
|---|---|---|
| `Grid.astro` | `{ posts: Post[] }` | Card grid of posts |
| `List.astro` | `{ posts: Post[] }` | Compact list of posts |
| `GridItem.astro` | `Post` | Single post card |
| `ListItem.astro` | `Post` | Single post list row |
| `SinglePost.astro` | `Post` | Full post layout with content |
| `Pagination.astro` | `{ prevUrl?, nextUrl? }` | Prev / Next nav |
| `Tags.astro` | `{ tags: Post['tags'] }` | Tag badge list |
| `RelatedPosts.astro` | `{ post: Post }` | Shows related posts via utils/blog |
| `Headline.astro` | `Headline` | Section heading (blog-specific variant) |
| `ToBlogLink.astro` | — | Back-to-blog link |

## Example

```astro
---
import Grid from 'astro-landing-kit/blog/Grid';
import Pagination from 'astro-landing-kit/blog/Pagination';
const { posts, page } = Astro.props;
---
<Grid posts={posts} />
<Pagination prevUrl={page.url.prev} nextUrl={page.url.next} />
```

## Dependencies

- `ui` — Button (Pagination, ToBlogLink), Image (GridItem, ListItem, SinglePost)
- `utils/permalinks`, `utils/blog`, `utils/images`, `utils/utils`
- `~/config/kit` — APP_BLOG config flag

## Status

stable
