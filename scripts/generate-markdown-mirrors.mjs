import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Publishes a Markdown copy of each content page next to its HTML route, so
// `/projects/neptou/` is also readable at `/projects/neptou.md`. Output goes to
// `public/` (gitignored) and ships in the static export.

const rootDir = process.cwd();
const siteUrl = "https://dhirajkc195.com.np";
const publicDir = path.join(rootDir, "public");

const profile = readJson("content/site/profile.json");
const home = matter(readFile("content/pages/home.md"));
const projects = getProjects();
const experience = getExperience();
const recognition = getRecognition();
const realLinks = profile.links.filter((link) => link.href && !link.href.includes("placeholder"));

const files = {
  "index.md": renderHome(),
  "projects.md": renderProjects(),
  "experience.md": renderExperience(),
  "recognition.md": renderRecognition(),
  "contact.md": renderContact(),
  ...Object.fromEntries(projects.map((project) => [`projects/${project.data.slug}.md`, renderProject(project)])),
  ...Object.fromEntries(recognition.map((item) => [`recognition/${item.data.slug}.md`, renderRecognitionItem(item)]))
};

// Clear previous per-item mirrors so renamed or deleted entries don't linger.
fs.rmSync(path.join(publicDir, "projects"), { recursive: true, force: true });
fs.rmSync(path.join(publicDir, "recognition"), { recursive: true, force: true });

for (const [relativePath, content] of Object.entries(files)) {
  const target = path.join(publicDir, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${content.trim()}\n`, "utf8");
}

process.stdout.write(`Generated ${Object.keys(files).length} markdown mirrors in public/\n`);

function renderHome() {
  return [
    `# ${profile.name}`,
    "",
    `> ${home.data.summary ?? profile.intro}`,
    "",
    `**Role:** ${profile.role}  `,
    `**Location:** ${profile.location}`,
    "",
    `## ${home.data.title}`,
    "",
    home.content.trim(),
    "",
    "## Current focus",
    "",
    profile.currentStory,
    "",
    "## Featured projects",
    "",
    ...projects
      .filter((project) => project.data.featured)
      .map((project) => `- [${project.data.title}](${siteUrl}/projects/${project.data.slug}.md): ${project.data.summary}`),
    "",
    "## More",
    "",
    `- [All projects](${siteUrl}/projects.md)`,
    `- [Experience](${siteUrl}/experience.md)`,
    `- [Recognition](${siteUrl}/recognition.md)`,
    `- [Contact](${siteUrl}/contact.md)`,
    "",
    sourceLine("/")
  ].join("\n");
}

function renderProjects() {
  return [
    `# Projects — ${profile.name}`,
    "",
    "Case studies across engineering, design, research, and leadership work.",
    "",
    ...projects.map((project) => [
      `## [${project.data.title}](${siteUrl}/projects/${project.data.slug}.md)`,
      "",
      metaLine(project.data),
      "",
      project.data.summary,
      ""
    ].join("\n")),
    sourceLine("/projects/")
  ].join("\n");
}

function renderProject({ data, content }) {
  const links = data.links ?? [];
  const related = experience.filter((entry) => data.relatedExperienceIds?.includes(entry.id));
  const honors = recognition.filter((item) => item.data.relatedProjectSlugs?.includes(data.slug));

  return [
    `# ${data.title}`,
    "",
    `> ${data.summary}`,
    "",
    metaLine(data),
    "",
    content.trim(),
    "",
    ...(links.length
      ? [
          "## Links",
          "",
          ...links.map((link) => `- [${link.label}](${link.href})${link.note ? `: ${link.note}` : ""}`),
          ""
        ]
      : []),
    ...(honors.length
      ? [
          "## Recognition",
          "",
          ...honors.map((item) => `- [${item.data.title}, ${item.data.event}](${siteUrl}/recognition/${item.data.slug}.md) (${formatMonth(item.data.date)}, ${item.data.issuer})`),
          ""
        ]
      : []),
    ...(related.length
      ? [
          "## Related experience",
          "",
          ...related.map((entry) => `- ${entry.title}, ${entry.organization} (${formatRange(entry)})`),
          ""
        ]
      : []),
    sourceLine(`/projects/${data.slug}/`)
  ].join("\n");
}

