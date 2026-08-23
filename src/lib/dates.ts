/**
 * Posts store a naive wall-clock datetime ("2026-08-23 16:37:00") plus an
 * IANA timezone. These helpers convert that pair into a real instant (for
 * sorting / RSS) and a display string with the short zone name ("ET" style).
 */

function tzOffsetMs(instant: Date, tz: string): number {
  // What wall-clock time does `instant` render as in `tz`?
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(instant).map((p) => [p.type, p.value]),
  );
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  return asUtc - instant.getTime();
}

/** Parse a naive "YYYY-MM-DD HH:MM[:SS]" string in an IANA tz to an instant. */
export function toInstant(naive: string, tz: string): Date {
  const m = naive.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) throw new Error(`Bad date: ${naive}`);
  const [, y, mo, d, h, mi, s] = m;
  const utcGuess = Date.UTC(+y!, +mo! - 1, +d!, +h!, +mi!, +(s ?? 0));
  // Two-pass correction handles DST edges well enough for blog posts.
  let instant = new Date(utcGuess - tzOffsetMs(new Date(utcGuess), tz));
  instant = new Date(utcGuess - tzOffsetMs(instant, tz));
  return instant;
}

/** Short zone label for display: "EDT" -> "ET", "GMT+7" stays as-is. */
export function zoneLabel(naive: string, tz: string): string {
  const instant = toInstant(naive, tz);
  const name =
    new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" })
      .formatToParts(instant)
      .find((p) => p.type === "timeZoneName")?.value ?? tz;
  // Collapse EST/EDT -> ET, PST/PDT -> PT, etc.
  const m = name.match(/^([A-Z])[SD]T$/);
  return m ? `${m[1]}T` : name;
}

/** "2026-08-23 16:37 ET" — the canonical meta-line format. */
export function formatPostDate(naive: string, tz: string): string {
  return `${naive.slice(0, 16)} ${zoneLabel(naive, tz)}`;
}

/** "2026-08-23" for compact lists. */
export function formatPostDay(naive: string): string {
  return naive.slice(0, 10);
}
