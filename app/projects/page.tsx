import { Suspense } from "react";
import { ProjectsPageClient } from "@/components/projects-page-client";
import { getProjects } from "@/lib/content";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <Suspense fallback={null}>
      <ProjectsPageClient projects={projects} />
    </Suspense>
  );
}
