import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JsonWebhook, FormspreeWebhook } from './webhook';

function mockFetchOk(body: unknown, contentType = 'application/json', status = 200): typeof fetch {
  const isJson = contentType.includes('application/json');
  const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
  return vi.fn(async () =>
    new Response(isJson ? bodyStr : (body as string), {
      status,
      headers: { 'content-type': contentType },
    })
  ) as unknown as typeof fetch;
}

function mockFetchFail(): typeof fetch {
  return vi.fn(async () => {
    throw new Error('ECONNREFUSED');
  }) as unknown as typeof fetch;
}

describe('JsonWebhook', () => {
  beforeEach(() => {
    const realFetch = globalThis.fetch;
    vi.stubGlobal('fetch', mockFetchOk({ ok: true }));
    afterEach(() => vi.stubGlobal('fetch', realFetch));
  });

  it('submits payload as JSON and returns ok result', async () => {
    const wh = new JsonWebhook('https://example.com/hook');
    const res = await wh.submit({ name: 'Jane' });
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('returns ok=false on non-2xx status', async () => {
    vi.stubGlobal('fetch', mockFetchOk({ error: 'bad' }, 'application/json', 400));
    const wh = new JsonWebhook('https://example.com/hook');
    const res = await wh.submit({ name: 'Jane' });
    expect(res.ok).toBe(false);
    expect(res.status).toBe(400);
  });

  it('returns ok=false with error string on network failure', async () => {
    vi.stubGlobal('fetch', mockFetchFail());
    const wh = new JsonWebhook('https://example.com/hook');
    const res = await wh.submit({ name: 'Jane' });
    expect(res.ok).toBe(false);
    expect(res.status).toBe(0);
    expect(res.error).toContain('ECONNREFUSED');
  });

  it('reads text body when content-type is not JSON', async () => {
    vi.stubGlobal('fetch', mockFetchOk('plain text', 'text/plain'));
    const wh = new JsonWebhook('https://example.com/hook');
    const res = await wh.submit({ name: 'Jane' });
    expect(res.body).toBe('plain text');
  });

  it('passes custom headers through', async () => {
    const fetchSpy = mockFetchOk({ ok: true });
    vi.stubGlobal('fetch', fetchSpy);
    const wh = new JsonWebhook('https://example.com/hook', { Authorization: 'Bearer xyz' });
    await wh.submit({ name: 'Jane' });
    const call = (fetchSpy as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const headers = call[1].headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer xyz');
    expect(headers['Content-Type']).toBe('application/json');
  });
});

describe('FormspreeWebhook', () => {
  it('constructs full URL from short form id', () => {
    const wh = new FormspreeWebhook('abcdwxyz');
    expect((wh as unknown as { endpoint: string }).endpoint).toBe('https://formspree.io/f/abcdwxyz');
  });

  it('accepts full URL as form id', () => {
    const wh = new FormspreeWebhook('https://formspree.io/f/custom');
    expect((wh as unknown as { endpoint: string }).endpoint).toBe('https://formspree.io/f/custom');
  });

  it('submits form-encoded data and returns ok result', async () => {
    vi.stubGlobal('fetch', mockFetchOk({ ok: true }));
    const wh = new FormspreeWebhook('abcdwxyz');
    const res = await wh.submit({ name: 'Jane', email: 'j@x.com' });
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
  });

  it('returns ok=false with error on network failure', async () => {
    vi.stubGlobal('fetch', mockFetchFail());
    const wh = new FormspreeWebhook('abcdwxyz');
    const res = await wh.submit({ name: 'Jane' });
    expect(res.ok).toBe(false);
    expect(res.status).toBe(0);
    expect(res.error).toContain('ECONNREFUSED');
  });
});
