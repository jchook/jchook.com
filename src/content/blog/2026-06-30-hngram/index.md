---
title: "hngram: charting Hacker News obsessions"
date: 2026-06-30 19:55:00
tags: [rust, data, hn]
description: "An n-gram viewer over the entire Hacker News corpus. Watch 'crypto' rise and fall like an empire."
---

Google's Ngram Viewer, but for Hacker News titles.
[hngram](https://github.com/jchook/hngram) ingests the full HN corpus and
charts how often a phrase appears over time. It answers important questions
like *when exactly did everyone stop saying "web 2.0"* (2011, with a long
tail of irony).

## The pipeline

The corpus is ~40M items from the BigQuery public dataset. Rust chews through
it in one pass:

```rust
for title in titles {
    let tokens: Vec<&str> = tokenize(&title);
    for n in 1..=3 {
        for gram in tokens.windows(n) {
            let key = gram.join(" ");
            counts
                .entry((key, bucket_of(item.time)))
                .and_modify(|c| *c += 1)
                .or_insert(1);
        }
    }
}
```

Monthly buckets, counts normalized against total tokens per bucket so a
growing site doesn't make every line go up and to the right.

## Findings, free of charge

- **"rust"** crosses **"haskell"** permanently in 2015 and never looks back.
- **"ai"** has two lives: a small hill in the 2016 deep-learning wave, then a
  cliff face starting late 2022 that makes the first hill invisible at scale.
- **"show hn"** is the most stable bigram in the corpus. Builders gonna
  build, in every market.

The lesson from staring at these curves: HN doesn't discover technologies,
it *synchronizes* on them. The first mention is always years before the
spike. Whatever the next spike is, someone already posted it to two upvotes.
