import { QueryLink } from "@/components/query-link";
import type { AudienceSlug, Project, ProjectLink } from "@/lib/types";

export function ProjectCard({ project, audience }: { project: Project; audience?: AudienceSlug }) {
  const prioritizedLinks = (project.links ?? [])
    .slice()
    .sort((left, right) => getProjectCardLinkPriority(left.kind) - getProjectCardLinkPriority(right.kind))
    .slice(0, 2);
  const coverImage = project.gallery?.[0];

  return (
    <article className={coverImage ? "card project-card project-card-with-image" : "card project-card"}>
      {coverImage ? (
        <div className="project-card-media">
          <img src={coverImage.src} alt={coverImage.alt} loading="lazy" decoding="async" />
        </div>
      ) : null}

      <div className="project-card-body">
        <p className="eyebrow">{project.period ?? project.year}</p>
        <h3 className="project-card-title">{project.title}</h3>
        <p className="section-copy">{project.summary}</p>

        <div className="stack project-card-tags">
          {(project.tags ?? []).slice(0, 5).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="actions-row project-card-actions">
          <QueryLink href={`/projects/${project.slug}`} audience={audience} className="button">
            View case study
          </QueryLink>
          {prioritizedLinks.map((link) => (
            <a key={`${link.kind}-${link.href}`} href={link.href} className="button-ghost" target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function getProjectCardLinkPriority(kind: ProjectLink["kind"]) {
  switch (kind) {
    case "live":
      return 1;
    case "demo":
      return 2;
    case "official":
      return 3;
    case "github":
      return 4;
    case "document":
      return 5;
    case "reference":
      return 6;
    default:
      return 99;
  }
}
