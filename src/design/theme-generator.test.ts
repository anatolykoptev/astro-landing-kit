import { describe, it, expect } from 'vitest';
import { parseDesignMd } from './parser';
import { generateThemeCss } from './theme-generator';

const HEADER = '# Design System: Proof\n\n';

function md(bullets: string): string {
  return `${HEADER}## 2. Colors\n\n${bullets}\n`;
}

describe('generateThemeCss — emits --aw-color-* that widgets + tailwind.css actually read', () => {
  it('maps the first color to --aw-color-primary using the parsed token value verbatim', () => {
    const tokens = parseDesignMd(md('* **Primary** (oklch(0.55 0.22 300)) — Primary brand color'));
    const css = generateThemeCss(tokens);

    expect(css).toContain('--aw-color-primary: oklch(0.55 0.22 300);');
  });

  it('does NOT emit the pre-fix Tailwind @theme / --color-primary names that nothing reads', () => {
    // Regression guard for BUG-2: the old generator emitted `@theme { --color-primary }`,
    // which no component reads (they read --aw-color-*) — so the theme never reached a button.
    const tokens = parseDesignMd(md('* **Primary** (#3B82F6) — Primary brand color'));
    const css = generateThemeCss(tokens);

    expect(css).not.toContain('@theme');
    expect(css).not.toMatch(/(^|\s)--color-primary:/);
    expect(css).toContain(':root {');
  });

  it('defaults secondary + accent to primary so no kit teal leaks when DESIGN.md gives only a primary', () => {
    const tokens = parseDesignMd(md('* **Primary** (#7C3AED) — Primary brand color'));
    const css = generateThemeCss(tokens);

    expect(css).toContain('--aw-color-secondary: #7C3AED;');
    expect(css).toContain('--aw-color-accent: #7C3AED;');
  });

  it('routes semantic roles to the matching --aw-color-* target', () => {
    const tokens = parseDesignMd(
      md(
        [
          '* **Primary** (#7C3AED) — Primary brand color',
          '* **Secondary** (#DB2777) — Secondary brand color',
          '* **Surface** (oklch(0.98 0.01 300)) — Background surface',
          '* **Ink** (#1E1B2E) — Body text foreground',
          '* **Muted** (#6B7280) — Muted secondary text',
        ].join('\n')
      )
    );
    const css = generateThemeCss(tokens);

    expect(css).toContain('--aw-color-secondary: #DB2777;');
    expect(css).toContain('--aw-color-bg-page: oklch(0.98 0.01 300);');
    expect(css).toContain('--aw-color-text-default: #1E1B2E;');
    expect(css).toContain('--aw-color-text-muted: #6B7280;');
  });
});
