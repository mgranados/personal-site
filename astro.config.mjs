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
      // server-side in functions/_middleware.ts so they never appear here anyway.
      filter: (page) => !page.endsWith('/draft-test/'),
    }),
  ],
  // Redirects (legacy paths + www→apex canonicalization) live in
  // functions/_middleware.ts → real 301s. They cannot live in public/_redirects:
  // a root Pages middleware disables _redirects, and _redirects can't match on
  // hostname (so www→apex isn't expressible there anyway).
});
