import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { filterByAudience } from "@/lib/audience";
import type {
  AudienceDefinition,
  AudienceSlug,
  ExperienceEntry,
  ProfileData,
  Project,
  ProjectFrontmatter,
  Recognition,
  RecognitionFrontmatter
} from "@/lib/types";

const rootDir = process.cwd();

function readFile(relativePath: string) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(readFile(relativePath)) as T;
}

export function getAudiences() {
  return readJson<AudienceDefinition[]>("content/site/audiences.json");
}

export function getProfile() {
  return readJson<ProfileData>("content/site/profile.json");
}

export function getHomeContent() {
  const source = readFile("content/pages/home.md");
  const parsed = matter(source);
  return {
    data: parsed.data as {
      title: string;
      summary: string;
      highlights: string[];
    },
    html: marked.parse(parsed.content) as string
  };
}

function projectDir() {
  return path.join(rootDir, "content/projects");
}

export function getProjects(): Project[] {
  return fs
    .readdirSync(projectDir())
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const source = fs.readFileSync(path.join(projectDir(), file), "utf8");
      const parsed = matter(source);
      const frontmatter = parsed.data as ProjectFrontmatter;

      return {
        ...frontmatter,
        content: marked.parse(parsed.content) as string
      };
    })
    .sort(compareProjects);
}

// Ongoing work first, then newest year first.
function compareProjects(left: ProjectFrontmatter, right: ProjectFrontmatter) {
  const ongoing = Number(right.status === "ongoing") - Number(left.status === "ongoing");
  return ongoing || (right.year ?? 0) - (left.year ?? 0);
}

export function getProjectBySlug(slug: string) {
  return getProjects().find((project) => project.slug === slug);
}

export function getFeaturedProjects(audience: AudienceSlug) {
  return filterByAudience(
    getProjects().filter((project) => project.featured),
    audience
  );
}

export function getRecognition(): Recognition[] {
  const recognitionDir = path.join(rootDir, "content/recognition");

  return fs
    .readdirSync(recognitionDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const parsed = matter(fs.readFileSync(path.join(recognitionDir, file), "utf8"));
      // gray-matter parses an unquoted 2026-07 as a string, but normalize in case it becomes a Date.
      const frontmatter = parsed.data as RecognitionFrontmatter;

      return {
        ...frontmatter,
        date: String(frontmatter.date),
        content: marked.parse(parsed.content) as string
      };
    })
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function getRecognitionBySlug(slug: string) {
  return getRecognition().find((item) => item.slug === slug);
}

export function getExperienceEntries() {
  const entries = readJson<ExperienceEntry[]>("content/experience/entries.json");
  return entries.sort((left, right) => {
    const leftEnd = left.end ?? "9999-12";
    const rightEnd = right.end ?? "9999-12";
    if (leftEnd === rightEnd) {
      return right.start.localeCompare(left.start);
    }
    return rightEnd.localeCompare(leftEnd);
  });
}

export function getExperienceHighlights(audience: AudienceSlug) {
  return filterByAudience(
    getExperienceEntries().filter((entry) => entry.featured),
    audience
  );
}

export function getRenderableLinks(category?: "contact" | "social" | "work") {
  const profile = getProfile();
  return profile.links.filter((link) => {
    if (category && link.category !== category) {
      return false;
    }
    return Boolean(link.href && !link.href.includes("placeholder"));
  });
}
