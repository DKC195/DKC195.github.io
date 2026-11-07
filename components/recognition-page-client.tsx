"use client";

import { useAudience } from "@/components/audience-provider";
import { RecognitionCard } from "@/components/recognition-card";
import { filterByAudience } from "@/lib/audience";
import type { Project, Recognition } from "@/lib/types";

type RecognitionPageClientProps = {
  recognition: Recognition[];
  projects: Project[];
};

export function RecognitionPageClient({ recognition, projects }: RecognitionPageClientProps) {
  const { audience } = useAudience();
  const visibleItems = filterByAudience(recognition, audience);
  const otherItems = audience === "all"
    ? []
    : recognition.filter((item) => !item.audiences.includes(audience));

  function renderCards(items: Recognition[]) {
    return items.map((item) => (
      <RecognitionCard
        key={item.slug}
        item={item}
        relatedProjects={projects.filter((project) => item.relatedProjectSlugs?.includes(project.slug))}
        audience={audience}
      />
    ));
  }

  return (
    <main className="panel section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Recognition</p>
          <h1 className="section-title">Awards, honors, and selections</h1>
          <p className="section-copy">
            Recognition for the work and the teams behind it. Each entry links to the project it came from.
          </p>
        </div>
      </div>

      <div className="project-list" style={{ marginTop: "1rem" }}>
        {visibleItems.length > 0 ? renderCards(visibleItems) : (
          <div className="empty-state">No recognition in this focus area yet.</div>
        )}
      </div>

      {audience !== "all" && otherItems.length > 0 ? (
        <section style={{ marginTop: "1.5rem" }}>
          <div className="page-header">
            <div>
              <p className="eyebrow">More recognition</p>
              <h2 className="section-title">Recognition in other areas</h2>
              <p className="section-copy">
                Recognition outside the selected focus area, included for broader context.
              </p>
            </div>
          </div>

          <div className="project-list" style={{ marginTop: "1rem" }}>
            {renderCards(otherItems)}
          </div>
        </section>
      ) : null}
    </main>
  );
}
