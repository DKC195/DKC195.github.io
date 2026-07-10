import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailClient } from "@/components/project-detail-client";
import { StructuredData } from "@/components/structured-data";
import { getExperienceEntries, getProfile, getProjectBySlug, getProjects } from "@/lib/content";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return getProjects().map((project) => ({
    slug: project.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}/`,
    keywords: project.tags,
    ogType: "article"
  });
}

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const relatedExperience = getExperienceEntries().filter((entry) =>
    project.relatedExperienceIds?.includes(entry.id)
  );

  const profile = getProfile();
  const projectUrl = `${SITE_URL}/projects/${project.slug}/`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${projectUrl}#creativework`,
    name: project.title,
    headline: project.title,
    description: project.summary,
    url: projectUrl,
    keywords: project.tags?.join(", "),
    ...(project.year ? { dateCreated: String(project.year) } : {}),
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: profile.name
    }
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <ProjectDetailClient project={project} relatedExperience={relatedExperience} />
    </>
  );
}
