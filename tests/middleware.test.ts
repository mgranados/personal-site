import { describe, it, expect } from 'vitest';
import { onRequest } from '../functions/_middleware';

// Minimal Pages context — the middleware only touches `request` and `next`.
type Ctx = Parameters<typeof onRequest>[0];
function ctx(url: string, nextResponse = new Response('asset', { status: 200 })): Ctx {
  return {
    request: new Request(url),
    next: () => Promise.resolve(nextResponse),
  } as unknown as Ctx;
}

describe('scanner / WordPress-probe blocking', () => {
  const blocked = [
    'https://martingranados.com//site/wp-includes/wlwmanifest.xml',
    'https://martingranados.com//xmlrpc.php',
    'https://martingranados.com/wp-admin/',
    'https://martingranados.com/wp-login.php',
    'https://martingranados.com/wp-content/uploads/x.php',
  ];
  for (const url of blocked) {
    it(`blocks ${new URL(url).pathname} with 403`, async () => {
      const res = await onRequest(ctx(url));
      expect(res.status).toBe(403);
    });
  }
});

describe('www → apex canonicalization', () => {
  it('301s www to apex, preserving path + query', async () => {
    const res = await onRequest(ctx('https://www.martingranados.com/writing/?utm=x'));
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://martingranados.com/writing/?utm=x');
  });

  it('leaves apex requests alone (falls through to next())', async () => {
    const res = await onRequest(ctx('https://martingranados.com/writing/'));
    expect(res.status).toBe(200);
  });

  it('leaves *.pages.dev preview deploys alone', async () => {
    const res = await onRequest(ctx('https://abc.personal-site.pages.dev/'));
    expect(res.status).toBe(200);
  });
});

describe('legacy path redirects', () => {
  const cases: ReadonlyArray<readonly [string, string]> = [
    ['/essays', '/writing/'],
    ['/essays/', '/writing/'],
    ['/soccer', '/football/'],
    ['/soccer/', '/football/'],
    ['/bookshelf', '/about/'],
    ['/bookshelf/', '/about/'],
  ];
  for (const [from, to] of cases) {
    it(`301s ${from} → ${to}`, async () => {
      const res = await onRequest(ctx(`https://martingranados.com${from}`));
      expect(res.status).toBe(301);
      expect(res.headers.get('location')).toBe(`https://martingranados.com${to}`);
    });
  }
});

describe('normal requests pass through', () => {
  it('returns the downstream asset response untouched', async () => {
    const sentinel = new Response('asset', { status: 200, headers: { 'x-sentinel': '1' } });
    const res = await onRequest(ctx('https://martingranados.com/about/', sentinel));
    expect(res.headers.get('x-sentinel')).toBe('1');
  });
});
