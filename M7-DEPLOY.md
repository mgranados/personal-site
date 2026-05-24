# M7 — Cloudflare Pages deploy checklist

Wrangler-first setup. ~15 minutes if you don't hit any DNS surprises. Both domains
(`martingranados.com` canonical, `martingranadosgarcia.com` funnel) are registered on
Cloudflare Registrar with DNS already on CF, which simplifies steps 5 and 6.

Wrangler is already installed in this repo (`pnpm wrangler --version` should print 4.x).

---

## 1. Authenticate wrangler

```sh
pnpm wrangler login
```

Browser opens, OAuth flow, returns to terminal. Token cached at `~/.wrangler/`.

## 2. Create the Pages project

```sh
pnpm wrangler pages project create personal-site --production-branch main
```

Creates a `personal-site` project; site immediately reachable at
`https://personal-site.pages.dev` (no content yet).

## 3. First deploy

```sh
pnpm build
pnpm wrangler pages deploy dist --project-name personal-site --branch main
```

~30 seconds. Production deploy to `personal-site.pages.dev`.

## 4. Smoke-test the pages.dev URL before going custom-domain

```sh
curl -sI https://personal-site.pages.dev/                              # 200
curl -sI https://personal-site.pages.dev/whether/                      # 200
curl -sI https://personal-site.pages.dev/about/                        # 200
curl -sI https://personal-site.pages.dev/writing/                      # 200
curl -sI https://personal-site.pages.dev/essays/ | grep -i location    # /writing/
curl -sI https://personal-site.pages.dev/soccer/ | grep -i location    # /football/
curl -sI https://personal-site.pages.dev/bookshelf/ | grep -i location # /about/
curl -s   https://personal-site.pages.dev/_hit.gif | wc -c             # 43
curl -sI https://personal-site.pages.dev/rss.xml                       # 200
curl -sI https://personal-site.pages.dev/sitemap-index.xml             # 200
curl -sI https://personal-site.pages.dev/robots.txt                    # 200
```

All green? Move on. Any failure? Don't continue — check the build log
(`pnpm wrangler pages deployment tail` for live logs).

## 5. Add canonical custom domains

```sh
pnpm wrangler pages domain add personal-site martingranados.com
pnpm wrangler pages domain add personal-site www.martingranados.com
```

Because the zone is on CF, wrangler can usually auto-create the DNS record. If it asks
to confirm, say yes. If it prints "manually add a CNAME":

- Dashboard → `martingranados.com` zone → DNS → add CNAME records:
  - `@` (apex) → `personal-site.pages.dev`, proxied (orange cloud)
  - `www` → `personal-site.pages.dev`, proxied (orange cloud)

CF auto-issues HTTPS via their own CA within ~2 minutes.

Verify:

```sh
curl -sI https://martingranados.com/                                   # 200
curl -sI https://www.martingranados.com/                               # 200 (or 301 to apex,
                                                                       #  depending on CF's
                                                                       #  default — fine either way)
```

## 6. Set up the funnel domain redirect

`martingranadosgarcia.com` → `martingranados.com`, 301, preserve path + query.

**Single Redirect** (fewer clicks, recommended for this single-rule case):

Dashboard → `martingranadosgarcia.com` zone → Rules → Redirect Rules → Create rule:

- Name: `Funnel to canonical`
- When incoming requests match: `(http.host eq "martingranadosgarcia.com")`
- Then: **Dynamic redirect**
  - Expression: `concat("https://martingranados.com", http.request.uri.path)`
  - Status: `301`
  - Preserve query string: yes

Save + deploy.

Alternative if you prefer the Bulk Redirect approach (good if you'll have more redirect
domains later): account home → Bulk Redirects → create list with source
`https://martingranadosgarcia.com/*` → target `https://martingranados.com/$1`, 301.

Verify:

```sh
curl -sI https://martingranadosgarcia.com/ | grep -i location          # → martingranados.com/
curl -sI https://martingranadosgarcia.com/whether | grep -i location   # → martingranados.com/whether
```

## 7. (Optional) Wire auto-deploys on git push

Right now deploys are manual via `wrangler pages deploy`. To get `git push origin main`
→ auto-deploy, you have to use the dashboard (wrangler doesn't expose Git connection):

Dashboard → Workers & Pages → `personal-site` → Settings → Builds & deployments →
Configure source → Connect to Git → pick `mgranados/personal-site`. Set:

- Framework preset: **Astro**
- Build command: `pnpm build`
- Output directory: `dist`
- Production branch: `main`

After connecting:

- pushes to `main` → production deploy
- PR pushes → preview deploy at `https://<branch>.personal-site.pages.dev`

## 8. Final verification — v1 done

```sh
curl -sI https://martingranados.com/                                  # 200 HTTPS
curl -sI https://martingranadosgarcia.com/ | grep -i location         # 301 → martingranados.com
curl -sI https://martingranados.com/essays | grep -i location         # 301 → /writing
curl -sI https://martingranados.com/soccer | grep -i location         # 301 → /football
curl -s   https://martingranados.com/_hit.gif | wc -c                 # 43
curl -sI https://martingranados.com/rss.xml                           # 200
```

If those all pass, **v1 is shipped**.

## After M7

- Open `https://martingranados.com` in a browser to eyeball it.
- Check Lighthouse: perf ≥ 95, a11y ≥ 95, SEO ≥ 95 (open in Chrome → DevTools → Lighthouse).
- Hand off to M8 (mgg's work): real bio if you want to rewrite it, first real blog post,
  any photo update, etc.
- Move `ideas/personal-site-blog.md` → `shipped/personal-site-blog.md` in the ideator
  repo to mark the project shipped.
- Analytics: the `/_hit.gif` pageview log lands in CF Pages Functions logs. Dashboard →
  `personal-site` → Functions → Logs. Each request emits a JSON line with
  `{ts, path, country, bot, ua}`.

## Rollback

If a deploy is bad:

```sh
pnpm wrangler pages deployment list --project-name personal-site
# pick a previous good deployment ID
pnpm wrangler pages deployment rollback <id>
```

Reverts in seconds.
