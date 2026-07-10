"use client";

import { useSearchParams } from "next/navigation";
import { QueryLink } from "@/components/query-link";
import { getAudienceFromValue } from "@/lib/audience";
import type { ProfileData } from "@/lib/types";

export function SiteFooter({ profile }: { profile: ProfileData }) {
  const searchParams = useSearchParams();
  const audience = getAudienceFromValue(searchParams.get("audience"));
  const visibleLinks = profile.links.filter((link) => Boolean(link.href && !link.href.includes("placeholder")));

  return (
    <footer className="site-footer panel">
      <div className="brand-block">
        <span className="brand-name">{profile.name}</span>
        <span className="brand-tagline">{profile.location}</span>
      </div>

      <div className="nav-row">
        <QueryLink href="/" audience={audience} className="button-ghost">Home</QueryLink>
        <QueryLink href="/projects" audience={audience} className="button-ghost">Portfolio</QueryLink>
        <QueryLink href="/experience" audience={audience} className="button-ghost">Experience</QueryLink>
        <QueryLink href="/contact" audience={audience} className="button-ghost">Contact</QueryLink>
      </div>

      <div className="nav-row">
        {visibleLinks.map((link) => (
          <a key={link.label} href={link.href} className="chip" target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
