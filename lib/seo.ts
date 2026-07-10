import type { Metadata } from "next";

export const SITE_URL = "https://dhirajkc195.com.np";
export const SITE_NAME = "Dhiraj KC";
export const OG_IMAGE = "/DKC_NoBG.jpeg";

// Only real, verified profiles belong in structured-data `sameAs`.
export const SAME_AS = [
  "https://www.linkedin.com/in/dkc195",
  "https://github.com/DKC195"
];

type PageMetadataInput = {
  title?: string;
  description: string;
  /** Route path with trailing slash, e.g. "/projects/". */
  path: string;
  keywords?: string[];
  ogType?: "website" | "article";
};

/**
 * Builds a consistent per-page Metadata object: canonical URL (trailing-slash
 * aware), Open Graph, and Twitter card. Relative URLs resolve against the root
 * layout's `metadataBase`. Omit `title` to fall back to the layout default.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  ogType = "website"
}: PageMetadataInput): Metadata {
  return {
    // Only set `title` when provided so the layout's default title (and the
    // "%s · Dhiraj KC" template) still apply. Explicitly passing `undefined`
    // here would suppress the document <title> entirely.
    ...(title ? { title } : {}),
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: ogType,
      url: path,
      siteName: SITE_NAME,
      // When no page title, omit og:title so Next backfills it from the
      // resolved (layout default) title.
      ...(title ? { title } : {}),
      description,
      images: [OG_IMAGE],
      locale: "en_US"
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      description,
      images: [OG_IMAGE]
    }
  };
}
