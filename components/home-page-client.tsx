"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { QueryLink } from "@/components/query-link";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ProjectCard } from "@/components/project-card";
import { filterByAudience, getAudienceFromValue } from "@/lib/audience";
import type { AudienceDefinition, ExperienceEntry, ProfileData, Project } from "@/lib/types";

type HomePageClientProps = {
  audiences: AudienceDefinition[];
  profile: ProfileData;
  home: {
    data: {
      title: string;
      summary: string;
      highlights: string[];
    };
    html: string;
  };
  featuredProjects: Project[];
  featuredExperience: ExperienceEntry[];
};

export function HomePageClient({
  audiences,
  profile,
  home,
  featuredProjects,
  featuredExperience
}: HomePageClientProps) {
  const searchParams = useSearchParams();
  const audience = getAudienceFromValue(searchParams.get("audience"));
  const currentAudience = audiences.find((item) => item.slug === audience) ?? audiences[0];
  const visibleProjects = filterByAudience(featuredProjects, audience);
  const visibleExperience = filterByAudience(featuredExperience, audience).slice(0, 4);

  return (
    <main className="grid">
      <section className="panel section hero-grid">
        <div className="card">
          <p className="eyebrow">{currentAudience.label}</p>
          <h1 className="section-title">{currentAudience.headline}</h1>
          <p className="section-copy">{currentAudience.summary}</p>

          <div className="chip-row" style={{ marginTop: "1.25rem" }}>
            <span className="chip">{profile.location}</span>
            <span className="chip">{profile.role}</span>
          </div>

          <div className="actions-row" style={{ marginTop: "1.5rem" }}>
            <QueryLink href="/projects" audience={audience} className="button">
              Explore projects
            </QueryLink>
            <QueryLink href="/experience" audience={audience} className="button-ghost">
              View experience
            </QueryLink>
          </div>
        </div>

        <div className="profile-art">
          <Image
            src="/DKC.png"
            alt="Portrait of Dhiraj KC"
            fill
            sizes="(max-width: 960px) 100vw, 38vw"
            className="profile-image profile-image-light"
            priority
          />
          <Image
            src="/DKC_NoBG.jpeg"
            alt="Portrait of Dhiraj KC"
            fill
            sizes="(max-width: 960px) 100vw, 38vw"
            className="profile-image profile-image-dark"
            priority
          />
        </div>
      </section>

      <section className="panel section">
        <div className="page-header">
          <div>
            <p className="eyebrow">About</p>
            <h2 className="section-title">{home.data.title}</h2>
            <p className="section-copy">{home.data.summary}</p>
          </div>
        </div>
        <div className="content-grid" style={{ marginTop: "1rem" }}>
          <div className="col-7 card">
            <MarkdownRenderer html={home.html} />
          </div>
          <div className="col-5 grid">
            <article className="card">
              <p className="eyebrow">Current focus</p>
              <h3>{profile.currentFocus}</h3>
              <p className="section-copy">{profile.currentStory}</p>
            </article>
            <article className="card">
              <p className="eyebrow">Focus areas</p>
              <div className="stack">
                {home.data.highlights.map((highlight) => (
                  <span key={highlight}>{highlight}</span>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="panel section">
        <div className="page-header">
          <div>
            <p className="eyebrow">Projects</p>
            <h2 className="section-title">Selected projects</h2>
            <p className="section-copy">
              A few projects that show what I focus on now, with a sense of the wider range of work behind them.
            </p>
          </div>
          <QueryLink href="/projects" audience={audience} className="button-ghost">
            View all projects
          </QueryLink>
        </div>

        <div className="project-list" style={{ marginTop: "1rem" }}>
          {visibleProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} audience={audience} />
          ))}
        </div>
      </section>

      <section className="panel section">
        <div className="page-header">
          <div>
            <p className="eyebrow">Experience</p>
            <h2 className="section-title">Recent roles</h2>
          </div>
          <QueryLink href="/experience" audience={audience} className="button-ghost">
            View full experience
          </QueryLink>
        </div>

        <div className="timeline" style={{ marginTop: "1rem" }}>
          {visibleExperience.map((entry) => (
            <article key={entry.id} className="card timeline-item">
              <p className="eyebrow">{entry.organization}</p>
              <h3 style={{ marginBottom: "0.25rem" }}>{entry.title}</h3>
              <p className="section-copy">{entry.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
