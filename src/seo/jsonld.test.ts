import { describe, it, expect } from 'vitest';
import { buildJsonLd } from './jsonld';

const opts = { siteUrl: 'https://example.com', siteName: 'Example' };

describe('jsonld', () => {
  it('returns empty string for empty configs', () => {
    expect(buildJsonLd([], opts)).toBe('');
  });

  it('builds Organization graph', () => {
    const html = buildJsonLd([
      { type: 'Organization', props: { name: 'Acme', url: 'https://acme.com' } },
    ], opts);
    expect(html).toContain('application/ld+json');
    expect(html).toContain('"@context"');
    expect(html).toContain('"@graph"');
    expect(html).toContain('"Organization"');
    expect(html).toContain('"Acme"');
  });

  it('builds multiple entries in graph', () => {
    const html = buildJsonLd([
      { type: 'Organization', props: { name: 'Acme' } },
      { type: 'FAQPage', props: { name: 'FAQ' } },
    ], opts);
    expect(html).toContain('"Organization"');
    expect(html).toContain('"FAQPage"');
  });

  it('does NOT escape forward slashes in URLs (only </ )', () => {
    const html = buildJsonLd([
      { type: 'Organization', props: { url: 'https://example.com/path/to/page' } },
    ], opts);
    // Forward slashes should be preserved
    expect(html).toContain('https://example.com/path/to/page');
    // Should NOT contain escaped slashes
    expect(html).not.toContain('https:\\/\\/example.com');
  });

  it('escapes </ to prevent script breakout', () => {
    const html = buildJsonLd([
      { type: 'Organization', props: { name: '</script><script>alert(1)</script>' } },
    ], opts);
    // The </ in the string should be escaped to <\/
    expect(html).not.toContain('</script><script>');
  });

  it('wraps in <script type="application/ld+json">', () => {
    const html = buildJsonLd([
      { type: 'ProfessionalService', props: { name: 'Test' } },
    ], opts);
    expect(html.startsWith('<script type="application/ld+json">')).toBe(true);
    expect(html.endsWith('</script>')).toBe(true);
  });

  it('builds FAQPage with faqs from options', () => {
    const html = buildJsonLd([
      { type: 'FAQPage', props: {} },
    ], { ...opts, faqs: [{ q: 'What is this?', a: 'A test.' }] });
    expect(html).toContain('"Question"');
    expect(html).toContain('"What is this?"');
    expect(html).toContain('"A test."');
  });

  it('builds Article with publisher reference and props', () => {
    const html = buildJsonLd([
      { type: 'Article', props: { headline: 'Hello World', datePublished: '2025-01-01' } },
    ], opts);
    expect(html).toContain('"Article"');
    expect(html).toContain('"Hello World"');
    expect(html).toContain('"2025-01-01"');
    expect(html).toContain('"@id":"https://example.com/#org"');
  });

  it('builds BreadcrumbList with itemListElement positions', () => {
    const html = buildJsonLd([
      {
        type: 'BreadcrumbList',
        props: {
          items: [
            { name: 'Home', url: 'https://example.com' },
            { name: 'Blog', url: 'https://example.com/blog' },
          ],
        },
      },
    ], opts);
    expect(html).toContain('"BreadcrumbList"');
    expect(html).toContain('"ListItem"');
    expect(html).toContain('"position":1');
    expect(html).toContain('"position":2');
    expect(html).toContain('"Home"');
    expect(html).toContain('"Blog"');
  });

  it('builds Product with brand reference', () => {
    const html = buildJsonLd([
      { type: 'Product', props: { name: 'Widget', offers: { price: '9.99' } } },
    ], opts);
    expect(html).toContain('"Product"');
    expect(html).toContain('"Widget"');
    expect(html).toContain('"9.99"');
    expect(html).toContain('"brand"');
  });

  it('builds VideoObject with publisher reference', () => {
    const html = buildJsonLd([
      {
        type: 'VideoObject',
        props: { name: 'Demo', uploadDate: '2025-01-01', thumbnailUrl: 'https://example.com/thumb.jpg' },
      },
    ], opts);
    expect(html).toContain('"VideoObject"');
    expect(html).toContain('"Demo"');
    expect(html).toContain('"uploadDate"');
    expect(html).toContain('"thumbnailUrl"');
  });

  it('builds WebSite with search action support', () => {
    const html = buildJsonLd([
      {
        type: 'WebSite',
        props: {
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://example.com/search?q={query}',
            'query-input': 'required name=query',
          },
        },
      },
    ], opts);
    expect(html).toContain('"WebSite"');
    expect(html).toContain('"SearchAction"');
    expect(html).toContain('"Example"');
  });
});
