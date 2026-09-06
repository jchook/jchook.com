---
title: "rewait: wait for bootup properly"
date: 2026-07-14 11:30:00
tz: Europe/Berlin
tags: [typescript, cli, docker]
description: "Every docker-compose setup eventually needs to wait for the database. rewait waits for http, tcp, sockets, files, or any custom check."
---

Any networked software project hits a similar obstacle: the app boots faster than the
database, crashes, and someone adds `sleep 5` or `npx wait-on`, etc.

[rewait](https://github.com/jchook/rewait) gives you fine-tuned control over this obstacle, either via simple &amp; familiar TypeScript, or CLI.

```js
import { rewait, http, tcp } from "rewait";

await rewait([
  http("http://localhost:8080/"),
  tcp("localhost", 5432),
], {
  timeout: 30_000,
  interval: 250,
});
```

I wrote this package many years ago for [Hello Privacy](https://helloprivacy.com/) in pure JS, and it really solved a need for us back then. The existing tooling didn't offer enough control or a clean enough API. So I wrote a nice clean functional programming API.

In 2022 I rewrote it in TypeScript for my own use, but never released it.

Now the 2.x is [fully released on npm](https://www.npmjs.com/package/rewait) with 100% test coverage and no funny business with the static type analysis.


