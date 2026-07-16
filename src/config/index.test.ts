import { describe, it, expect } from 'vitest';
import { defineConfig } from './index';

describe('defineConfig', () => {
  it('returns full defaults with empty input', () => {
    const cfg = defineConfig();
    expect(cfg.site.name).toBe('Website');
    expect(cfg.site.trailingSlash).toBe(false);
    expect(cfg.i18n.language).toBe('en');
    expect(cfg.i18n.textDirection).toBe('ltr');
    expect(cfg.blog.isEnabled).toBe(false);
    expect(cfg.blog.postsPerPage).toBe(6);
    expect(cfg.ui.theme).toBe('system');
    expect(cfg.analytics.vendors.googleAnalytics.partytown).toBe(true);
  });

  it('merges site overrides', () => {
    const cfg = defineConfig({
      site: { name: 'My Site', site: 'https://example.com', trailingSlash: true },
    });
    expect(cfg.site.name).toBe('My Site');
    expect(cfg.site.site).toBe('https://example.com');
    expect(cfg.site.trailingSlash).toBe(true);
    expect(cfg.site.base).toBe('/'); // default preserved
  });

  it('merges blog overrides deeply', () => {
    const cfg = defineConfig({
      blog: { isEnabled: true, post: { permalink: 'writing/%slug%' } },
    });
    expect(cfg.blog.isEnabled).toBe(true);
    expect(cfg.blog.post.permalink).toBe('writing/%slug%');
    expect(cfg.blog.post.isEnabled).toBe(true); // default preserved
    expect(cfg.blog.post.robots.index).toBe(true); // default preserved
  });

  it('merges nested blog.robots', () => {
    const cfg = defineConfig({
      blog: { post: { robots: { index: false } } },
    });
    expect(cfg.blog.post.robots.index).toBe(false);
    expect(cfg.blog.post.robots.follow).toBe(true); // default preserved
  });

  it('merges metadata with title template', () => {
    const cfg = defineConfig({
      metadata: {
        title: { default: 'Custom', template: '%s | Custom' },
        description: 'My site',
      },
    });
    expect(cfg.metadata.title?.default).toBe('Custom');
    expect(cfg.metadata.title?.template).toBe('%s | Custom');
    expect(cfg.metadata.description).toBe('My site');
    expect(cfg.metadata.robots?.index).toBe(false); // default preserved
  });

  it('merges ui theme', () => {
    const cfg = defineConfig({ ui: { theme: 'dark:only' } });
    expect(cfg.ui.theme).toBe('dark:only');
  });

  it('merges analytics', () => {
    const cfg = defineConfig({
      analytics: { vendors: { googleAnalytics: { id: 'G-XXXX' } } },
    });
    expect(cfg.analytics.vendors.googleAnalytics.id).toBe('G-XXXX');
    expect(cfg.analytics.vendors.googleAnalytics.partytown).toBe(true); // default
  });

  it('metadata title default falls back to site name', () => {
    const cfg = defineConfig({ site: { name: 'Fallback Test' } });
    expect(cfg.metadata.title?.default).toBe('Fallback Test');
  });

  it('blog tag default has index: false', () => {
    const cfg = defineConfig({ blog: { isEnabled: true } });
    expect(cfg.blog.tag.robots.index).toBe(false);
    expect(cfg.blog.category.robots.index).toBe(true);
  });

  it('does not mutate input', () => {
    const input = { site: { name: 'Test' } };
    const cfg = defineConfig(input);
    expect(cfg.site.name).toBe('Test');
    expect(input.site?.name).toBe('Test');
    // input should not have gained defaults
    expect(input.site?.base).toBeUndefined();
  });
});
