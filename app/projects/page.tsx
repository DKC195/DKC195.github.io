import { ProjectsPageClient } from "@/components/projects-page-client";
import { getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Case studies, product work, and technical experiments by Dhiraj KC across engineering, design, research, and leadership.",
  path: "/projects/"
});

export default function ProjectsPage() {
  const projects = getProjects();

  return <ProjectsPageClient projects={projects} />;
}
