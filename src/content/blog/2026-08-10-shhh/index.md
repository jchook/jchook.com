---
title: "shhh: don't be so loud"
date: 2026-08-10 22:15:00
tags: [rust, audio, cli]
description: "shhh watches the mic and shushes me when I get too loud."
---

Sometimes you are living with other people, who are not night owls, and you have your headphones on, and you don't realize how loud you are.

So I wrote [shhh](https://github.com/jchook/shhh): a small Rust daemon that watches the
microphone level and literally says *SHHH!* when I am too loud.

## Measuring loudness

This part was very interesting.

Decibels are a logarithmic unit. The reason why is that your ears hear this
way. Six decibel louder is literally 2x the amplitude. So 16 dB is *physically*
twice as big a sound wave as 10 dB, but your body "does the math" and your
ear-brain system has a very strongly non-linear perception of loudness, close
to logarithmic.

"Being loud" is harder to define and capture than most would think. Mics hear
something different from you (e.g. bumping the table can be existential for the
mic, but quiet to you). Raw samples are wayyyy too spiky to alert on. You get a
constant shush.

`shhh` computes RMS over a sliding window instead:

```rust
fn rms(samples: &[f32]) -> f32 {
    let sum_sq: f32 = samples.iter().map(|s| s * s).sum();
    (sum_sq / samples.len() as f32).sqrt()
}
```

then converts to dBFS so the threshold is in familiar units:

```rust
let db = 20.0 * rms.max(1e-9).log10();
if db > args.threshold {
    notify("shhh", "you're doing it again");
}
```

