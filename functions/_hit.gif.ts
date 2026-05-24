/// <reference types="@cloudflare/workers-types" />

// 1x1 transparent GIF (43 bytes). Generated once, reused for every request.
const GIF_BYTES = new Uint8Array([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00,
  0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b,
]);

// Best-effort bot UA filter. Bots that announce themselves get logged as bot=true so we can
// filter them in queries; bots that don't announce slip through (acceptable for v1).
const BOT_PATTERN = /bot|crawl|spider|slurp|preview|fetch|monitor|headless|chrome-lighthouse/i;

export const onRequest: PagesFunction = (context) => {
  const { request } = context;
  const referer = request.headers.get('referer') ?? '';
  const ua = request.headers.get('user-agent') ?? '';

  let path = '';
  try {
    path = new URL(referer).pathname;
  } catch {
    /* no referer / malformed — leave blank */
  }

  // CF injects `request.cf` at the edge; absent locally and in non-CF contexts.
  const cf = (request as Request & { cf?: IncomingRequestCfProperties }).cf;
  const country = cf?.country ?? 'unknown';

  const isBot = BOT_PATTERN.test(ua);

  // Log to Cloudflare's request log (visible in CF Pages dashboard).
  console.log(
    JSON.stringify({
      type: 'pageview',
      ts: new Date().toISOString(),
      path,
      country,
      bot: isBot,
      ua: ua.slice(0, 200), // truncate to keep log lines small
    }),
  );

  return new Response(GIF_BYTES, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Content-Length': String(GIF_BYTES.length),
      'Cache-Control': 'no-store, max-age=0',
    },
  });
};
