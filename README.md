# jchook.com

Personal blog. Gruvbox, dark-only, static Astro — themed after my terminal:
the palette is copied from `kitty.conf` and the footer is the
hydrogen-remixed-gruvbox wallpaper (the Balmer series).

## Stack

- [Astro 6](https://astro.build) static output, content collections
- React islands (search modal, Three.js demos via @react-three/fiber)
- Shiki `gruvbox-dark-medium` for code fences
- KaTeX via remark-math + rehype-katex (`$...$` / `$$...$$` in any post)
- [Pagefind](https://pagefind.app) for local, instant search (`/` or ctrl-k)
- Inconsolata (variable) — same font as the terminal

## Commands

```sh
bun install          # deps
bun run dev          # dev server (search index unavailable in dev)
bun run build        # static build into dist/ + pagefind index
bun run preview      # serve dist/
bun run new "Title" [tags...]   # scaffold a post, prints the file path
```

## Posting

```sh
nvim "$(bun run --silent new "My post" rust cli)"
```

Posts live in `src/content/blog/YYYY-MM-DD-slug/index.md` (`.mdx` when
embedding components). Paste images right next to `index.md` and reference
them relatively — Astro optimizes them at build time. Delete `draft: true`
to publish.

Frontmatter:

```yaml
title: "My post"
date: 2026-08-23 17:05:53   # wall-clock time where you are
tz: Asia/Tokyo              # optional; defaults to America/New_York
tags: [rust, cli]
description: "Optional, used for meta/RSS."
draft: true                 # optional
```

Posting from elsewhere in the world: `POST_TZ=Asia/Tokyo bun run new "..."`
stamps the post in that zone.

Homepage always shows the latest post in full. Tags are auto-colored from
the gruvbox palette (`src/lib/tags.ts` pins the common ones).
