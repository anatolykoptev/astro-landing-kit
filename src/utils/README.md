# images (utils/images + utils/images-optimization)

Image optimization helpers for Astro and unpic CDN images.

## What

Two utility modules:
- `utils/images.ts` — `findImage()` resolves local asset paths via Vite glob; `adaptOpenGraphImages()` resizes OG images.
- `utils/images-optimization.ts` — `getImagesOptimized()`, `astroAssetsOptimizer`, `unpicOptimizer`: srcset generation for both local assets and CDN images.

## When to use

- Resolving `~/assets/images/` paths inside Astro components
- Generating responsive `srcset` for `<Image>` components
- Resizing OG images for meta tags

## API

```ts
// utils/images.ts
export async function findImage(imagePath?: string | ImageMetadata | null): Promise<string | ImageMetadata | undefined | null>
export async function adaptOpenGraphImages(openGraph: OpenGraph, astroSite?: URL): Promise<OpenGraph>
export async function fetchLocalImages(): Promise<Record<string, () => Promise<unknown>>>

// utils/images-optimization.ts
export async function getImagesOptimized(image, props: ImageProps, transform?): Promise<{ src, attributes }>
export const astroAssetsOptimizer: ImagesOptimizer
export const unpicOptimizer: ImagesOptimizer
export const isUnpicCompatible: (image: string) => boolean
export const getSizes: (width?, layout?) => string | undefined
export interface ImageProps { src?, width?, height?, layout?, widths?, aspectRatio?, format?, ... }
export type ImagesOptimizer = (image, breakpoints, width?, height?, format?) => Promise<Array<{ src, width }>>
```

## Example

```ts
import { findImage } from '~/utils/images';
const src = await findImage('~/assets/images/hero.png');
```

## Dependencies

- `astro:assets` — `getImage`
- `unpic` — CDN URL detection and transformation
- `@astrolib/seo` — `OpenGraph` type

## Status

stable
