import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecognitionDetailClient } from "@/components/recognition-detail-client";
import { StructuredData } from "@/components/structured-data";
import { getExperienceEntries, getProfile, getProjects, getRecognition, getRecognitionBySlug } from "@/lib/content";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return getRecognition().map((item) => ({
    slug: item.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getRecognitionBySlug(slug);

  if (!item) {
    return { title: "Recognition not found" };
  }

  return pageMetadata({
    title: `${item.title} · ${item.event}`,
    description: item.summary,
    path: `/recognition/${item.slug}/`,
    markdownMirror: true,
    ogType: "article"
  });
}

export default async function RecognitionDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getRecognitionBySlug(slug);

  if (!item) {
    notFound();
  }

  const relatedProjects = getProjects().filter((project) => item.relatedProjectSlugs?.includes(project.slug));
  const relatedExperience = getExperienceEntries().filter((entry) => item.relatedExperienceIds?.includes(entry.id));

  const profile = getProfile();
  const itemUrl = `${SITE_URL}/recognition/${item.slug}/`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${itemUrl}#webpage`,
    name: `${item.title} · ${item.event}`,
    description: item.summary,
    url: itemUrl,
    about: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: profile.name,
      award: `${item.title}, ${item.event}`
    }
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <RecognitionDetailClient item={item} relatedProjects={relatedProjects} relatedExperience={relatedExperience} />
    </>
  );
}
