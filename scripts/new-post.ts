/**
 * Scaffold a new post:
 *
 *   bun run new "Post title" [tag1 tag2 ...]
 *
 * Creates src/content/blog/YYYY-MM-DD-slug/index.md stamped with the current
 * time in ET (override with POST_TZ=Asia/Tokyo when posting from elsewhere),
 * then prints the path — pipe it to nvim if you like:
 *
 *   nvim "$(bun run --silent new "Post title")"
 */

const [title, ...tags] = process.argv.slice(2);
if (!title) {
  console.error('usage: bun run new "Post title" [tag1 tag2 ...]');
  process.exit(1);
}

const tz = process.env.POST_TZ ?? "America/New_York";
const parts = Object.fromEntries(
  new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .formatToParts(new Date())
    .map((p) => [p.type, p.value]),
);
const day = `${parts.year}-${parts.month}-${parts.day}`;
const stamp = `${day} ${parts.hour === "24" ? "00" : parts.hour}:${parts.minute}:${parts.second}`;

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const dir = new URL(`../src/content/blog/${day}-${slug}/`, import.meta.url);
const file = new URL("index.md", dir);

if (await Bun.file(file).exists()) {
  console.error(`already exists: ${file.pathname}`);
  process.exit(1);
}

const frontmatter = [
  "---",
  `title: ${JSON.stringify(title)}`,
  `date: ${stamp}`,
  ...(tz !== "America/New_York" ? [`tz: ${tz}`] : []),
  `tags: [${tags.join(", ")}]`,
  "draft: true",
  "---",
  "",
  "",
].join("\n");

await Bun.write(file, frontmatter);
console.log(file.pathname);
