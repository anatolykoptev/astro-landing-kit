import { describe, it, expect, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

// METADATA that carries page-level fields, as a careless site config could.
vi.mock('~/config/kit', async (importOriginal) => {
  const original = await importOriginal<typeof import('~/config/kit')>();
  return {
    ...original,
    METADATA: {
      ...original.METADATA,
      openGraph: { ...original.METADATA?.openGraph, article: { authors: ['A', 'C'], section: 'Site' } },
      twitter: { ...original.METADATA?.twitter, title: 'Site title', image: '/site.png', imageAlt: 'Site alt' },
    },
  };
});

import Metadata from './Metadata.astro';

const render = async (props: Record<string, unknown>) => {
  const container = await AstroContainer.create();
  return container.renderToString(Metadata, { props, request: new Request('https://example.com/post') });
};

describe('Metadata.astro: page-level fields are not inherited from METADATA', () => {
  const image = { url: '/og.png', width: 1200, height: 630, alt: 'A card' };

  it('article tags: none on a page without them, the page value alone on a page with them', async () => {
    expect(await render({ title: 'T', openGraph: { images: [image] } })).not.toContain('article:');
    const html = await render({ title: 'T', openGraph: { images: [image], article: { authors: ['B'] } } });
    expect(html).toContain('property="article:author" content="B"');
    expect(html).not.toContain('content="A"');
    expect(html).not.toContain('content="C"');
  });

  it('twitter title/image/alt from METADATA are not stamped on the page', async () => {
    const html = await render({ title: 'T', openGraph: { images: [image] } });
    expect(html).not.toContain('twitter:title');
    expect(html).toContain('name="twitter:image" content="https://example.com/og.png"');
    expect(html).toContain('name="twitter:image:alt" content="A card"');
  });
});
