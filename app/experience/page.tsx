import { Suspense } from "react";
import { ExperiencePageClient } from "@/components/experience-page-client";
import { getExperienceEntries, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Experience",
  description:
    "Professional and volunteer experience of Dhiraj KC — roles across engineering, design, research, event production, and technical community work.",
  path: "/experience/"
});

export default function ExperiencePage() {
  const entries = getExperienceEntries();
  const projects = getProjects();

  return (
    <Suspense fallback={null}>
      <ExperiencePageClient entries={entries} projects={projects} />
    </Suspense>
  );
}
