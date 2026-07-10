import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProjectDetailClient } from "@/components/project-detail-client";
import { getExperienceEntries, getProjectBySlug, getProjects } from "@/lib/content";

export function generateStaticParams() {
  return getProjects().map((project) => ({
    slug: project.slug
  }));
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

  return (
    <Suspense fallback={null}>
      <ProjectDetailClient project={project} relatedExperience={relatedExperience} />
    </Suspense>
  );
}
