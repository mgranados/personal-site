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
      // Exclude the draft-test fixture (it's gated to PROD via getStaticPaths,
      // but belt-and-suspenders). All other redirect targets are now handled
      // server-side via public/_redirects so they never appear here anyway.
      filter: (page) => !page.endsWith('/draft-test/'),
    }),
  ],
  // Redirects live in public/_redirects (Cloudflare Pages native format → real 301s,
  // not Astro's meta-refresh HTML pages which return 200 + client-side bounce).
});
