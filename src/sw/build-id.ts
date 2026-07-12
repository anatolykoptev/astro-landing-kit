import { execSync } from 'node:child_process';

/**
 * Resolves a deterministic per-deploy build id for the service-worker cache
 * name: the short git SHA of the CONSUMER repo at `cwd`. Falls back to an
 * ISO timestamp when `cwd` isn't a git checkout (tarball deploy, detached
 * `.git`) or `git` isn't on `PATH` — either way the build still gets a
 * unique-enough id and cache-busting still works, it just isn't traceable
 * back to a commit.
 *
 * This replaces oxpulse-chat's hand-bumped `CACHE = "oxpulse-vNNN"` counter:
 * that scheme suits an app changelog (each bump documents *why*) but a
 * landing page has no changelog to bump — deriving the id from the build
 * itself means zero manual steps and zero risk of forgetting to bump.
 */
export function resolveBuildId(cwd: string): string {
  try {
    const sha = execSync('git rev-parse --short HEAD', {
      cwd,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    if (sha) return sha;
  } catch {
    // not a git checkout, git missing, or a corrupt/detached repo — fall through
  }
  return new Date().toISOString().replace(/[:.]/g, '-');
}
