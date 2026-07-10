import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

describe('apply.ts — CLI entry point must not fire on import', () => {
  const originalArgv = process.argv;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.argv = originalArgv;
    vi.doUnmock('node:fs/promises');
    vi.restoreAllMocks();
  });

  it('does not read or write any files merely from being imported during a build-like invocation', async () => {
    const readFile = vi.fn().mockRejectedValue(new Error('apply.ts must not read files on import'));
    const writeFile = vi.fn();
    const mkdir = vi.fn();

    vi.doMock('node:fs/promises', () => ({
      default: { readFile, writeFile, mkdir },
    }));

    // Simulates what `astro build` leaves in process.argv when it merely IMPORTS
    // this module transitively (e.g. via the package's `./design` barrel export).
    // argv[1] is astro's own entrypoint, not this file — yet argv.slice(2)[0]
    // ('build') is truthy, which is exactly what tripped the old unconditional
    // `if (args[0])` CLI guard into calling applyDesign() as a side effect.
    process.argv = ['/usr/bin/node', '/project/node_modules/.bin/astro', 'build'];

    await import('./apply');

    // Let any fire-and-forget promise from a wrongly-fired CLI entry settle.
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(readFile).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
  });
});
