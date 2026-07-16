/**
 * robotsIntegration — Astro integration that appends a `Sitemap:` entry
 * to robots.txt after build, if @astrojs/sitemap generated a sitemap-index.xml.
 *
 * Opt-in: add to your astro.config integrations array.
 *
 *   import { robotsIntegration } from 'astro-landing-kit/integration/robots';
 *   export default defineConfig({
 *     integrations: [robotsIntegration()],
 *   });
 */
import fs from 'node:fs';
import os from 'node:os';
import type { AstroConfig, AstroIntegration } from 'astro';

export default function robotsIntegration(): AstroIntegration {
  let cfg: AstroConfig;

  return {
    name: 'landing-kit-robots',

    hooks: {
      'astro:config:done': async ({ config }) => {
        cfg = config;
      },

      'astro:build:done': async ({ logger }) => {
        const buildLogger = logger.fork('landing-kit');
        buildLogger.info('Updating `robots.txt` with `sitemap-index.xml` ...');

        try {
          const outDir = cfg.outDir;
          const publicDir = cfg.publicDir;
          const sitemapName = 'sitemap-index.xml';
          const sitemapFile = new URL(sitemapName, outDir);
          const robotsTxtFile = new URL('robots.txt', publicDir);
          const robotsTxtFileInOut = new URL('robots.txt', outDir);

          const hasIntegration =
            Array.isArray(cfg?.integrations) &&
            cfg.integrations?.find((e) => e?.name === '@astrojs/sitemap') !== undefined;
          const sitemapExists = fs.existsSync(sitemapFile);

          if (hasIntegration && sitemapExists) {
            const robotsTxt = fs.readFileSync(robotsTxtFile, { encoding: 'utf8', flag: 'a+' });
            const sitemapUrl = new URL(sitemapName, String(new URL(cfg.base, cfg.site)));
            const pattern = /^Sitemap:(.*)$/m;

            if (!pattern.test(robotsTxt)) {
              fs.writeFileSync(
                robotsTxtFileInOut,
                `${robotsTxt}${os.EOL}${os.EOL}Sitemap: ${sitemapUrl}`,
                { encoding: 'utf8', flag: 'w' },
              );
            } else {
              fs.writeFileSync(
                robotsTxtFileInOut,
                robotsTxt.replace(pattern, `Sitemap: ${sitemapUrl}`),
                { encoding: 'utf8', flag: 'w' },
              );
            }
          }
        } catch (error) {
          buildLogger.error(
            `Failed to update robots.txt: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      },
    },
  };
}
