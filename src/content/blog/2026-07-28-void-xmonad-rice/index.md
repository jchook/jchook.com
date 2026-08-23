---
title: "Anatomy of the rice: Void + xmonad + gruvbox"
date: 2026-07-28 14:05:00
tags: [void, xmonad, rice, haskell, linux]
description: "The parts list for my desktop: Void Linux, xmonad, kitty, polybar, and one palette to rule them all."
---

Every screenshot thread eventually asks for the parts list, so here it is.
The theme of the build: **one palette, everywhere**. If a pixel is on my
screen, it's one of the sixteen colors in my `kitty.conf`.

## Base

- **Void Linux** — runit instead of systemd, `xbps` is fast, and the base
  install is genuinely minimal. My kind of distro: it does nothing until
  asked.
- **xmonad** — a window manager in ~30 lines of my own Haskell config, which
  is exactly as much window manager as I need.
- **kitty** with Inconsolata, 6px padding so text doesn't kiss the borders.

## The config that matters

Most of my `xmonad.hs` is stock. The part that isn't:

```haskell
myLayout = smartBorders $ spacingRaw True
    (Border 8 8 8 8) True (Border 8 8 8 8) True
    $ Tall 1 (3/100) (1/2) ||| Full

main = xmonad $ def
    { terminal    = "kitty"
    , modMask     = mod4Mask
    , borderWidth = 2
    , normalBorderColor  = "#3a3a3a"
    , focusedBorderColor = "#ffaf00"
    }
```

Yellow focused border, gray unfocused. Two layouts. That's the whole
ideology: the window manager should be a solved problem you stop thinking
about.

## Consistency is the aesthetic

The actual trick to a rice that photographs well isn't any single component —
it's that kitty, polybar, dunst, rofi, and the GTK theme all read from the
same sixteen hex values. When a notification pops over a terminal over the
wallpaper, nothing clashes, because nothing *can* clash.

> Rice tip: pick the palette first, then make every tool conform to it.
> Never theme a tool in isolation.

This site runs on the same rule. The CSS palette is literally copied out of
`kitty.conf` — the browser is just another window on the desktop.
