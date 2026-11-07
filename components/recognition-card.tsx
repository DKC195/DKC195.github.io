import { QueryLink } from "@/components/query-link";
import { formatRecognitionDate } from "@/lib/recognition";
import type { AudienceSlug, Project, Recognition } from "@/lib/types";

type RecognitionCardProps = {
  item: Recognition;
  relatedProjects: Project[];
  audience?: AudienceSlug;
};

export function RecognitionCard({ item, relatedProjects, audience }: RecognitionCardProps) {
  return (
    <article className={item.image ? "card project-card project-card-with-image" : "card project-card"}>
      {item.image ? (
        <div className="project-card-media">
          <img src={item.image.src} alt={item.image.alt} loading="lazy" decoding="async" />
        </div>
      ) : null}

      <div className="project-card-body">
        <p className="eyebrow">{formatRecognitionDate(item.date)} · {item.issuer}</p>
        <h3 className="project-card-title">{item.title} · {item.event}</h3>
        <p className="section-copy">{item.summary}</p>

        {item.role ? (
          <div className="stack project-card-tags">
            <span>{item.role}</span>
          </div>
        ) : null}

        <div className="actions-row project-card-actions">
          <QueryLink href={`/recognition/${item.slug}`} audience={audience} className="button">
            View details
          </QueryLink>
          {relatedProjects.map((project) => (
            <QueryLink key={project.slug} href={`/projects/${project.slug}`} audience={audience} className="button-ghost">
              {project.title} project
            </QueryLink>
          ))}
        </div>
      </div>
    </article>
  );
}
