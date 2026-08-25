// MDX embeds React islands with Astro's client:* directives. mdx-analyzer
// typechecks MDX against React's JSX types, which don't know these props —
// augment them in so `<Demo client:visible />` passes checkMdx.
import "react";

declare module "react" {
  interface Attributes {
    "client:load"?: boolean;
    "client:idle"?: boolean | { timeout?: number };
    "client:visible"?: boolean | { rootMargin?: string };
    "client:media"?: string;
    "client:only"?: string;
  }
}
