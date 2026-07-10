import { describe, it, expect } from 'vitest';
import { parseDesignMd } from './parser';
import { generateSmartDarkMode } from './dark-mode';

const HEADER = '# Design System: Contrast\n\n';

function md(bullets: string): string {
  return `${HEADER}## 2. Colors\n\n${bullets}\n`;
}

describe('generateSmartDarkMode — non-hex tokens must not NaN-poison classification (BUG-4)', () => {
  it('swaps surface ↔ text into a .dark { --aw-color-* } block for hex tokens', () => {
    const tokens = parseDesignMd(
      md(['* **Cream** (#F5F0E8) — Warm surface background', '* **Forest** (#1B3A2B) — Deep body text'].join('\n'))
    );
    const css = generateSmartDarkMode(tokens);

    expect(css).toContain('.dark {');
    // dark bg = the text color, dark text = the surface color
    expect(css).toContain('--aw-color-bg-page: #1B3A2B;');
    expect(css).toContain('--aw-color-text-default: #F5F0E8;');
  });

  it('handles oklch/rgb/hsl tokens without emitting NaN and without throwing', () => {
    const tokens = parseDesignMd(
      md(
        [
          '* **Surface** (oklch(0.98 0.01 90)) — Light surface background',
          '* **Ink** (rgb(20, 24, 30)) — Body text foreground',
        ].join('\n')
      )
    );

    let css = '';
    expect(() => {
      css = generateSmartDarkMode(tokens);
    }).not.toThrow();

    expect(css).not.toContain('NaN');
    expect(css).toContain('.dark {');
    // The swap uses the raw token values verbatim — safe for non-hex.
    expect(css).toContain('--aw-color-bg-page: rgb(20, 24, 30);');
    expect(css).toContain('--aw-color-text-default: oklch(0.98 0.01 90);');
    // The real BUG-4 observable: this is a LIGHT design expressed in oklch/rgb.
    // The pre-fix code ran parseInt on 'oklch(...)' → NaN → `l > 0.6` false → every
    // color counted as "not light" → the design misclassified as dark ("reads as dark").
    // The fix ignores unclassifiable non-hex values, so it must NOT read as dark.
    expect(css).toContain('reads as light');
    expect(css).not.toContain('reads as dark');
  });

  it('mixed hex + non-hex classifies over only the hex colors, never NaN-poisoned', () => {
    const tokens = parseDesignMd(
      md(
        [
          '* **Surface** (#FAFAFA) — Surface background',
          '* **Ink** (oklch(0.2 0 0)) — Body text',
          '* **Accent** (rgb(255, 0, 128)) — Accent highlights',
        ].join('\n')
      )
    );

    const css = generateSmartDarkMode(tokens);
    expect(css).not.toContain('NaN');
    expect(css).toContain('.dark {');
  });

  it('classifies an explicitly dark design (by name) as reading dark', () => {
    const md2 =
      '# Design System: Midnight\n\n## 2. Colors\n\n' +
      '* **Slate** (#0F172A) — Surface background\n' +
      '* **Mist** (#E2E8F0) — Body text foreground\n';
    const css = generateSmartDarkMode(parseDesignMd(md2));

    expect(css).toContain('reads as dark');
    expect(css).toContain('.dark {');
  });

  it('returns a clear skip note (not garbage) when no surface/text roles are present', () => {
    const tokens = parseDesignMd(
      md(['* **Primary** (#7C3AED) — Primary brand color', '* **Accent** (#DB2777) — Accent highlights'].join('\n'))
    );
    const css = generateSmartDarkMode(tokens);

    expect(css).not.toContain('NaN');
    expect(css.toLowerCase()).toContain('skipped');
    expect(css).not.toContain('.dark {');
  });
});
