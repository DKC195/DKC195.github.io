import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const args = parseArgs(process.argv.slice(2));

const title = args.title?.trim();
const slug = (args.slug?.trim() || slugify(title || "")).trim();

if (!title) {
  fail("Missing required --title argument.");
}

if (!slug) {
  fail("Could not derive a slug. Pass --slug explicitly.");
}

const year = args.year?.trim() || String(new Date().getFullYear());
const summary = args.summary?.trim() || "Add a concise one-line summary.";
const period = args.period?.trim() || year;
const status = args.status?.trim() || "completed";
const audiences = parseList(args.audiences) || ["leadership"];
const tags = parseList(args.tags) || ["Add Tag"];
const relatedExperienceIds = parseList(args.relatedExperienceIds);
const featured = args.featured === "true";

const markdownPath = path.join(rootDir, "content/projects", `${slug}.md`);
const imageDir = path.join(rootDir, "public/content/projects", slug, "images");
const gitkeepPath = path.join(imageDir, ".gitkeep");

if (fs.existsSync(markdownPath)) {
  fail(`Project file already exists: content/projects/${slug}.md`);
}

fs.mkdirSync(path.dirname(markdownPath), { recursive: true });
fs.mkdirSync(imageDir, { recursive: true });

const frontmatter = [
  "---",
  `title: ${title}`,
  `slug: ${slug}`,
  `summary: ${summary}`,
  `audiences: [${audiences.join(", ")}]`,
  `tags: [${tags.join(", ")}]`,
  `status: ${status}`,
  `featured: ${featured ? "true" : "false"}`,
  `year: ${Number(year) || new Date().getFullYear()}`,
  `period: ${period}`,
  relatedExperienceIds.length
    ? ["relatedExperienceIds:", ...relatedExperienceIds.map((id) => `  - ${id}`)].join("\n")
    : "relatedExperienceIds: []",
  "sections:",
  "  - overview",
  "  - role",
  "  - outcomes",
  "links: []",
  "gallery:",
  `  - src: /content/projects/${slug}/images/01-cover.webp`,
  "    alt: Add a factual cover image description.",
  "    caption: Optional visible caption.",
  "archiveContext: |",
  "  Add long-form source notes here if needed.",
  "---",
  "",
  "## Overview",
  "",
  "Add project context here.",
  "",
  "## Role",
  "",
  "- Add your responsibilities.",
  "",
  "## Outcomes",
  "",
  "Add results, impact, or what this project demonstrates.",
  ""
].join("\n");

fs.writeFileSync(markdownPath, frontmatter, "utf8");

if (!fs.existsSync(gitkeepPath)) {
  fs.writeFileSync(gitkeepPath, "", "utf8");
}

process.stdout.write(
  [
    `Created content/projects/${slug}.md`,
    `Created public/content/projects/${slug}/images/.gitkeep`
  ].join("\n")
);

function parseArgs(values) {
  const parsed = {};

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];

    if (!value.startsWith("--")) {
      continue;
    }

    const key = value.slice(2);
    const nextValue = values[index + 1];

    if (!nextValue || nextValue.startsWith("--")) {
      parsed[key] = "true";
      continue;
    }

    parsed[key] = nextValue;
    index += 1;
  }

  return parsed;
}

function parseList(value) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
