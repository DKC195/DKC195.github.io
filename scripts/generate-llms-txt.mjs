import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const rootDir = process.cwd();
const siteUrl = "https://dhirajkc195.com.np";

const profile = readJson("content/site/profile.json");
const home = matter(readFile("content/pages/home.md"));
const projects = getProjects();
const featuredProjects = projects.filter((project) => project.featured).slice(0, 8);
const publicPath = path.join(rootDir, "public", "llms.txt");

const lines = [
  `# ${profile.name}`,
  "",
  `> ${home.data.summary ?? profile.intro}`,
  "",
  profile.currentStory,
  "",
  "This `llms.txt` file is generated from the portfolio content files during local development and production builds.",
  "Every page also has a Markdown version: append `.md` to the page path (for example `/projects/neptou.md`). The links below point to those Markdown versions.",
  "",
  "## Site",
  "",
  `- [Home](${siteUrl}/index.md): ${profile.intro}`,
  `- [Projects](${siteUrl}/projects.md): Portfolio case studies across engineering, design, research, and leadership work.`,
  `- [Experience](${siteUrl}/experience.md): Full role history with dates, summaries, and related projects.`,
  `- [Recognition](${siteUrl}/recognition.md): Awards and honors, with sources.`,
  `- [Contact](${siteUrl}/contact.md): Contact information and profile links.`,
  "",
  "## Featured Projects",
  "",
  ...featuredProjects.map((project) => (
    `- [${project.title}](${siteUrl}/projects/${project.slug}.md): ${project.summary}`
  )),
  "",
  "## Optional",
  "",
  `- [LinkedIn](${getRealLink(profile.links, "LinkedIn")}): Verified external profile.`,
  `- [Contact](${siteUrl}/contact.md): Contact information and profile links.`
];

fs.writeFileSync(publicPath, `${lines.join("\n")}\n`, "utf8");
process.stdout.write(`Generated public/llms.txt\n`);

function readFile(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readFile(relativePath));
}

function getProjects() {
  const projectDir = path.join(rootDir, "content/projects");

  return fs
    .readdirSync(projectDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const parsed = matter(fs.readFileSync(path.join(projectDir, file), "utf8"));
      return parsed.data;
    })
    // Ongoing work first, then newest year first (matches lib/content.ts).
    .sort((left, right) => (
      Number(right.status === "ongoing") - Number(left.status === "ongoing") ||
      (right.year ?? 0) - (left.year ?? 0)
    ));
}

function getRealLink(links, label) {
  const match = links.find((link) => link.label === label && link.href && !link.href.includes("placeholder"));
  return match?.href ?? `${siteUrl}/contact/`;
}
