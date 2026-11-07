"use client";

import { useAudience } from "@/components/audience-provider";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ProjectReferenceLink } from "@/components/project-detail-client";
import { QueryLink } from "@/components/query-link";
import { formatRecognitionDate } from "@/lib/recognition";
import type { ExperienceEntry, Project, Recognition } from "@/lib/types";

type RecognitionDetailClientProps = {
  item: Recognition;
  relatedProjects: Project[];
  relatedExperience: ExperienceEntry[];
};

export function RecognitionDetailClient({ item, relatedProjects, relatedExperience }: RecognitionDetailClientProps) {
  const { audience } = useAudience();
  const links = item.links ?? [];

  return (
    <main className="panel section project-detail-shell">
      <div className="page-header project-detail-header">
        <div>
          <p className="eyebrow">Recognition · {formatRecognitionDate(item.date)}</p>
          <h1 className="section-title">{item.title} · {item.event}</h1>
          <p className="section-copy">{item.summary}</p>
        </div>
        <div className="chip-row project-detail-audiences">
          {item.audiences.map((audienceSlug) => (
            <span key={audienceSlug} className="chip">{audienceSlug}</span>
          ))}
        </div>
      </div>

      <div className="project-detail-meta-bar">
        <div className="project-detail-kpis">
          <div className="project-kpi">
            <span className="project-kpi-label">Awarded by</span>
            <span className="project-kpi-value">{item.issuer}</span>
          </div>
          <div className="project-kpi">
            <span className="project-kpi-label">Date</span>
            <span className="project-kpi-value">{formatRecognitionDate(item.date)}</span>
          </div>
          <div className="project-kpi">
            <span className="project-kpi-label">Role</span>
            <span className="project-kpi-value">{item.role ?? "—"}</span>
          </div>
        </div>
      </div>

      {item.image ? (
        <section className="project-gallery" aria-label="Recognition image">
          <figure className="project-gallery-item">
            <img src={item.image.src} alt={item.image.alt} loading="eager" decoding="async" />
            {item.image.caption ? <figcaption>{item.image.caption}</figcaption> : null}
          </figure>
        </section>
      ) : null}

      <div className="content-grid project-detail-grid" style={{ marginTop: "1rem" }}>
        <div className="col-7 card project-detail-content">
          <MarkdownRenderer html={item.content} />
        </div>

        <aside className="col-5 grid project-detail-sidebar">
          {relatedProjects.length > 0 ? (
            <article className="card project-detail-card">
              <p className="eyebrow">Project</p>
              <h3 className="project-detail-card-title">The work behind it</h3>
              <div className="project-related-role-list">
                {relatedProjects.map((project) => (
                  <QueryLink key={project.slug} href={`/projects/${project.slug}`} audience={audience} className="project-related-role">
                    <span className="project-related-role-title">{project.title}</span>
                    <span className="project-related-role-org">{project.period ?? project.year}</span>
                  </QueryLink>
                ))}
              </div>
            </article>
          ) : null}

          {links.length > 0 ? (
            <article className="card project-detail-card">
              <p className="eyebrow">Sources</p>
              <h3 className="project-detail-card-title">Program and coverage</h3>
              <div className="project-link-list">
                {links.map((link) => (
                  <ProjectReferenceLink key={`${link.kind}-${link.href}`} link={link} />
                ))}
              </div>
            </article>
          ) : null}

          {relatedExperience.length > 0 ? (
            <article className="card project-detail-card">
              <p className="eyebrow">Related roles</p>
              <h3 className="project-detail-card-title">Work connected to this recognition</h3>
              <div className="project-related-role-list">
                {relatedExperience.map((entry) => (
                  <QueryLink key={entry.id} href="/experience" audience={audience} className="project-related-role">
                    <span className="project-related-role-title">{entry.title}</span>
                    <span className="project-related-role-org">{entry.organization}</span>
                  </QueryLink>
                ))}
              </div>
            </article>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
