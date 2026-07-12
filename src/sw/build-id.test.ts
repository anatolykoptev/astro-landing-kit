import { describe, it, expect, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { resolveBuildId } from './build-id';

describe('resolveBuildId', () => {
  const tmpDirs: string[] = [];

  afterEach(() => {
    for (const dir of tmpDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  function mkTmpDir(prefix: string): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
    tmpDirs.push(dir);
    return dir;
  }

  it('returns the short git SHA when cwd is a git checkout with a commit', () => {
    const dir = mkTmpDir('landing-kit-sw-gitrepo-');
    execSync('git init -q', { cwd: dir });
    execSync('git -c user.email=test@test.dev -c user.name=test config commit.gpgsign false', { cwd: dir });
    fs.writeFileSync(path.join(dir, 'x.txt'), 'x');
    execSync('git add x.txt', { cwd: dir });
    execSync('git -c user.email=test@test.dev -c user.name=test commit -q -m init', { cwd: dir });

    const sha = execSync('git rev-parse --short HEAD', { cwd: dir }).toString().trim();

    expect(resolveBuildId(dir)).toBe(sha);
    expect(resolveBuildId(dir)).toMatch(/^[0-9a-f]{4,12}$/);
  });

  it('falls back to an ISO-ish timestamp when cwd is not a git checkout', () => {
    const dir = mkTmpDir('landing-kit-sw-nogit-');

    const id = resolveBuildId(dir);

    // ISO timestamp with ':' and '.' replaced by '-', e.g. 2026-07-11T12-34-56-789Z
    expect(id).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z$/);
  });

  it('falls back (does not throw) when cwd does not exist at all', () => {
    expect(() => resolveBuildId('/nonexistent/path/for/sure/xyz')).not.toThrow();
    expect(resolveBuildId('/nonexistent/path/for/sure/xyz')).toMatch(/Z$/);
  });
});
