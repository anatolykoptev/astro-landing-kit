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
});
