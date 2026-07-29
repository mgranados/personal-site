/// <reference types="@cloudflare/workers-types" />

// GET /api/weather — edge-cached proxy for the open-meteo current conditions
// used by /waves. One upstream call per edge location per 15 minutes serves
// every visitor; the Cache-Control header lets browsers reuse it too, so a
// single visitor never re-fetches within the window regardless of reloads.

const UPSTREAM =
  'https://api.open-meteo.com/v1/forecast?latitude=33.5589&longitude=133.5314' +
  '&current=temperature_2m,cloud_cover,precipitation,weather_code,wind_speed_10m,is_day&timezone=Asia%2FTokyo';

const TTL_SECONDS = 900; // 15 minutes

export const onRequestGet: PagesFunction = async (context) => {
  // Named cache: same edge cache as caches.default, but typed identically in
  // both the DOM lib (astro check) and workers-types.
  const cache = await caches.open('weather');
  const key = new Request(new URL('/api/weather', context.request.url).toString());

  let response = await cache.match(key);
  if (!response) {
    const upstream = await fetch(UPSTREAM);
    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: 'upstream unavailable' }), {
        status: 502,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }
    response = new Response(upstream.body, {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': `public, max-age=${TTL_SECONDS}`,
      },
    });
    context.waitUntil(cache.put(key, response.clone()));
  }
  return response;
};
