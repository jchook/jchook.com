---
title: "Hacker News n-gram viewer."
date: 2026-06-30 19:55:00
tags: [rust, data, hn]
description: "An n-gram viewer over the entire Hacker News corpus. Visualize topic trends on HN."
---

Google's Ngram Viewer, but for [Hacker News](https://news.ycombinator.com/) posts and comments.

In true HN style, it's fully open-source at
[jchook/hngram](https://github.com/jchook/hngram). Also hosted at [hngram.com](https://hngram.com/).

It answers questions like "When did everyone stop saying Web 2.0?" or "When did Rust become more talked-about than Python?"

## What is an n-gram?

An n-gram is just a phrase with n words. So, "Harambe" is a 1-gram, "Void Linux" is a 2-gram, and "root of all evil" is a 4-gram.

HNgram supports up to 5-grams.

## Optimizations

It was challenging to work with a dataset of this size. I did a lot of fun optimizations with this project that I'd love to write about, but that will have to be on another day.

> [!NOTE]
> Vote for your favorite phrase comparisons and we will add them to the suggestions.

