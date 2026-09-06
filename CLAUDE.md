## This project: jchook.com blog

- The AI may never write public-facing original writing by me. It is impossible and not allowed.
impossible and not allowed
- Astro 6 static blog, gruvbox dark-only. Never invent new colors; use the CSS
  variables in `src/styles/global.css`.
- Posts: `src/content/blog/YYYY-MM-DD-slug/index.md[x]`. Scaffold with
  `bun run new "Title" [tags...]`. Frontmatter `date` is naive wall-clock +
  `tz` (default America/New_York); see `src/lib/dates.ts`.
- `bun run build` runs astro build AND the pagefind indexer; search only
  works against a built site (dev mode shows a hint instead).
- MDX only for posts embedding React islands (e.g. Three.js demos in
  `src/components/demos/`); plain .md otherwise.
- Integration majors must match the Astro major (we're on Astro 6):
  @astrojs/mdx 6.x and @astrojs/react 5.x. One major lower breaks dev-mode
  hydration (react-dom/client optimizer error); one higher breaks the dev
  server (vite/rolldown mismatch). Production builds can succeed even when
  dev is broken — test `bun run dev` after touching these deps.
- remark/rehype plugins go through `unified({...})` in astro.config.mjs.
