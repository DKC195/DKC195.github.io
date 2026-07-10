"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { filterByAudience, getAudienceFromValue } from "@/lib/audience";
import type { ExperienceEntry, Project } from "@/lib/types";

type ExperiencePageClientProps = {
  entries: ExperienceEntry[];
  projects: Project[];
};

export function ExperiencePageClient({ entries, projects }: ExperiencePageClientProps) {
  const searchParams = useSearchParams();
  const audience = getAudienceFromValue(searchParams.get("audience"));
  const visibleEntries = filterByAudience(entries, audience);
  const otherEntries = audience === "all"
    ? []
    : entries.filter((entry) => !entry.audiences.includes(audience));
  const [viewMode, setViewMode] = useState<"organization" | "role">("organization");

  return (
    <main className="panel section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Experience</p>
          <h1 className="section-title">Work history across roles, operational responsibility, and technical delivery</h1>
          <p className="section-copy">
            A view of roles across student leadership, nonprofit operations, design work, and technical delivery.
          </p>
        </div>
        <div className="view-toggle" aria-label="Experience view mode">
          <button
            type="button"
            className="view-toggle-option"
            data-active={viewMode === "organization"}
            onClick={() => setViewMode("organization")}
          >
            By organization
          </button>
          <button
            type="button"
            className="view-toggle-option"
            data-active={viewMode === "role"}
            onClick={() => setViewMode("role")}
          >
            By role
          </button>
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <ExperienceTimeline entries={visibleEntries} projects={projects} audience={audience} mode={viewMode} />
      </div>

      {audience !== "all" && otherEntries.length > 0 ? (
        <section style={{ marginTop: "1.5rem" }}>
          <div className="page-header">
            <div>
              <p className="eyebrow">Other fields</p>
              <h2 className="section-title">Other field experience</h2>
              <p className="section-copy">
                Roles outside the current audience filter, included for broader context.
              </p>
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <ExperienceTimeline entries={otherEntries} projects={projects} audience={audience} mode={viewMode} />
          </div>
        </section>
      ) : null}
    </main>
  );
}
