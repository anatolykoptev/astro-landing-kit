import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock images-optimization so we never call astro:assets in tests
vi.mock('./images-optimization', () => ({
  isUnpicCompatible: vi.fn(() => false),
  unpicOptimizer: vi.fn(async () => [{ src: 'https://unpic/result.jpg', width: 800 }]),
  astroAssetsOptimizer: vi.fn(async () => [{ src: '/_astro/result.jpg', width: 1200, height: 630 }]),
}));

import { adaptOpenGraphImages } from './images';

const SITE = new URL('https://memdb.ai');

describe('adaptOpenGraphImages — public-prefix passthrough', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('passes through /og.png as absolute URL with consumer dimensions', async () => {
    const result = await adaptOpenGraphImages(
      { images: [{ url: '/og.png', width: 1200, height: 630 }] },
      SITE,
    );
    expect(result.images).toEqual([{ url: 'https://memdb.ai/og.png', width: 1200, height: 630 }]);
    const { astroAssetsOptimizer } = await import('./images-optimization');
    expect(astroAssetsOptimizer).not.toHaveBeenCalled();
  });

  it('passes through /og.png with missing dimensions (no defaults injected)', async () => {
    const result = await adaptOpenGraphImages(
      { images: [{ url: '/og.png' }] },
      SITE,
    );
    expect(result.images).toEqual([{ url: 'https://memdb.ai/og.png', width: undefined, height: undefined }]);
  });

  it('does NOT passthrough protocol-relative // URLs', async () => {
    const result = await adaptOpenGraphImages(
      { images: [{ url: '//example.com/img.jpg', width: 800, height: 400 }] },
      SITE,
    );
    expect(result.images?.[0]?.url).not.toBe('https://memdb.ai//example.com/img.jpg');
  });

  it('does NOT passthrough https:// remote URLs (goes through existing branch)', async () => {
    await adaptOpenGraphImages(
      { images: [{ url: 'https://example.com/x.jpg', width: 800, height: 400 }] },
      SITE,
    );
    const { astroAssetsOptimizer, unpicOptimizer } = await import('./images-optimization');
    const called = (astroAssetsOptimizer as ReturnType<typeof vi.fn>).mock.calls.length +
                   (unpicOptimizer as ReturnType<typeof vi.fn>).mock.calls.length;
    expect(called).toBeGreaterThan(0);
  });

  it('returns empty images unchanged', async () => {
    const result = await adaptOpenGraphImages({ images: [] }, SITE);
    expect(result.images).toEqual([]);
  });

  it('returns unchanged openGraph when no images key', async () => {
    const result = await adaptOpenGraphImages({ title: 'foo' }, SITE);
    expect(result).toEqual({ title: 'foo' });
  });
});
