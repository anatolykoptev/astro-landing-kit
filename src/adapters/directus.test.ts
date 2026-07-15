import { describe, it, expect, vi } from 'vitest';
import { DirectusContentProvider } from './directus';

// Mock fetch
function mockFetch(data: unknown, status = 200): typeof fetch {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  }) as unknown as typeof fetch;
}

describe('DirectusContentProvider', () => {
  it('throws on missing url', () => {
    expect(() => new DirectusContentProvider({ url: '' })).toThrow('url is required');
  });

  it('loadPage returns a LandingPage with sections sorted by sort field', async () => {
    const mockData = {
      data: [
        {
          slug: 'home',
          meta: { title: 'Home', description: 'Home page' },
          sections: [
            { section_id: { type: 'hero', props: { title: 'Hi' } }, sort: 2 },
            { section_id: { type: 'features', props: { items: [] } }, sort: 1 },
          ],
        },
      ],
    };
    const provider = new DirectusContentProvider({
      url: 'https://directus.example.com',
      token: 'test-token',
      fetchFn: mockFetch(mockData),
    });

    const page = await provider.loadPage('home');
    expect(page.slug).toBe('home');
    expect(page.meta.title).toBe('Home');
    expect(page.sections).toHaveLength(2);
    // sort=1 should come first
    expect(page.sections[0].type).toBe('features');
    expect(page.sections[1].type).toBe('hero');
  });

  it('throws when page not found (empty data)', async () => {
    const provider = new DirectusContentProvider({
      url: 'https://directus.example.com',
      fetchFn: mockFetch({ data: [] }),
    });
    await expect(provider.loadPage('missing')).rejects.toThrow('not found');
  });

  it('throws on non-ok response', async () => {
    const provider = new DirectusContentProvider({
      url: 'https://directus.example.com',
      fetchFn: mockFetch({}, 500),
    });
    await expect(provider.loadPage('home')).rejects.toThrow('status 500');
  });

  it('uses tokenProvider for auth header', async () => {
    let capturedHeaders: Record<string, string> = {};
    const fetchFn = vi.fn().mockImplementation(async (_url: string, opts: any) => {
      capturedHeaders = opts.headers;
      return { ok: true, status: 200, json: () => Promise.resolve({ data: [{ slug: 'x', meta: {}, sections: [] }] }) };
    });
    const provider = new DirectusContentProvider({
      url: 'https://directus.example.com',
      tokenProvider: () => Promise.resolve('dynamic-token'),
      fetchFn: fetchFn as unknown as typeof fetch,
    });
    await provider.loadPage('x');
    expect(capturedHeaders.Authorization).toBe('Bearer dynamic-token');
  });

  it('handles page with no sections', async () => {
    const provider = new DirectusContentProvider({
      url: 'https://directus.example.com',
      fetchFn: mockFetch({ data: [{ slug: 'empty', meta: { title: 'Empty' } }] }),
    });
    const page = await provider.loadPage('empty');
    expect(page.sections).toEqual([]);
  });
});
