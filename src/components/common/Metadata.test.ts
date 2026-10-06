import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

import Metadata from './Metadata.astro';

// Renders the real component, so a field that Metadata.astro or astro-seo drops fails here;
// the toSeoProps tests alone cannot see that. The container has no `site`, so URLs resolve against
// the kit config's SITE.site (https://kit.krolik.run).
const render = async (props: Record<string, unknown>) => {
  const container = await AstroContainer.create();
  return container.renderToString(Metadata, { props, request: new Request('https://example.com/post') });
};

const metas = (html: string, attr: 'property' | 'name', key: string) =>
  [...html.matchAll(new RegExp(`<meta[^>]*${attr}="${key}"[^>]*content="([^"]*)"`, 'g'))].map((m) => m[1]);

const image = { url: '/og.png', width: 1200, height: 630, alt: 'A card' };

describe('Metadata.astro (rendered)', () => {
  it('renders og:image:alt and twitter:image(:alt) from the image alt', async () => {
    const html = await render({ title: 'T', openGraph: { images: [image] } });
    expect(metas(html, 'property', 'og:image:alt')).toEqual(['A card']);
    expect(metas(html, 'name', 'twitter:image')).toEqual(['https://kit.krolik.run/og.png']);
    expect(metas(html, 'name', 'twitter:image:alt')).toEqual(['A card']);
  });

  it('resolves an explicit twitter.image against the site and does not reuse the og alt for it', async () => {
    const html = await render({ title: 'T', openGraph: { images: [image] }, twitter: { image: '/tw.png' } });
    expect(metas(html, 'name', 'twitter:image')).toEqual(['https://kit.krolik.run/tw.png']);
    expect(metas(html, 'name', 'twitter:image:alt')).toEqual([]);
  });

  it('keeps an absolute remote twitter.image as given (no optimizer, no rewrite)', async () => {
    const html = await render({ title: 'T', openGraph: { images: [image] }, twitter: { image: 'https://cdn.example.net/x.png?w=800' } });
    expect(metas(html, 'name', 'twitter:image')).toEqual(['https://cdn.example.net/x.png?w=800']);
  });

  it('drops twitter.imageAlt when its explicit image does not resolve', async () => {
    const html = await render({
      title: 'T',
      openGraph: { images: [image] },
      twitter: { image: '~/assets/images/does-not-exist.png', imageAlt: 'For the missing image' },
    });
    expect(metas(html, 'name', 'twitter:image')).toEqual(['https://kit.krolik.run/og.png']);
    expect(metas(html, 'name', 'twitter:image:alt')).toEqual(['A card']);
  });

  it('renders article:* tags', async () => {
    const html = await render({
      title: 'T',
      openGraph: {
        type: 'article',
        images: [image],
        article: { publishedTime: '2026-10-06T00:00:00.000Z', authors: ['https://example.com/me'], section: 'S', tags: ['a', 'b'] },
      },
    });
    expect(metas(html, 'property', 'article:published_time')).toEqual(['2026-10-06T00:00:00.000Z']);
    expect(metas(html, 'property', 'article:author')).toEqual(['https://example.com/me']);
    expect(metas(html, 'property', 'article:section')).toEqual(['S']);
    expect(metas(html, 'property', 'article:tag')).toEqual(['a', 'b']);
  });

  it('renders page links as absolute URLs', async () => {
    const html = await render({
      title: 'T',
      openGraph: { images: [image] },
      links: [{ rel: 'alternate', type: 'application/rss+xml', title: 'Blog', href: '/rss.xml' }],
    });
    expect(html).toContain('href="https://kit.krolik.run/rss.xml"');
    expect(html).toContain('type="application/rss+xml"');
  });

  it('keeps the alt of an optimized ~/assets image', async () => {
    const html = await render({ title: 'T', openGraph: { images: [{ url: '~/assets/images/default.png', alt: 'Local asset' }] } });
    expect(metas(html, 'property', 'og:image:alt')).toEqual(['Local asset']);
    expect(metas(html, 'name', 'twitter:image:alt')).toEqual(['Local asset']);
  });
});
