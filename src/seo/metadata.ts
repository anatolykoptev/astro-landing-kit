import type { Props as AstroSeoProps, TwitterCardType } from 'astro-seo';

import type { MetaDataLink, MetaDataOpenGraph, MetaDataTwitter } from '~/types';
import type { OpenGraphImage } from '~/utils/images';

/** Page metadata after the default < METADATA < page merge, before it is shaped for astro-seo. */
export interface ResolvedMetadata {
  title: string;
  titleTemplate: string;
  canonical: string;
  noindex: boolean;
  nofollow: boolean;
  description?: string;
  openGraph: MetaDataOpenGraph;
  twitter?: MetaDataTwitter;
  links?: MetaDataLink[];
}

/**
 * Shape resolved metadata into astro-seo props. astro-seo silently skips anything it is not given,
 * so every field the kit accepts has to be mapped here: a field that is not mapped disappears
 * from the page without an error.
 *
 * `primaryImage` is the first Open Graph image after URL resolution (absolute URL).
 * `fallbackTitle` stands in for `og:title` on pages that have no title of their own.
 */
export function toSeoProps(resolved: ResolvedMetadata, primaryImage?: OpenGraphImage, fallbackTitle = ''): AstroSeoProps {
  const og = resolved.openGraph;
  const tw = resolved.twitter ?? {};

  // astro-seo throws if `openGraph` is passed without `basic.title`/`basic.type`/`basic.image` —
  // only emit it once there is an image to point `basic.image` at.
  const openGraph: AstroSeoProps['openGraph'] = primaryImage?.url
    ? {
        basic: {
          title: resolved.title || fallbackTitle,
          type: og.type || 'website',
          image: primaryImage.url,
          url: og.url,
        },
        image: {
          width: primaryImage.width,
          height: primaryImage.height,
          alt: primaryImage.alt,
        },
        optional: {
          description: resolved.description,
          siteName: og.siteName,
          locale: og.locale,
        },
        ...(og.article ? { article: og.article } : {}),
      }
    : undefined;

  return {
    title: resolved.title,
    titleTemplate: resolved.titleTemplate,
    canonical: resolved.canonical,
    noindex: resolved.noindex,
    nofollow: resolved.nofollow,
    description: resolved.description,
    openGraph,
    twitter: {
      card: (tw.cardType ?? (primaryImage?.url ? 'summary_large_image' : 'summary')) as TwitterCardType,
      // next-seo-shaped `handle`/`site` map onto astro-seo's `creator`/`site`.
      site: tw.site,
      creator: tw.handle,
      title: tw.title,
      description: tw.description,
      image: tw.image ?? primaryImage?.url,
      imageAlt: tw.imageAlt ?? primaryImage?.alt,
    },
    extend: resolved.links?.length
      ? {
          link: resolved.links.map(({ rel, href, type, title, hreflang }) => ({
            rel,
            href,
            ...(type ? { type } : {}),
            ...(title ? { title } : {}),
            ...(hreflang ? { hreflang } : {}),
          })),
        }
      : undefined,
  };
}
