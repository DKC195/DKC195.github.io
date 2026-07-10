import { Suspense } from "react";
import { ExperiencePageClient } from "@/components/experience-page-client";
import { getExperienceEntries, getProjects } from "@/lib/content";

export default function ExperiencePage() {
  const entries = getExperienceEntries();
  const projects = getProjects();

  return (
    <Suspense fallback={null}>
      <ExperiencePageClient entries={entries} projects={projects} />
    </Suspense>
  );
}
