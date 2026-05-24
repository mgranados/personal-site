// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://martingranados.com',
  integrations: [mdx()],
  redirects: {
    '/essays': '/writing',
    '/soccer': '/football',
    '/bookshelf': '/about',
  },
});
