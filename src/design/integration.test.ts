import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import designMdIntegration, { DESIGN_THEME_LAYER } from './integration';

function makeHookContext(rootDir: string) {
  const buildLogger = { info: vi.fn(), warn: vi.fn() };
  return {
    config: { root: new URL(`file://${rootDir}/`) },
    updateConfig: vi.fn(),
    addWatchFile: vi.fn(),
    logger: { fork: () => buildLogger },
    buildLogger,
  };
}

function getSetupHook(integration: ReturnType<typeof designMdIntegration>) {
  const hook = integration.hooks['astro:config:setup'];
  if (!hook) throw new Error('astro:config:setup hook missing');
  return hook;
}

// Pull the design-theme Vite plugin the integration registered via updateConfig,
// and run its `load` hook against the theme-source module id — this is the exact path
// <DesignTheme /> resolves at build time.
function loadThemeSource(ctx: ReturnType<typeof makeHookContext>): string | undefined {
  const call = (ctx.updateConfig.mock.calls as any[]).find((c) => c[0]?.vite?.plugins?.length);
  if (!call) throw new Error('integration did not register a vite plugin');
  const plugin = call[0].vite.plugins[0];
  const out = plugin.load('/anywhere/src/design/theme-source.ts');
  return typeof out === 'string' ? out : undefined;
}

