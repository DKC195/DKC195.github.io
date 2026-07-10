"use client";

import { useAudience } from "@/components/audience-provider";
import { QueryLink } from "@/components/query-link";
import type { ProfileData } from "@/lib/types";

type SiteHeaderProps = {
  profile: ProfileData;
};

export function SiteHeader({ profile }: SiteHeaderProps) {
  const { audience: currentAudience } = useAudience();

  return (
    <header className="site-header panel">
      <div className="brand-block">
        <QueryLink href="/" audience={currentAudience} className="brand-name">
          {profile.name}
        </QueryLink>
        <span className="site-header-notice">This website is still under development.</span>
      </div>

      <nav className="nav-row" aria-label="Primary">
        <QueryLink href="/" audience={currentAudience} className="button-ghost">Home</QueryLink>
        <QueryLink href="/projects" audience={currentAudience} className="button-ghost">Portfolio</QueryLink>
        <QueryLink href="/experience" audience={currentAudience} className="button-ghost">Experience</QueryLink>
        <QueryLink href="/contact" audience={currentAudience} className="button-ghost">Contact</QueryLink>
      </nav>
    </header>
  );
}
