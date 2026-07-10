import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import designMdIntegration from './integration';

function makeHookContext(rootDir: string) {
  return {
    config: { root: new URL(`file://${rootDir}/`) },
    updateConfig: vi.fn(),
    addWatchFile: vi.fn(),
    logger: { fork: () => ({ info: vi.fn(), warn: vi.fn() }) },
  };
}

function getSetupHook(integration: ReturnType<typeof designMdIntegration>) {
  const hook = integration.hooks['astro:config:setup'];
  if (!hook) throw new Error('astro:config:setup hook missing');
  return hook;
}

describe('designMdIntegration — zero colors must fail the build, not warn-and-continue', () => {
  const tmpDirs: string[] = [];

  afterEach(() => {
    for (const dir of tmpDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('throws instead of silently falling back to the default theme when DESIGN.md has no colors', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'landing-kit-design-'));
    tmpDirs.push(dir);
    const designMdPath = path.join(dir, 'DESIGN.md');
    fs.writeFileSync(designMdPath, '# Design System: Empty\n\n## 2. Colors\n\nno bullets here\n');

    const integration = designMdIntegration({ designMd: designMdPath });
    const ctx = makeHookContext(dir);
    const setup = getSetupHook(integration);

    expect(() => setup(ctx as any)).toThrow(/DESIGN\.md/);
  });

  it('still falls back quietly when no DESIGN.md exists at all (not a format error)', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'landing-kit-design-'));
    tmpDirs.push(dir);
    const designMdPath = path.join(dir, 'DESIGN.md');

    const integration = designMdIntegration({ designMd: designMdPath });
    const ctx = makeHookContext(dir);
    const setup = getSetupHook(integration);

    expect(() => setup(ctx as any)).not.toThrow();
  });
});
