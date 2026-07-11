import fs from 'node:fs';
import type { AstroIntegration } from 'astro';
import { resolveBuildId } from './build-id';
import { generateServiceWorkerSource } from './sw-template';

export interface ServiceWorkerIntegrationOptions {
  /** Cache-name prefix; the resolved build id is appended. Default: 'lk'. */
  cachePrefix?: string;
  /** Override the resolved build id — mainly for tests/CI reproducibility. */
  buildId?: string;
}

/**
 * Registers + generates a versioned service worker for a landing site,
 * modeled on oxpulse-chat's SW pattern (see sw-template.ts for the mapping).
 * Unlike that app, this ships zero manual version bumps: the cache name is
 * derived from the consumer repo's git SHA (or a timestamp) at build time.
 *
 * Any open tab reloads on activate — see this module's README for why that
 * caveat is fine for a landing page and NOT a pattern to copy onto an app
 * with client-side session state.
 */
export default function serviceWorkerIntegration(
  options: ServiceWorkerIntegrationOptions = {}
): AstroIntegration {
  const cachePrefix = options.cachePrefix ?? 'lk';

  return {
    name: 'landing-kit-sw',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        // 'page' stage: bundled + processed by Vite, so import.meta.env.PROD
        // is statically resolved — this snippet is a no-op in `astro dev`
        // and only registers the worker in a production build/preview.
        injectScript(
          'page',
          `if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}`
        );
      },
      'astro:build:done': ({ dir, logger }) => {
        const buildLogger = logger.fork('landing-kit-sw');
        const buildId = options.buildId ?? resolveBuildId(process.cwd());
        const cacheName = `${cachePrefix}-${buildId}`;
        const source = generateServiceWorkerSource(cacheName);
        fs.writeFileSync(new URL('sw.js', dir), source, 'utf-8');
        buildLogger.info(`Wrote sw.js (cache ${cacheName})`);
      },
    },
  };
}
