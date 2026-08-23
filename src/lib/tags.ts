/**
 * Every tag gets a stable gruvbox accent. Common tags are pinned so the
 * mapping reads intentionally; anything else hashes into the palette.
 */

export interface TagColor {
  name: string;
  hex: string;
}

export const ACCENTS: TagColor[] = [
  { name: "red", hex: "#d75f5f" },
  { name: "orange", hex: "#ff8700" },
  { name: "yellow", hex: "#ffaf00" },
  { name: "green", hex: "#afaf00" },
  { name: "aqua", hex: "#85ad85" },
  { name: "blue", hex: "#83adad" },
  { name: "magenta", hex: "#d485ad" },
];

const PINNED: Record<string, string> = {
  rust: "#ff8700",
  linux: "#ffaf00",
  void: "#afaf00",
  xmonad: "#83adad",
  rice: "#d485ad",
  physics: "#83adad",
  math: "#85ad85",
  python: "#83adad",
  javascript: "#ffaf00",
  haskell: "#d485ad",
  cli: "#afaf00",
  neovim: "#afaf00",
};

function djb2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

export function tagColor(tag: string): string {
  const key = tag.toLowerCase();
  return PINNED[key] ?? ACCENTS[djb2(key) % ACCENTS.length]!.hex;
}
