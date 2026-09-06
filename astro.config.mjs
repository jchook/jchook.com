// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeCallouts from "rehype-callouts";

export default defineConfig({
  site: "https://jchook.com",
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "gruvbox-dark-medium",
    },
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        rehypeKatex,
        // GitHub's alert syntax — > [!NOTE] / [!TIP] / [!IMPORTANT] /
        // [!WARNING] / [!CAUTION] — as callouts. No octicons: this site
        // marks structure typographically (the ## before an h2), so the
        // colour and the lowercase eyebrow title do the work instead.
        // Styling lives in src/styles/global.css, keyed on [data-callout].
        [
          rehypeCallouts,
          {
            theme: "github",
            showIndicator: false,
            tags: { nonCollapsibleContainerTagName: "blockquote" },
          },
        ],
      ],
    }),
  },
});
