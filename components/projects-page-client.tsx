"use client";

import { useSearchParams } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { filterByAudience, getAudienceFromValue } from "@/lib/audience";
import type { Project } from "@/lib/types";

export function ProjectsPageClient({ projects }: { projects: Project[] }) {
  const searchParams = useSearchParams();
  const audience = getAudienceFromValue(searchParams.get("audience"));
  const visibleProjects = filterByAudience(projects, audience);
  const otherProjects = audience === "all"
    ? []
    : projects.filter((project) => !project.audiences.includes(audience));

  return (
    <main className="panel section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h1 className="section-title">Case studies, product work, and technical experiments</h1>
          <p className="section-copy">
            A selection of projects spanning software, design systems, research work, and delivery across real teams and organizations.
          </p>
        </div>
      </div>

      <div className="project-list" style={{ marginTop: "1rem" }}>
        {visibleProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} audience={audience} />
        ))}
      </div>

      {audience !== "all" && otherProjects.length > 0 ? (
        <section style={{ marginTop: "1.5rem" }}>
          <div className="page-header">
            <div>
              <p className="eyebrow">More work</p>
              <h2 className="section-title">Projects in other areas</h2>
              <p className="section-copy">
                Work outside the selected focus area, included for broader context.
              </p>
            </div>
          </div>

          <div className="project-list" style={{ marginTop: "1rem" }}>
            {otherProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} audience={audience} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
