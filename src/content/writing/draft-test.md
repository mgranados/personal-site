---
title: Draft test post
date: 2026-05-24
summary: This post is marked draft and must never appear in a production build. The draft-exclusion test asserts dist/draft-test/index.html does not exist after pnpm build.
tags: [test, draft]
draft: true
---

This post exists only to verify that `draft: true` excludes posts from the production build.

If you can see this rendered at `/draft-test` in production, the draft filter is broken — investigate `src/pages/[slug].astro` and the `getStaticPaths` filter.
