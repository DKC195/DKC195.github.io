import type { Metadata } from "next";
import { Suspense } from "react";
import "@/app/globals.css";
import { GlobalControls } from "@/components/global-controls";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAudiences, getProfile } from "@/lib/content";

export const metadata: Metadata = {
  title: "Dhiraj KC",
  description: "Portfolio of Dhiraj KC covering engineering, design, research, and leadership work."
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
