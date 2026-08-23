---
title: "rewait: wait for things properly"
date: 2026-07-14 11:30:00
tz: Europe/Berlin
tags: [javascript, cli, docker]
description: "Every docker-compose setup eventually needs to wait for postgres. rewait waits for http, tcp, sockets, files, or any custom check."
---

Written from a café in Berlin, which is why this post is stamped CEST — the
blog supports per-post timezones because I refuse to lie about when things
happened.

Every containerized project hits the same wall: the app boots faster than the
database, crashes, and someone adds `sleep 5` to the entrypoint. Then `sleep
10`. [rewait](https://github.com/jchook/rewait) is the grown-up version:

```js
import { rewait, http, tcp } from "rewait";

await rewait([
  http("http://localhost:8080/healthz"),
  tcp("localhost", 5432),
], {
  timeout: 30_000,
  interval: 250,
});
```

It resolves when everything is up, or throws when the timeout hits. Checks
run in parallel, retry on an interval, and you can hand it any async function
as a custom check:

```js
const migrated = async () => {
  const { rows } = await db.query("select 1 from schema_migrations limit 1");
  if (!rows.length) throw new Error("not migrated yet");
};

await rewait([tcp("localhost", 5432), migrated]);
```

The design rule I kept: **checks are just functions that throw**. No plugin
API, no config schema, no DSL. The built-ins (`http`, `tcp`, `socket`,
`file`) are conveniences that return such functions.

`sleep 5` will outlive us all. But my containers boot in the right order.