describe('designMdIntegration', () => {
  const tmpDirs: string[] = [];

  afterEach(() => {
    for (const dir of tmpDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  function tmpDesign(contents: string): { dir: string; designMdPath: string } {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'landing-kit-design-'));
    tmpDirs.push(dir);
    const designMdPath = path.join(dir, 'DESIGN.md');
    if (contents) fs.writeFileSync(designMdPath, contents);
    return { dir, designMdPath };
  }

  it('throws instead of silently falling back to the default theme when DESIGN.md has no colors', () => {
    const { dir, designMdPath } = tmpDesign('# Design System: Empty\n\n## 2. Colors\n\nno bullets here\n');
    const setup = getSetupHook(designMdIntegration({ designMd: designMdPath }));

    expect(() => setup(makeHookContext(dir) as any)).toThrow(/DESIGN\.md/);
  });

  it('still falls back quietly when no DESIGN.md exists at all (not a format error)', () => {
    const { dir, designMdPath } = tmpDesign('');
    const setup = getSetupHook(designMdIntegration({ designMd: designMdPath }));

    expect(() => setup(makeHookContext(dir) as any)).not.toThrow();
  });

  // BUG-3 regression: the successful parse → generate → virtual-module-load branch was
  // never exercised, so the pipeline could be dead end-to-end and still show green.
  it('exposes generated --aw-color-* overrides via the theme-source module for a valid DESIGN.md', () => {
    const { dir, designMdPath } = tmpDesign(
      '# Design System: Proof\n\n## 2. Colors\n\n' +
        '* **Primary** (oklch(0.55 0.22 300)) — Primary brand color\n' +
        '* **Surface** (oklch(0.98 0.01 300)) — Background surface\n'
    );
    const setup = getSetupHook(designMdIntegration({ designMd: designMdPath }));
    const ctx = makeHookContext(dir);

    setup(ctx as any);
    const mod = loadThemeSource(ctx);

    expect(mod).toBeTruthy();
    expect(mod).toContain('designThemeCss');
    // The distinctive DESIGN.md accent reaches the var widgets read (--aw-color-primary),
    // NOT the pre-fix Tailwind name (--color-primary / @theme) nothing reads.
    expect(mod).toContain('--aw-color-primary');
    expect(mod).toContain('oklch(0.55 0.22 300)');
    expect(mod).not.toContain('@theme');
  });

  // HIGH-1 regression: the generated CSS must be wrapped in the highest-priority named
  // layer so it always wins over CustomStyles defaults AND an optionally-imported
  // theme.css, regardless of head/DOM order.
  it('wraps the generated theme in the landing-kit-design-theme cascade layer', () => {
    const { dir, designMdPath } = tmpDesign(
      '# Design System: Proof\n\n## 2. Colors\n\n* **Primary** (#7C3AED) — Primary brand color\n'
    );
    const setup = getSetupHook(designMdIntegration({ designMd: designMdPath }));
    const ctx = makeHookContext(dir);

    setup(ctx as any);
    const mod = loadThemeSource(ctx);

    expect(DESIGN_THEME_LAYER).toBe('landing-kit-design-theme');
    expect(mod).toContain(`@layer ${DESIGN_THEME_LAYER} {`);
    expect(mod).toContain('--aw-color-primary: #7C3AED;');
  });

  // CRITICAL regression: a bad (but hex-verifiable) surface/text pairing must warn, not
  // ship silently.
  it('logs a WCAG contrast warning for a low-contrast hex surface/text pairing', () => {
    const { dir, designMdPath } = tmpDesign(
      '# Design System: LowContrast\n\n## 2. Colors\n\n' +
        '* **Primary** (#7C3AED) — Primary brand color\n' +
        '* **Gray1** (#777777) — Surface background\n' +
        '* **Gray2** (#888888) — Body text foreground\n'
    );
    const setup = getSetupHook(designMdIntegration({ designMd: designMdPath }));
    const ctx = makeHookContext(dir);

    setup(ctx as any);

    expect(ctx.buildLogger.warn).toHaveBeenCalledWith(expect.stringMatching(/WCAG AA/));
  });

  // CRITICAL regression: a non-hex pairing must be reported as unverifiable, never as a
  // silent pass.
  it('logs an unverifiable-contrast note (not a silent pass) for a non-hex surface/text pairing', () => {
    const { dir, designMdPath } = tmpDesign(
      '# Design System: Oklch\n\n## 2. Colors\n\n' +
        '* **Primary** (oklch(0.55 0.22 300)) — Primary brand color\n' +
        '* **Surface** (oklch(0.2 0 0)) — Surface background\n' +
        '* **Ink** (oklch(0.22 0 0)) — Body text foreground\n'
    );
    const setup = getSetupHook(designMdIntegration({ designMd: designMdPath }));
    const ctx = makeHookContext(dir);

    setup(ctx as any);

    expect(ctx.buildLogger.warn).toHaveBeenCalledWith(expect.stringMatching(/[Cc]ould not verify contrast/));
  });

  it('does not warn about contrast when no paired surface/text override happens', () => {
    const { dir, designMdPath } = tmpDesign(
      '# Design System: PrimaryOnly\n\n## 2. Colors\n\n* **Primary** (#7C3AED) — Primary brand color\n'
    );
    const setup = getSetupHook(designMdIntegration({ designMd: designMdPath }));
    const ctx = makeHookContext(dir);

    setup(ctx as any);

    expect(ctx.buildLogger.warn).not.toHaveBeenCalled();
  });

  it('leaves the theme-source export empty when there is no DESIGN.md (backward-compatible default)', () => {
    const { dir, designMdPath } = tmpDesign('');
    const setup = getSetupHook(designMdIntegration({ designMd: designMdPath }));
    const ctx = makeHookContext(dir);

    setup(ctx as any);
    const mod = loadThemeSource(ctx);

    // Plugin still registered, but the generated CSS is empty → <DesignTheme /> injects nothing.
    expect(mod).toContain('designThemeCss = ""');
    expect(mod).not.toContain('--aw-color-');
  });

  it('does not intercept unrelated module ids', () => {
    const { dir, designMdPath } = tmpDesign('');
    const setup = getSetupHook(designMdIntegration({ designMd: designMdPath }));
    const ctx = makeHookContext(dir);

    setup(ctx as any);
    const call = (ctx.updateConfig.mock.calls as any[]).find((c) => c[0]?.vite?.plugins?.length);
    const plugin = call[0].vite.plugins[0];

    expect(plugin.load('/anywhere/src/components/Hero.astro')).toBeUndefined();
  });
});
