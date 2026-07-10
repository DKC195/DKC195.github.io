import type { Metadata } from "next";
import { Suspense } from "react";
import "@/app/globals.css";
import { GlobalControls } from "@/components/global-controls";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";
import { getAudiences, getProfile } from "@/lib/content";
import { OG_IMAGE, SAME_AS, SITE_NAME, SITE_URL } from "@/lib/seo";

const rootProfile = getProfile();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${rootProfile.name} — ${rootProfile.role}`,
    template: `%s · ${SITE_NAME}`
  },
  description: rootProfile.intro,
  keywords: [
    "Dhiraj KC",
    "portfolio",
    "engineering",
    "design",
    "research",
    "leadership",
    "Nepal",
    "web development"
  ],
  authors: [{ name: rootProfile.name, url: SITE_URL }],
  creator: rootProfile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: `${rootProfile.name} — ${rootProfile.role}`,
    description: rootProfile.intro,
    images: [OG_IMAGE],
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: `${rootProfile.name} — ${rootProfile.role}`,
    description: rootProfile.intro,
    images: [OG_IMAGE]
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: rootProfile.name,
      url: SITE_URL,
      jobTitle: rootProfile.role,
      description: rootProfile.intro,
      image: `${SITE_URL}${OG_IMAGE}`,
      email: `mailto:${rootProfile.email}`,
      address: rootProfile.location,
      sameAs: SAME_AS
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: rootProfile.intro,
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en"
    }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = getProfile();
  const audiences = getAudiences();

  return (
    <html lang="en">
      <body>
        <StructuredData data={structuredData} />
        <div className="site-shell site-frame">
          <Suspense fallback={null}>
            <SiteHeader profile={profile} />
          </Suspense>
          {children}
          <Suspense fallback={null}>
            <SiteFooter profile={profile} />
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <GlobalControls audiences={audiences} />
        </Suspense>
      </body>
    </html>
  );
}
