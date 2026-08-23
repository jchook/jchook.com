---
title: "Jumping around ranger with zoxide"
date: 2026-08-19 09:42:00
tags: [python, cli, ranger, linux]
description: "ranger-zoxide lets you fuzzy-jump to any directory you've ever visited, from inside ranger. How it works and why it exists."
---

I live in [ranger](https://github.com/ranger/ranger). I also live in
[zoxide](https://github.com/ajeetdsouza/zoxide), which remembers every
directory I visit and ranks them by "frecency". The two had no idea about each
other, so I wrote [ranger-zoxide](https://github.com/jchook/ranger-zoxide) to
introduce them.

Usage is what you'd hope:

```
:z proj astro
```

…and ranger is now sitting in `~/projects/jchook.com/astro`, because that's
the highest-ranked match. No path typing, no tab-dance through five levels of
directories.

## The whole trick

ranger plugins are just Python classes. The core of it is embarrassingly
small — shell out to zoxide, `cd` to whatever it says:

```python
class z(Command):
    def execute(self):
        results = subprocess.check_output(
            ["zoxide", "query", *self.args[1:]],
            text=True,
        ).splitlines()
        if results:
            self.fm.cd(results[0])
```

The real plugin also feeds ranger's own navigation *back into* zoxide, so
directories you browse to by hand still climb the ranking. That closes the
loop: browse normally for a week, and after that `:z` almost always guesses
right on the first try.

## Install

```sh
git clone https://github.com/jchook/ranger-zoxide.git \
  ~/.config/ranger/plugins/zoxide
```

That's it. ranger auto-loads anything in `plugins/`.

Somehow this little glue script became my most-starred repo. The lesson
generalizes: the best tools to write are the ten-line ones sitting between two
great tools that haven't met yet.
