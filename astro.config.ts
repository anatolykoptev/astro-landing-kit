import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import compress from 'astro-compress';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

import astrowind from './vendor/integration';
import designMdIntegration from './src/design/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: 'static',

  // Astro 7 changed the compressHTML default from `true` to `'jsx'`, which collapses
  // whitespace between inline elements using JSX rules instead of HTML rules — this
  // kit ships widgets to consumer sites, so pin the v6 behavior explicitly rather than
  // let every consumer's markup silently reflow. See docs/upgrade-to/v7 "Whitespace".
  compressHTML: true,

  integrations: [
    svelte(),
    // DESIGN.md → --aw-color-* theme pipeline (opt-in per consumer; here the kit
    // dogfoods its own pipeline). No DESIGN.md at the project root → no-op, kit renders
    // the CustomStyles.astro defaults.
    designMdIntegration(),
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
