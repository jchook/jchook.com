---
title: "shhh: a Rust program that tells me to be quiet"
date: 2026-08-10 22:15:00
tags: [rust, audio, cli]
description: "I talk too loud on calls. shhh watches the mic and yells at me (quietly) when I do."
---

Apparently I get loud on calls when I'm excited. I found this out the way
everyone does — someone told me, months too late. So I wrote
[shhh](https://github.com/jchook/shhh): a small Rust daemon that watches the
microphone level and alerts me when I cross a threshold.

## Measuring loudness

Raw sample amplitude is too twitchy to alert on. shhh computes RMS over a
sliding window instead:

```rust
fn rms(samples: &[f32]) -> f32 {
    let sum_sq: f32 = samples.iter().map(|s| s * s).sum();
    (sum_sq / samples.len() as f32).sqrt()
}
```

…then converts to dBFS so the threshold is in units that mean something:

```rust
let db = 20.0 * rms.max(1e-9).log10();
if db > args.threshold {
    notify("shhh", "you're doing it again");
}
```

Audio capture is [cpal](https://github.com/RustAudio/cpal), which was the
easy part. The fiddly part was debouncing: a single laugh shouldn't fire the
alert, but thirty seconds of escalating enthusiasm should. The rule that
stuck: alert only if the rolling average stays hot for a few seconds, then go
quiet for a cooldown period so it doesn't nag.

## Does it work

Yes, annoyingly well. The notification pops via dunst in the corner of my
xmonad setup, styled like everything else on the desktop. It has genuinely
changed my call behavior, in the way that a graph of your own bad habit
always does.

It's a ~300 line program. Sometimes the fix for a human problem is a very
small robot with one opinion.
