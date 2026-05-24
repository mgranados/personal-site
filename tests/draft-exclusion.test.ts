import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');

describe('draft posts', () => {
  it('require a prior pnpm build (this test reads dist/)', () => {
    expect(existsSync(distDir), 'dist/ missing — run `pnpm build` first').toBe(true);
  });

  it('are excluded from the production build', () => {
    expect(existsSync(join(distDir, 'draft-test', 'index.html'))).toBe(false);
    expect(existsSync(join(distDir, 'draft-test.html'))).toBe(false);
  });

  it('do not leak into the writing index page', async () => {
    const indexHtml = await import('node:fs').then((fs) =>
      fs.promises.readFile(join(distDir, 'writing', 'index.html'), 'utf-8'),
    );
    expect(indexHtml).not.toContain('Draft test post');
  });
});

describe('published essays', () => {
  it('all four legacy essays land at root paths', () => {
    for (const slug of ['whether', 'qrcode', 'football', 'feeling']) {
      expect(
        existsSync(join(distDir, slug, 'index.html')),
        `expected dist/${slug}/index.html to exist`,
      ).toBe(true);
    }
  });

  it('rss feed lists published posts and not drafts', async () => {
    const rss = await import('node:fs').then((fs) =>
      fs.promises.readFile(join(distDir, 'rss.xml'), 'utf-8'),
    );
    expect(rss).toContain('Whether you like it or not');
    expect(rss).toContain('Champions League was insanely good this year');
    expect(rss).not.toContain('Draft test post');
  });
});
