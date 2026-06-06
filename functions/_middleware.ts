/// <reference types="@cloudflare/workers-types" />

// Root middleware — runs in front of EVERY request (static assets + functions).
//
// IMPORTANT: because a root `_middleware` exists, Cloudflare Pages no longer
// applies `public/_redirects` ("Redirects defined in the _redirects file are not
// applied to requests served by Pages Functions"). So ALL redirects must live
// here. See astro.config.mjs.

const CANONICAL_HOST = 'martingranados.com';

// Vulnerability-scanner / WordPress-probe noise. This is a static site — no
// WordPress, no PHP, no admin surface — so these paths only ever come from bots
// (they were ~25% of all traffic in the 24h CF report). Block them so they never
// reach asset serving: cheaper than rendering the 404 page and keeps logs clean.
const SCANNER_PATTERN = /wp-includes|wp-admin|wp-login|wp-content|wlwmanifest|xmlrpc\.php/i;

// Legacy path redirects (previously lived in public/_redirects). Keyed WITHOUT a
// trailing slash; targets are the canonical trailing-slash URLs Astro builds.
const LEGACY_REDIRECTS: Record<string, string> = {
  '/essays': '/writing/',
  '/soccer': '/football/',
  '/bookshelf': '/about/',
};

// Force the right Content-Type (with charset) on the machine-readable feeds.
// Pages' static asset server types these by extension and drops the charset our
// endpoints set — which mangles UTF-8 (e.g. "Martín" → "MartÃ­n") and serves
// `.md` as text/plain. This can't live in `_headers`: a root middleware bypasses
// it, exactly like `_redirects`.
const CONTENT_TYPES: Record<string, string> = {
  '/projects.md': 'text/markdown; charset=utf-8',
  '/projects.json': 'application/json; charset=utf-8',
};

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);

  // 1. Drop scanner noise early.
  if (SCANNER_PATTERN.test(url.pathname)) {
    return new Response('Forbidden', { status: 403 });
  }

  // 2. Canonicalize host: www.* -> apex, 301, preserving path + query.
  //    (Left untouched: apex, *.pages.dev preview deploys, local dev.)
  if (url.hostname === `www.${CANONICAL_HOST}`) {
    return Response.redirect(`https://${CANONICAL_HOST}${url.pathname}${url.search}`, 301);
  }

  // 3. Legacy path redirects (normalize the trailing slash before lookup).
  const path = url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '');
  const dest = LEGACY_REDIRECTS[path];
  if (dest) {
    return Response.redirect(`https://${CANONICAL_HOST}${dest}${url.search}`, 301);
  }

  // 4. Serve the asset.
  const response = await next();

  // 5. Override the Content-Type for the feeds that need it (see CONTENT_TYPES).
  const contentType = CONTENT_TYPES[url.pathname];
  if (contentType) {
    const headers = new Headers(response.headers);
    headers.set('Content-Type', contentType);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  // 6. Everything else: serve normally.
  return response;
};
