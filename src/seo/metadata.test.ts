import { describe, it, expect } from 'vitest';

import { toSeoProps, type ResolvedMetadata } from './metadata';

const base: ResolvedMetadata = {
  title: 'Post title',
  titleTemplate: '%s',
  canonical: 'https://example.com/post',
  noindex: false,
  nofollow: false,
  description: 'About the post',
  openGraph: { url: 'https://example.com/post', siteName: 'Example', locale: 'en', type: 'article' },
};

const image = { url: 'https://example.com/og.png', width: 1200, height: 630, alt: 'Card for the post' };

describe('toSeoProps — image', () => {
  it('maps alt onto og:image:alt and twitter:image:alt', () => {
    const props = toSeoProps(base, image);
    expect(props.openGraph?.image?.alt).toBe('Card for the post');
    expect(props.twitter?.imageAlt).toBe('Card for the post');
    expect(props.twitter?.image).toBe('https://example.com/og.png');
  });

  it('explicit twitter image and alt win over the Open Graph image', () => {
    const props = toSeoProps({ ...base, twitter: { image: 'https://example.com/tw.png', imageAlt: 'Other' } }, image);
    expect(props.twitter?.image).toBe('https://example.com/tw.png');
    expect(props.twitter?.imageAlt).toBe('Other');
  });

  it('does not reuse the og alt for a different twitter image', () => {
    const props = toSeoProps({ ...base, twitter: { image: 'https://example.com/tw.png' } }, image);
    expect(props.twitter?.image).toBe('https://example.com/tw.png');
    expect(props.twitter?.imageAlt).toBeUndefined();
  });

  it('omits openGraph entirely without an image (astro-seo would throw)', () => {
    expect(toSeoProps(base).openGraph).toBeUndefined();
  });

  it('falls back to the supplied title for og:title on untitled pages', () => {
    expect(toSeoProps({ ...base, title: '' }, image, 'Site').openGraph?.basic.title).toBe('Site');
  });
});

describe('toSeoProps — twitter card', () => {
  it('defaults to a large card when there is an image, a summary card when not', () => {
    expect(toSeoProps(base, image).twitter?.card).toBe('summary_large_image');
    expect(toSeoProps(base).twitter?.card).toBe('summary');
  });

  it('an explicit cardType wins', () => {
    expect(toSeoProps({ ...base, twitter: { cardType: 'summary' } }, image).twitter?.card).toBe('summary');
  });

  it('maps handle/site onto creator/site', () => {
    const props = toSeoProps({ ...base, twitter: { handle: '@me', site: '@co' } }, image);
    expect(props.twitter?.creator).toBe('@me');
    expect(props.twitter?.site).toBe('@co');
  });
});

describe('toSeoProps — article and links', () => {
  it('passes article tags through', () => {
    const article = { publishedTime: '2026-10-06T00:00:00.000Z', modifiedTime: '2026-10-07T00:00:00.000Z', tags: ['a', 'b'] };
    const props = toSeoProps({ ...base, openGraph: { ...base.openGraph, article } }, image);
    expect(props.openGraph?.article).toEqual(article);
  });

  it('emits no article block when none is given', () => {
    expect(toSeoProps(base, image).openGraph).not.toHaveProperty('article');
  });

  it('maps links onto extend.link and drops empty attributes', () => {
    const props = toSeoProps(
      { ...base, links: [{ rel: 'alternate', href: '/rss.xml', type: 'application/rss+xml', title: 'Feed' }, { rel: 'alternate', href: '/fr', hreflang: 'fr' }] },
      image
    );
    expect(props.extend?.link).toEqual([
      { rel: 'alternate', href: '/rss.xml', type: 'application/rss+xml', title: 'Feed' },
      { rel: 'alternate', href: '/fr', hreflang: 'fr' },
    ]);
  });

  it('has no extend block when there are no links', () => {
    expect(toSeoProps(base, image).extend).toBeUndefined();
  });
});
