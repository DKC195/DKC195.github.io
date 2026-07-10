"use client";

import { useSearchParams } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { QueryLink } from "@/components/query-link";
import { getAudienceFromValue } from "@/lib/audience";
import type { ExperienceEntry, Project, ProjectLink } from "@/lib/types";

type ProjectDetailClientProps = {
  project: Project;
  relatedExperience: ExperienceEntry[];
};

export function ProjectDetailClient({ project, relatedExperience }: ProjectDetailClientProps) {
  const searchParams = useSearchParams();
  const audience = getAudienceFromValue(searchParams.get("audience"));
  const availableLinks = (project.links ?? []).map((link) => ({
    ...link,
    primary: link.kind === "live" || link.kind === "demo"
  }));
  const primaryLinks = availableLinks.filter((link) => link.primary);

  return (
    <main className="panel section project-detail-shell">
      <div className="page-header project-detail-header">
        <div>
          <p className="eyebrow">Case study · {project.period ?? project.year}</p>
          <h1 className="section-title">{project.title}</h1>
          <p className="section-copy">{project.summary}</p>
        </div>
        <div className="chip-row project-detail-audiences">
          {(project.audiences ?? []).map((item) => (
            <span key={item} className="chip">{item}</span>
          ))}
        </div>
      </div>

      <div className="project-detail-meta-bar">
        <div className="project-detail-kpis">
          <div className="project-kpi">
            <span className="project-kpi-label">Status</span>
            <span className="project-kpi-value">{project.status ?? "Completed"}</span>
          </div>
          <div className="project-kpi">
            <span className="project-kpi-label">Focus</span>
            <span className="project-kpi-value">{(project.audiences ?? []).join(" / ")}</span>
          </div>
          <div className="project-kpi">
            <span className="project-kpi-label">Related roles</span>
            <span className="project-kpi-value">{relatedExperience.length}</span>
          </div>
        </div>
        {primaryLinks.length > 0 ? (
          <div className="actions-row project-detail-actions">
            {primaryLinks.map((link) => (
              <a
                key={`${link.kind}-${link.href}`}
                href={link.href}
                className="button"
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <div className="content-grid project-detail-grid" style={{ marginTop: "1rem" }}>
        <div className="col-7 card project-detail-content">
          <MarkdownRenderer html={project.content} />
        </div>

        <aside className="col-5 grid project-detail-sidebar">
          <article className="card project-detail-card">
            <p className="eyebrow">Stack and tools</p>
            <h3 className="project-detail-card-title">Technology footprint</h3>
            <div className="stack project-detail-tag-stack">
              {(project.tags ?? []).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>

          <article className="card project-detail-card">
            <p className="eyebrow">Project snapshot</p>
            <div className="project-detail-list">
              <div className="project-detail-list-row">
                <span className="project-detail-list-label">Period</span>
                <span className="project-detail-list-value">{project.period ?? project.year}</span>
              </div>
              <div className="project-detail-list-row">
                <span className="project-detail-list-label">Status</span>
                <span className="project-detail-list-value">{project.status ?? "Completed"}</span>
              </div>
              <div className="project-detail-list-row">
                <span className="project-detail-list-label">Audience</span>
                <span className="project-detail-list-value">{(project.audiences ?? []).join(", ")}</span>
              </div>
            </div>
          </article>

          {availableLinks.length > 0 ? (
            <article className="card project-detail-card">
              <p className="eyebrow">Project links</p>
              <h3 className="project-detail-card-title">References and outputs</h3>
              <div className="project-link-list">
                {availableLinks.map((link) => (
                  <ProjectReferenceLink key={`${link.kind}-${link.href}`} link={link} />
                ))}
              </div>
            </article>
          ) : null}

          <article className="card project-detail-card">
            <p className="eyebrow">Related roles</p>
            <h3 className="project-detail-card-title">Work connected to this project</h3>
            {relatedExperience.length > 0 ? (
              <div className="project-related-role-list">
                {relatedExperience.map((entry) => (
                  <QueryLink key={entry.id} href="/experience" audience={audience} className="project-related-role">
                    <span className="project-related-role-title">{entry.title}</span>
                    <span className="project-related-role-org">{entry.organization}</span>
                  </QueryLink>
                ))}
              </div>
            ) : (
              <div className="empty-state">Related roles will appear here when there is a direct connection to this project.</div>
            )}
          </article>
        </aside>
      </div>
    </main>
  );
}

function ProjectReferenceLink({ link }: { link: ProjectLink & { primary: boolean } }) {
  return (
    <a href={link.href} className="project-reference-link" target="_blank" rel="noreferrer">
      <span className="project-reference-link-row">
        <span className="project-reference-link-label">{link.label}</span>
        <span className="project-reference-link-kind">{formatLinkKind(link.kind)}</span>
      </span>
      {link.note ? <span className="project-reference-link-note">{link.note}</span> : null}
    </a>
  );
}

function formatLinkKind(kind: ProjectLink["kind"]) {
  switch (kind) {
    case "official":
      return "Official";
    case "reference":
      return "Reference";
    case "live":
      return "Live";
    case "github":
      return "GitHub";
    case "demo":
      return "Demo";
    case "document":
      return "Document";
    default:
      return kind;
  }
}
