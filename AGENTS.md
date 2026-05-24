# AGENTS.md — martingranados.com

This is Martín Granados García's personal site: Astro 5+ / TypeScript strict / Tailwind 4 / MDX, hosted on Cloudflare Pages. Content-first. Built and extended by harness agents working through the milestone arc defined in `/Users/mgg/Developer/ideator/ideas/personal-site-blog.md` (read that spec; it's the contract for this repo).

## Scripts

```
pnpm dev            # astro dev server (http://localhost:4321)
pnpm build          # production build (includes sync-projects at M5+)
pnpm preview        # serve the built dist/
pnpm test           # vitest run
pnpm typecheck      # astro check (strict TS + .astro)
pnpm lint           # eslint . && prettier --check .
pnpm format         # prettier --write .
pnpm sync-projects  # fetch ideator entries (placeholder until M5)
pnpm verify         # typecheck + lint + test + build (gate before commit)
```

`pnpm verify` is the gate. Don't commit if it doesn't pass.

## Hard rules

1. **Ideator entries default to private.** A project from `mgranados/ideator` only appears on this site if its frontmatter has `public: true`. The sync script filters; the build never bypasses.
2. **Build never fails on ideator fetch errors.** If `sync-projects` can't reach GitHub, fall back to the on-disk cache and log a warning. Builds must always succeed.
3. **Blog drafts are excluded from production builds.** A post with frontmatter `draft: true` must not appear in `dist/`. There is a test that asserts this — keep it.
4. **No client-side JS unless it earns its place.** Astro defaults to zero JS; opt in per-component (`client:load`, `client:visible`, etc.) only when the interaction genuinely needs it.
5. **No type shortcuts.** No `as any`, no `// @ts-ignore`, no `!` non-null-assertion without a comment justifying it. `astro check` must pass clean.

## Working agreements

- **One milestone = one commit.** Don't bundle. Commit messages start with `M<N>: <summary>`.
- **No non-reversible actions** (DNS changes, public deploys, force-push, deleting external repos) without explicit user OK.
- **If the plan needs changing**, update `/Users/mgg/Developer/ideator/ideas/personal-site-blog.md` _first_, then proceed. Don't silently deviate.
- **Cross-repo changes** (M5 touches `ideator/templates/idea.md` and `ideator/AGENTS.md`) require user OK before commit.

## Repo layout (evolves per milestone)

```
src/
  pages/          # Astro routes
  layouts/        # shared layouts (added M1)
  styles/         # global.css with Tailwind import
  content/        # content collections (added M3)
    blog/         # MDX blog posts
    external-projects/  # synced from ideator (added M5)
scripts/          # sync-projects.ts (added M5)
tests/            # vitest specs
public/           # static assets (favicon, photos, _redirects)
```

## Legacy site

The previous Next.js 9 site lives at `/Users/mgg/Developer/mgranados.co/` (read-only input). Source of:

- The four migrated essays (`/qrcode`, `/soccer`, `/whether`, `/feeling`) — see M3.
- About copy (M4).
- The `martin.jpg` photo (M4).

mgg deletes the legacy directory whenever they're satisfied the migration is complete.
