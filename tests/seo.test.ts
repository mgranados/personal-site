import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');

describe('robots.txt', () => {
  it('is present in dist', () => {
    expect(existsSync(join(distDir, 'robots.txt'))).toBe(true);
  });

  it('points crawlers at the sitemap', () => {
    const robots = readFileSync(join(distDir, 'robots.txt'), 'utf-8');
    expect(robots).toContain('Sitemap: https://martingranados.com/sitemap-index.xml');
  });
});

describe('sitemap', () => {
  it('sitemap-index.xml is present', () => {
    expect(existsSync(join(distDir, 'sitemap-index.xml'))).toBe(true);
  });

  it('lists landing, writing index, about, and the four essays', () => {
    const sitemap = readFileSync(join(distDir, 'sitemap-0.xml'), 'utf-8');
    for (const path of [
      '/',
      '/writing/',
      '/about/',
      '/whether/',
      '/qrcode/',
      '/football/',
      '/feeling/',
    ]) {
      expect(sitemap, `sitemap should include https://martingranados.com${path}`).toContain(
        `https://martingranados.com${path}`,
      );
    }
  });

  it('excludes redirect-only pages + the draft fixture', () => {
    const sitemap = readFileSync(join(distDir, 'sitemap-0.xml'), 'utf-8');
    for (const path of ['/essays/', '/soccer/', '/bookshelf/', '/draft-test/']) {
      expect(sitemap, `sitemap must NOT include https://martingranados.com${path}`).not.toContain(
        `https://martingranados.com${path}`,
      );
    }
  });
});

describe('JSON-LD structured data', () => {
  it('home has a Person schema', () => {
    const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain('Martín Granados García');
  });

  it('each essay has a BlogPosting schema', () => {
    for (const slug of ['whether', 'qrcode', 'football', 'feeling']) {
      const html = readFileSync(join(distDir, slug, 'index.html'), 'utf-8');
      expect(html, `${slug} should include BlogPosting schema`).toContain('"@type":"BlogPosting"');
    }
  });
});

describe('open graph + twitter meta', () => {
  it('home page has og:title, og:image, og:url, twitter:card', () => {
    const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
    expect(html).toMatch(/<meta property="og:title"/);
    expect(html).toMatch(/<meta property="og:image"/);
    expect(html).toMatch(/<meta property="og:url"/);
    expect(html).toMatch(/<meta name="twitter:card" content="summary_large_image"/);
  });

  it('post pages mark og:type as article + include published time', () => {
    const html = readFileSync(join(distDir, 'whether', 'index.html'), 'utf-8');
    expect(html).toMatch(/<meta property="og:type" content="article"/);
    expect(html).toMatch(/<meta property="article:published_time" content="2019-08-01/);
  });
});

// Redirects moved from public/_redirects into functions/_middleware.ts (a root
// Pages middleware disables _redirects). The 301 behavior is unit-tested in
// tests/middleware.test.ts; here we just assert the dead file is gone.
describe('cloudflare _redirects', () => {
  it('is no longer shipped (redirects live in the middleware now)', () => {
    expect(existsSync(join(distDir, '_redirects'))).toBe(false);
  });
});

describe('tracking pixel', () => {
  it('is present in every page (loaded from /_hit.gif)', () => {
    for (const file of [
      'index.html',
      'about/index.html',
      'whether/index.html',
      'writing/index.html',
    ]) {
      const html = readFileSync(join(distDir, file), 'utf-8');
      expect(html, `${file} should include the /_hit.gif tracking pixel`).toContain('/_hit.gif');
    }
  });
});