function renderExperience() {
  return [
    `# Experience — ${profile.name}`,
    "",
    ...experience.map((entry) => [
      `## ${entry.title}, ${entry.organization}`,
      "",
      `${formatRange(entry)}${entry.location ? ` · ${entry.location}` : ""} · ${entry.kind}`,
      "",
      entry.summary,
      "",
      ...entry.highlights.map((highlight) => `- ${highlight}`),
      ...(entry.relatedProjectSlugs?.length
        ? [
            "",
            `Related projects: ${entry.relatedProjectSlugs
              .map((slug) => projects.find((project) => project.data.slug === slug))
              .filter(Boolean)
              .map((project) => `[${project.data.title}](${siteUrl}/projects/${project.data.slug}.md)`)
              .join(", ")}`
          ]
        : []),
      ""
    ].join("\n")),
    sourceLine("/experience/")
  ].join("\n");
}

function renderRecognition() {
  return [
    `# Recognition — ${profile.name}`,
    "",
    "Awards, honors, and selections. Each entry links to the project it came from.",
    "",
    ...recognition.map(({ data }) => [
      `## [${data.title} · ${data.event}](${siteUrl}/recognition/${data.slug}.md)`,
      "",
      [formatMonth(data.date), data.issuer, data.role].filter(Boolean).join(" · "),
      "",
      data.summary,
      ""
    ].join("\n")),
    sourceLine("/recognition/")
  ].join("\n");
}

function renderRecognitionItem({ data, content }) {
  const relatedProjects = projects.filter((project) => data.relatedProjectSlugs?.includes(project.data.slug));

  return [
    `# ${data.title} · ${data.event}`,
    "",
    `> ${data.summary}`,
    "",
    [formatMonth(data.date), data.issuer, data.role].filter(Boolean).join(" · "),
    "",
    content.trim(),
    "",
    ...(relatedProjects.length
      ? [
          "## Project",
          "",
          ...relatedProjects.map((project) => `- [${project.data.title}](${siteUrl}/projects/${project.data.slug}.md)`),
          ""
        ]
      : []),
    ...(data.links?.length
      ? [
          "## Sources",
          "",
          ...data.links.map((link) => `- [${link.label}](${link.href})${link.note ? `: ${link.note}` : ""}`),
          ""
        ]
      : []),
    sourceLine(`/recognition/${data.slug}/`)
  ].join("\n");
}

function renderContact() {
  return [
    `# Contact — ${profile.name}`,
    "",
    `- Email: [${profile.email}](mailto:${profile.email})`,
    ...realLinks
      .filter((link) => !link.href.startsWith("mailto:"))
      .map((link) => `- ${link.label}: [${link.href}](${link.href})`),
    `- Location: ${profile.location}`,
    "",
    sourceLine("/contact/")
  ].join("\n");
}

function metaLine(data) {
  return [
    data.period ?? data.year,
    data.status,
    data.tags?.length ? data.tags.join(", ") : null
  ]
    .filter(Boolean)
    .join(" · ");
}

function sourceLine(routePath) {
  return `---\n\nHTML version: ${siteUrl}${routePath}`;
}

function formatRange(entry) {
  return `${formatMonth(entry.start)} – ${entry.end ? formatMonth(entry.end) : "Present"}`;
}

function formatMonth(value) {
  const [year, month] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1)).toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readFile(relativePath));
}

function getProjects() {
  const projectDir = path.join(rootDir, "content/projects");

  // archiveContext and other frontmatter stay out of the mirror on purpose.
  return fs
    .readdirSync(projectDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => matter(fs.readFileSync(path.join(projectDir, file), "utf8")))
    // Ongoing work first, then newest year first (matches lib/content.ts).
    .sort((left, right) => (
      Number(right.data.status === "ongoing") - Number(left.data.status === "ongoing") ||
      (right.data.year ?? 0) - (left.data.year ?? 0)
    ));
}

function getRecognition() {
  const recognitionDir = path.join(rootDir, "content/recognition");

  return fs
    .readdirSync(recognitionDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => matter(fs.readFileSync(path.join(recognitionDir, file), "utf8")))
    .map((item) => ({ ...item, data: { ...item.data, date: String(item.data.date) } }))
    .sort((left, right) => right.data.date.localeCompare(left.data.date));
}

function getExperience() {
  return readJson("content/experience/entries.json").sort((left, right) => {
    const leftEnd = left.end ?? "9999-12";
    const rightEnd = right.end ?? "9999-12";
    if (leftEnd === rightEnd) {
      return right.start.localeCompare(left.start);
    }
    return rightEnd.localeCompare(leftEnd);
  });
}
