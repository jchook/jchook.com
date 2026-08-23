import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Posts live in src/content/blog/<YYYY-MM-DD-slug>/index.md (or .mdx).
// The date prefix keeps the directory sorted in neovim / ls, but is
// stripped from the URL slug.
const blog = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/blog",
    generateId: ({ entry }) =>
      entry
        .replace(/\/index\.mdx?$/, "")
        .replace(/\.mdx?$/, "")
        .replace(/^\d{4}-\d{2}-\d{2}-/, ""),
  }),
  schema: z.object({
    title: z.string(),
    // Naive wall-clock time; interpreted in `tz`. YAML eagerly parses
    // unquoted timestamps into Date objects (as UTC), so coerce those back
    // to the naive string the author actually typed.
    date: z.preprocess(
      (v) =>
        v instanceof Date
          ? v.toISOString().slice(0, 19).replace("T", " ")
          : v,
      z
        .string()
        .regex(
          /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/,
          "date must be 'YYYY-MM-DD HH:MM[:SS]'",
        ),
    ),
    tz: z.string().default("America/New_York"),
    author: z.string().default("Wes Roberts"),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
