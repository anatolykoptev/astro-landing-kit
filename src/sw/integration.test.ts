import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import serviceWorkerIntegration from './integration';

function makeConfigSetupContext() {
  return {
    injectScript: vi.fn(),
  };
}

function makeBuildDoneContext(dir: string) {
  return {
    dir: new URL(`file://${dir}/`),
    logger: { fork: () => ({ info: vi.fn(), warn: vi.fn() }) },
  };
}

function getHook<T extends 'astro:config:setup' | 'astro:build:done'>(
  integration: ReturnType<typeof serviceWorkerIntegration>,
  stage: T
) {
  const hook = integration.hooks[stage];
  if (!hook) throw new Error(`${stage} hook missing`);
  return hook;
}

describe('serviceWorkerIntegration', () => {
  const tmpDirs: string[] = [];

  afterEach(() => {
    for (const dir of tmpDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  function mkTmpDir(): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'landing-kit-sw-int-'));
    tmpDirs.push(dir);
    return dir;
  }

  it('injects a page-stage script guarded by import.meta.env.PROD (skips dev)', () => {
    const integration = serviceWorkerIntegration();
    const ctx = makeConfigSetupContext();

    (getHook(integration, 'astro:config:setup') as any)(ctx);

    expect(ctx.injectScript).toHaveBeenCalledTimes(1);
    const [stage, content] = ctx.injectScript.mock.calls[0];
    expect(stage).toBe('page');
    expect(content).toContain('import.meta.env.PROD');
    expect(content).toContain("navigator.serviceWorker.register('/sw.js')");
  });

  it('writes sw.js into the build output dir, stamped with the overridden build id', async () => {
    const dir = mkTmpDir();
    const integration = serviceWorkerIntegration({ buildId: 'testsha1' });
    const ctx = makeBuildDoneContext(dir);

    await (getHook(integration, 'astro:build:done') as any)(ctx);

    const written = fs.readFileSync(path.join(dir, 'sw.js'), 'utf-8');
    expect(written).toContain('const CACHE = "lk-testsha1";');
  });

  it('honors a custom cachePrefix', async () => {
    const dir = mkTmpDir();
    const integration = serviceWorkerIntegration({ buildId: 'zzz', cachePrefix: 'acme' });
    const ctx = makeBuildDoneContext(dir);

    await (getHook(integration, 'astro:build:done') as any)(ctx);

    const written = fs.readFileSync(path.join(dir, 'sw.js'), 'utf-8');
    expect(written).toContain('const CACHE = "acme-zzz";');
  });

  it('resolves a real build id (git sha or timestamp) when none is overridden', async () => {
    const dir = mkTmpDir();
    const integration = serviceWorkerIntegration();
    const ctx = makeBuildDoneContext(dir);

    await (getHook(integration, 'astro:build:done') as any)(ctx);

    const written = fs.readFileSync(path.join(dir, 'sw.js'), 'utf-8');
    expect(written).toMatch(/const CACHE = "lk-[^"]+";/);
  });
});
