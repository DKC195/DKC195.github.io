import { QueryLink } from "@/components/query-link";
import type { AudienceSlug, ExperienceEntry, Project } from "@/lib/types";

type ExperienceTimelineProps = {
  entries: ExperienceEntry[];
  projects: Project[];
  audience?: AudienceSlug;
  mode?: "organization" | "role";
};

type ExperienceGroup = {
  organization: string;
  entries: ExperienceEntry[];
  relatedProjects: Project[];
};

export function ExperienceTimeline({
  entries,
  projects,
  audience,
  mode = "organization"
}: ExperienceTimelineProps) {
  if (mode === "role") {
    return (
      <div className="timeline">
        {entries.map((entry) => {
          const relatedProjects = projects.filter((project) => entry.relatedProjectSlugs?.includes(project.slug));

          return (
            <article key={entry.id} className="card timeline-item">
              <div className="page-header">
                <div>
                  <p className="eyebrow">
                    {formatPeriod(entry.start, entry.end)} {entry.location ? `· ${entry.location}` : ""}
                  </p>
                  <h3 style={{ marginBottom: "0.25rem" }}>{entry.title}</h3>
                  <p className="muted" style={{ marginTop: 0 }}>{entry.organization}</p>
                </div>
                <div className="chip-row">
                  {entry.audiences.map((item) => (
                    <span key={item} className="chip">{item}</span>
                  ))}
                </div>
              </div>

              <p className="section-copy">{entry.summary}</p>

              <ul className="markdown experience-highlights">
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>

              {relatedProjects.length > 0 ? (
                <div style={{ marginTop: "1.25rem" }}>
                  <p className="eyebrow">Related projects</p>
                  <div className="chip-row">
                    {relatedProjects.map((project) => (
                      <QueryLink key={project.slug} href={`/projects/${project.slug}`} audience={audience} className="chip">
                        {project.title}
                      </QueryLink>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    );
  }

  const groups = groupExperienceEntries(entries, projects);

  return (
    <div className="timeline">
      {groups.map((group) => (
        <article key={group.organization} className="card experience-group">
          <div className="page-header">
            <div>
              <p className="eyebrow">Organization</p>
              <h2 style={{ marginBottom: "0.25rem" }}>{group.organization}</h2>
              <p className="section-copy">
                {formatGroupPeriod(group.entries)} · {group.entries.length} role{group.entries.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {group.relatedProjects.length > 0 ? (
            <div>
              <p className="eyebrow">Related projects</p>
              <div className="chip-row">
                {group.relatedProjects.map((project) => (
                  <QueryLink key={project.slug} href={`/projects/${project.slug}`} audience={audience} className="chip">
                    {project.title}
                  </QueryLink>
                ))}
              </div>
            </div>
          ) : null}

          <div className="experience-role-list">
            {group.entries.map((entry) => {
              const relatedProjects = projects.filter((project) => entry.relatedProjectSlugs?.includes(project.slug));

              return (
                <section key={entry.id} className="experience-role">
                  <div className="page-header experience-role-header">
                    <div>
                      <p className="eyebrow">
                        {formatPeriod(entry.start, entry.end)} {entry.location ? `· ${entry.location}` : ""}
                      </p>
                      <h3 style={{ marginBottom: "0.25rem" }}>{entry.title}</h3>
                      <p className="section-copy">{entry.summary}</p>
                    </div>
                    <div className="chip-row">
                      {entry.audiences.map((item) => (
                        <span key={item} className="chip">{item}</span>
                      ))}
                    </div>
                  </div>

                  <ul className="markdown experience-highlights">
                    {entry.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>

                  {relatedProjects.length > 0 ? (
                    <div style={{ marginTop: "1.25rem" }}>
                      <p className="eyebrow">Related projects</p>
                      <div className="chip-row">
                        {relatedProjects.map((project) => (
                          <QueryLink key={project.slug} href={`/projects/${project.slug}`} audience={audience} className="chip">
                            {project.title}
                          </QueryLink>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}

function groupExperienceEntries(entries: ExperienceEntry[], projects: Project[]) {
  const groups = new Map<string, ExperienceGroup>();

  for (const entry of entries) {
    const existing = groups.get(entry.organization);
    if (existing) {
      existing.entries.push(entry);
    } else {
      groups.set(entry.organization, {
        organization: entry.organization,
        entries: [entry],
        relatedProjects: []
      });
    }
  }

  return Array.from(groups.values()).map((group) => ({
    ...group,
    entries: [...group.entries].sort(compareExperienceEntries),
    relatedProjects: getGroupRelatedProjects(group.entries, projects)
  }));
}

function getGroupRelatedProjects(entries: ExperienceEntry[], projects: Project[]) {
  const relatedSlugs = new Set(
    entries.flatMap((entry) => entry.relatedProjectSlugs ?? [])
  );

  return projects.filter((project) => relatedSlugs.has(project.slug));
}

function formatGroupPeriod(entries: ExperienceEntry[]) {
  const sorted = [...entries].sort((left, right) => left.start.localeCompare(right.start));
  const earliestStart = sorted[0]?.start;
  const latestEnd = sorted.some((entry) => entry.end === null)
    ? null
    : [...entries]
        .map((entry) => entry.end)
        .filter((value): value is string => value !== null)
        .sort()
        .at(-1) ?? null;

  return formatPeriod(earliestStart, latestEnd);
}

function formatPeriod(start?: string, end?: string | null) {
  if (!start) {
    return "";
  }
  const startLabel = formatMonth(start);
  const endLabel = end ? formatMonth(end) : "Present";
  return `${startLabel} - ${endLabel}`;
}

function formatMonth(value: string) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
}

function compareExperienceEntries(left: ExperienceEntry, right: ExperienceEntry) {
  const leftEnd = left.end ?? "9999-12";
  const rightEnd = right.end ?? "9999-12";
  if (leftEnd === rightEnd) {
    return right.start.localeCompare(left.start);
  }
  return rightEnd.localeCompare(leftEnd);
}
