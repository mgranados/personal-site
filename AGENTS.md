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

1. **Ideator publishing is two-gated and never automatic.** A project from `mgranados/ideator` may only appear on this site when BOTH conditions hold: (a) its frontmatter has `public: true`, AND (b) mgg has explicitly approved the listing in this repo (via the hand-curated content collection / allowlist). The published text is human-curated per project — the site does NOT render raw ideator markdown or frontmatter verbatim. The M5 sync script is a draft-prep tool; it never writes directly to anything the build renders. (See `~/.claude/projects/-Users-mgg-Developer-mgranados-co/memory/feedback_ideator_publishing_requires_human_approval.md`.)
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
  pages/          # Astro routes (index, writing, [slug], about, rss.xml.ts)
  layouts/        # Layout.astro
  styles/         # global.css (hand-rolled, no framework)
  content/        # content collections
    writing/      # MD/MDX essays (added M3)
    projects/     # hand-curated projects (deferred past v1; see hard rule #1)
  content.config.ts  # collection schemas
scripts/          # sync-projects.ts (deferred past v1 with M5)
tests/            # vitest specs (draft exclusion, SEO assets, smoke)
public/           # static assets (favicon, martin.jpg, fonts/, robots.txt)
functions/        # Cloudflare Pages Functions (added M6)
  _hit.gif.ts     # analytics pixel — logs pageviews to CF dashboard
```

## Legacy site

The previous Next.js 9 site lives at `/Users/mgg/Developer/mgranados.co/` (read-only input). Source of:

- The four migrated essays (`/qrcode`, `/soccer`, `/whether`, `/feeling`) — see M3.
- About copy (M4).
- The `martin.jpg` photo (M4).

mgg deletes the legacy directory whenever they're satisfied the migration is complete.
