import { RecognitionPageClient } from "@/components/recognition-page-client";
import { getProjects, getRecognition } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Recognition",
  description:
    "Awards, honors, and recognition earned by Dhiraj KC and the teams he has built with, including Code for Impact 2026.",
  path: "/recognition/",
  markdownMirror: true
});

export default function RecognitionPage() {
  const recognition = getRecognition();
  const projects = getProjects();

  return <RecognitionPageClient recognition={recognition} projects={projects} />;
}
