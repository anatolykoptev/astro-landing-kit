import { describe, it, expect } from 'vitest';
import { generateServiceWorkerSource } from './sw-template';

describe('generateServiceWorkerSource', () => {
  const source = generateServiceWorkerSource('lk-abc1234');

  it('stamps the given cache name as a JSON-encoded const', () => {
    expect(source).toContain('const CACHE = "lk-abc1234";');
  });

  it('calls skipWaiting on install for instant activation (no in-page state to protect)', () => {
    const installBlock = source.slice(source.indexOf("addEventListener('install'"), source.indexOf("addEventListener('activate'"));
    expect(installBlock).toContain('self.skipWaiting()');
  });

  it('activate deletes every non-current cache, claims clients, and navigates every window client', () => {
    const activateBlock = source.slice(source.indexOf("addEventListener('activate'"), source.indexOf("addEventListener('fetch'"));
    expect(activateBlock).toContain('caches.delete(key)');
    expect(activateBlock).toContain('key !== CACHE');
    expect(activateBlock).toContain('self.clients.claim()');
    expect(activateBlock).toContain('client.navigate(client.url)');
  });

  it('fetch handler is network-first for navigations', () => {
    expect(source).toContain("request.mode === 'navigate'");
  });

  it('fetch handler is cache-first for hashed /_astro/ assets', () => {
    expect(source).toContain("url.pathname.startsWith('/_astro/')");
  });

  it('fetch handler never intercepts cross-origin requests', () => {
    expect(source).toContain('url.origin !== self.location.origin) return');
  });

  it('never ships any brand-specific string — must stay adoptable by any consumer site', () => {
    const lower = source.toLowerCase();
    for (const forbidden of ['oxpulse', 'krolik', 'starthey', 'тайга']) {
      expect(lower).not.toContain(forbidden);
    }
  });

  it('produces a different cache name for a different build id (cache-busting is per-build)', () => {
    const other = generateServiceWorkerSource('lk-def5678');
    expect(other).not.toBe(source);
    expect(other).toContain('const CACHE = "lk-def5678";');
  });
});
