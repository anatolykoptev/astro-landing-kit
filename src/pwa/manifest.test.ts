import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const manifestPath = resolve(__dirname, '../../public/manifest.webmanifest');

const loadManifest = () => JSON.parse(readFileSync(manifestPath, 'utf8'));

describe('PWA web app manifest', () => {
  const manifest = loadManifest();

  it('has name or short_name (Lighthouse required)', () => {
    expect(manifest.name || manifest.short_name).toBeTruthy();
  });

  it('has short_name (≤12 chars for home screen)', () => {
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.short_name.length).toBeLessThanOrEqual(12);
  });

  it('has start_url', () => {
    expect(manifest.start_url).toBeTruthy();
    expect(manifest.start_url).toMatch(/^\//);
  });

  it('has display set to standalone, fullscreen, or minimal-ui', () => {
    expect(['standalone', 'fullscreen', 'minimal-ui', 'window-controls-overlay']).toContain(manifest.display);
  });

  it('has icons with 192x192 and 512x512 (Lighthouse required)', () => {
    const sizes = manifest.icons.map((i: { sizes: string }) => i.sizes);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
  });

  it('has PNG icons with correct type', () => {
    for (const icon of manifest.icons) {
      expect(icon.type).toBe('image/png');
      expect(icon.src).toMatch(/^\/icons\//);
    }
  });

  it('has maskable icon for Android adaptive icons', () => {
    const maskable = manifest.icons.filter((i: { purpose: string }) =>
      i.purpose?.split(' ').includes('maskable')
    );
    expect(maskable.length).toBeGreaterThanOrEqual(1);
    // Maskable icons should be at least 192x192
    for (const icon of maskable) {
      const size = parseInt(icon.sizes);
      expect(size).toBeGreaterThanOrEqual(192);
    }
  });

  it('has separate any and maskable icons (not any maskable on same file)', () => {
    // web.dev best practice: separate maskable icon, not "any maskable" on one
    const anyMaskable = manifest.icons.filter((i: { purpose: string }) =>
      i.purpose === 'any maskable'
    );
    expect(anyMaskable).toHaveLength(0);
  });

  it('has theme_color', () => {
    expect(manifest.theme_color).toBeTruthy();
    expect(manifest.theme_color).toMatch(/^#/);
  });

  it('has background_color for splash screen', () => {
    expect(manifest.background_color).toBeTruthy();
    expect(manifest.background_color).toMatch(/^#/);
  });

  it('prefer_related_applications is not true', () => {
    if (manifest.prefer_related_applications !== undefined) {
      expect(manifest.prefer_related_applications).not.toBe(true);
    }
  });

  it('has scope', () => {
    expect(manifest.scope).toBeTruthy();
    expect(manifest.scope).toMatch(/^\//);
  });
});
