// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://martingranados.com',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        // Exclude redirect-only pages from the sitemap (they 301 elsewhere)
        !page.endsWith('/essays/') &&
        !page.endsWith('/soccer/') &&
        !page.endsWith('/bookshelf/') &&
        // Exclude the draft-test fixture (it's gated to non-prod, but belt-and-suspenders)
        !page.endsWith('/draft-test/'),
    }),
  ],
  redirects: {
    '/essays': '/writing',
    '/soccer': '/football',
    '/bookshelf': '/about',
  },
});
