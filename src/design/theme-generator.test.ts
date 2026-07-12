import { describe, it, expect } from 'vitest';
import { parseDesignMd } from './parser';
import { generateThemeCss, checkThemeContrast } from './theme-generator';

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

  it('uses a named accent as primary when a semantic color table starts with its page surface', () => {
    const tokens = parseDesignMd(
      '# Brand\n\n## Color\n\n| Role | Value | Use |\n|---|---|---|\n| --bg | #FFFDF5 | Page background surface |\n| --surface | #F7F2EA | Raised card surface |\n| --ink | #101010 | Body text foreground |\n| --hairline | #DDD5CA | Borders and dividers |\n| --accent | #C4512D | Primary brand accent |\n| --accent-strong | #96391F | Strong action accent |\n| --on-accent | #FFFDF5 | Text on accent fills |\n',
    );
    const css = generateThemeCss(tokens);

    expect(css).toContain('--aw-color-primary: #C4512D;');
    expect(css).toContain('--aw-color-secondary: #96391F;');
    expect(css).toContain('--aw-color-on-primary: #FFFDF5;');
    expect(css).toContain('--aw-color-bg-page: #FFFDF5;');
    expect(css).toContain('--aw-color-bg-card: #F7F2EA;');
    expect(css).toContain('--aw-color-border: #DDD5CA;');
    expect(css).toContain('--aw-color-text-default: #101010;');
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

describe('generateThemeCss — CRITICAL: surface-only DESIGN.md must not invisible-text the site', () => {
  it('does NOT override --aw-color-bg-page when there is a Surface but no text/foreground/body color', () => {
    // The exact failure mode: a dark Surface with no paired text color used to flip
    // bg-page dark while --aw-color-text-default stayed at its near-black default
    // (~1.07:1 contrast — invisible body text sitewide).
    const tokens = parseDesignMd(
      md('* **Primary** (#7C3AED) — Primary brand color\n* **Night** (#0B0B12) — Surface background')
    );
    const css = generateThemeCss(tokens);

    expect(css).not.toMatch(/--aw-color-bg-page:/);
    expect(css).not.toMatch(/--aw-color-text-default:/);
  });

  it('DOES override both bg-page and text-default together when a Surface AND a text color are both present', () => {
    const tokens = parseDesignMd(
      md(
        '* **Primary** (#7C3AED) — Primary brand color\n* **Night** (#0B0B12) — Surface background\n* **Paper** (#F5F0E8) — Body text foreground'
      )
    );
    const css = generateThemeCss(tokens);

    expect(css).toContain('--aw-color-bg-page: #0B0B12;');
    expect(css).toContain('--aw-color-text-default: #F5F0E8;');
    // Heading falls back to the text color when DESIGN.md doesn't name one explicitly —
    // otherwise the default dark heading color would stay invisible against the new dark bg too.
    expect(css).toContain('--aw-color-text-heading: #F5F0E8;');
  });

  it('applies a lone text color (no Surface) that is verified high-contrast against the default bg-page', () => {
    const tokens = parseDesignMd(
      md('* **Primary** (#7C3AED) — Primary brand color\n* **Ink** (#1E1B2E) — Body text foreground')
    );
    const css = generateThemeCss(tokens);

    expect(css).toContain('--aw-color-text-default: #1E1B2E;');
    expect(css).not.toMatch(/--aw-color-bg-page:/);
  });

  // MAJOR-1 regression: the REVERSE of the bg-page gate above was open — a lone text
  // color was emitted with NO check against the default bg-page it actually renders on.
  // A dark-first DESIGN.md naming a light body-text color (whose intended Surface bullet
  // used an off-whitelist role word the classifier dropped) silently produced light text
  // on the default light bg — invisible, with no signal. This is the exact repro: only a
  // Primary + a light "Body text foreground" color, no Surface at all.
  it('SKIPS a lone text color that would be low-contrast against the default bg-page (MAJOR-1)', () => {
    const tokens = parseDesignMd(
      md('* **Primary** (#7C3AED) — Primary brand color\n* **Paper** (#F5F0E8) — Body text foreground')
    );
    const css = generateThemeCss(tokens);

    expect(css).not.toMatch(/--aw-color-text-default:/);
    expect(css).not.toMatch(/--aw-color-bg-page:/);
  });

  it('SKIPS a lone oklch/hsl text color that cannot be verified against the default bg-page (fail-safe, not a silent pass)', () => {
    const tokens = parseDesignMd(
      md(
        '* **Primary** (oklch(0.55 0.22 300)) — Primary brand color\n* **Ink** (oklch(0.3 0.02 300)) — Body text foreground'
      )
    );
    const css = generateThemeCss(tokens);

    expect(css).not.toMatch(/--aw-color-text-default:/);
  });
});

describe('generateThemeCss — HIGH-4: --aw-color-bg-page-dark reflects the brand', () => {
  it('emits --aw-color-bg-page-dark from an explicit dark-role color', () => {
    const tokens = parseDesignMd(
      md('* **Primary** (#7C3AED) — Primary brand color\n* **Midnight** (#0B0B12) — Dark background chrome')
    );
    const css = generateThemeCss(tokens);

    expect(css).toContain('--aw-color-bg-page-dark: #0B0B12;');
  });

  it('derives --aw-color-bg-page-dark from the darkest classifiable color when no explicit dark role is named', () => {
    const tokens = parseDesignMd(
      md(
        '* **Primary** (#7C3AED) — Primary brand color\n* **Ink** (#0A0A0F) — Body text\n* **Paper** (#FAFAF5) — Background surface'
      )
    );
    const css = generateThemeCss(tokens);

    expect(css).toContain('--aw-color-bg-page-dark: #0A0A0F;');
  });

  it('does not emit --aw-color-bg-page-dark when nothing in the palette is dark enough', () => {
    // Both colors are pastel/light (relative luminance well above the 0.2 "dark enough"
    // threshold) — there is no reasonable "darkest" candidate to press into service.
    const tokens = parseDesignMd(
      md('* **Primary** (#93C5FD) — Primary brand color\n* **Sky** (#BFE3FF) — Accent highlight')
    );
    const css = generateThemeCss(tokens);

    expect(css).not.toMatch(/--aw-color-bg-page-dark:/);
  });

  it('does not attempt to derive a dark bg from oklch/hsl values (unclassifiable, skipped)', () => {
    const tokens = parseDesignMd(
      md('* **Primary** (oklch(0.55 0.22 300)) — Primary brand color\n* **Ink** (oklch(0.1 0 0)) — Body text')
    );
    const css = generateThemeCss(tokens);

    expect(css).not.toMatch(/--aw-color-bg-page-dark:/);
  });

  // FOLD-IN regression: the explicit-dark-role pick used to trust the "dark" name/role
  // substring alone with no luminance check — a role like "dark accent for borders"
  // could hijack the whole site's dark-mode chrome with a color that isn't actually dark
  // (or isn't a background at all). Now gated by the same ≤0.2 luminance threshold the
  // derived path already enforces.
  it('rejects an explicit "dark"-named color that is not actually dark enough (luminance > 0.2)', () => {
    // Primary here is a light blue (relative luminance ~0.53, > 0.2) — deliberately NOT
    // #7C3AED, whose luminance (~0.13) happens to already clear the 0.2 "dark enough"
    // bar and would confound this test by qualifying as its own fallback pick.
    const tokens = parseDesignMd(
      md('* **Primary** (#93C5FD) — Primary brand color\n* **Silverish** (#CCCCCC) — Dark accent for borders')
    );
    const css = generateThemeCss(tokens);

    expect(css).not.toMatch(/--aw-color-bg-page-dark:/);
  });

  it('falls through to the derived-darkest pick when the explicit "dark"-named color is too light', () => {
    const tokens = parseDesignMd(
      md(
        '* **Primary** (#7C3AED) — Primary brand color\n' +
          '* **Silverish** (#CCCCCC) — Dark accent for borders\n' +
          '* **Ink** (#0A0A0F) — Body text'
      )
    );
    const css = generateThemeCss(tokens);

    expect(css).toContain('--aw-color-bg-page-dark: #0A0A0F;');
  });

  it('does not trust an unverifiable oklch "dark"-named color on the label alone', () => {
    const tokens = parseDesignMd(
      md(
        '* **Primary** (oklch(0.55 0.22 300)) — Primary brand color\n* **Midnight** (oklch(0.1 0 0)) — Dark background chrome'
      )
    );
    const css = generateThemeCss(tokens);

    expect(css).not.toMatch(/--aw-color-bg-page-dark:/);
  });
});

describe('checkThemeContrast — build-time WCAG check for whatever override generateThemeCss is about to apply', () => {
  it('returns null when no paired override happens (nothing new to check)', () => {
    const tokens = parseDesignMd(md('* **Primary** (#7C3AED) — Primary brand color'));
    expect(checkThemeContrast(tokens)).toBeNull();
  });

  it('flags a low-contrast hex pairing as not meeting WCAG AA', () => {
    const tokens = parseDesignMd(
      md(
        '* **Primary** (#7C3AED) — Primary brand color\n* **Gray1** (#777777) — Surface background\n* **Gray2** (#888888) — Body text foreground'
      )
    );
    const check = checkThemeContrast(tokens);

    expect(check).not.toBeNull();
    expect(check!.ratio).not.toBeNull();
    expect(check!.meetsAA).toBe(false);
    expect(check!.againstDefaultBg).toBe(false);
  });

  it('passes a genuinely high-contrast hex pairing', () => {
    const tokens = parseDesignMd(
      md(
        '* **Primary** (#7C3AED) — Primary brand color\n* **Paper** (#FFFDF5) — Surface background\n* **Ink** (#101010) — Body text foreground'
      )
    );
    const check = checkThemeContrast(tokens);

    expect(check).not.toBeNull();
    expect(check!.meetsAA).toBe(true);
    expect(check!.againstDefaultBg).toBe(false);
  });

  // MAJOR-1: the lone-text branch — no Surface bullet, so the check runs against the
  // kit's own default bg-page reference instead of a DESIGN.md surface value.
  it('checks a lone text color against the default bg-page reference and reports a pass', () => {
    const tokens = parseDesignMd(
      md('* **Primary** (#7C3AED) — Primary brand color\n* **Ink** (#1E1B2E) — Body text foreground')
    );
    const check = checkThemeContrast(tokens);

    expect(check).not.toBeNull();
    expect(check!.againstDefaultBg).toBe(true);
    expect(check!.ratio).not.toBeNull();
    expect(check!.meetsAA).toBe(true);
  });

  it('checks a lone text color against the default bg-page reference and reports a fail', () => {
    const tokens = parseDesignMd(
      md('* **Primary** (#7C3AED) — Primary brand color\n* **Paper** (#F5F0E8) — Body text foreground')
    );
    const check = checkThemeContrast(tokens);

    expect(check).not.toBeNull();
    expect(check!.againstDefaultBg).toBe(true);
    expect(check!.ratio).not.toBeNull();
    expect(check!.meetsAA).toBe(false);
  });

  it('reports unverifiable (ratio null) for a lone oklch/hsl text color, never a silent pass', () => {
    const tokens = parseDesignMd(
      md(
        '* **Primary** (oklch(0.55 0.22 300)) — Primary brand color\n* **Ink** (oklch(0.3 0.02 300)) — Body text foreground'
      )
    );
    const check = checkThemeContrast(tokens);

    expect(check).not.toBeNull();
    expect(check!.againstDefaultBg).toBe(true);
    expect(check!.ratio).toBeNull();
    expect(check!.meetsAA).toBe(false);
  });

  it('reports unverifiable (ratio null) instead of a false pass for non-hex/rgb pairs', () => {
    const tokens = parseDesignMd(
      md(
        '* **Primary** (oklch(0.55 0.22 300)) — Primary brand color\n* **Surface** (oklch(0.2 0 0)) — Surface background\n* **Ink** (oklch(0.22 0 0)) — Body text foreground'
      )
    );
    const check = checkThemeContrast(tokens);

    expect(check).not.toBeNull();
    expect(check!.ratio).toBeNull();
    expect(check!.meetsAA).toBe(false);
  });
});
