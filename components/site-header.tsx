"use client";

import { useEffect, useRef, useState } from "react";
import { useAudience } from "@/components/audience-provider";
import { QueryLink } from "@/components/query-link";
import type { ProfileData } from "@/lib/types";

type SiteHeaderProps = {
  profile: ProfileData;
};

export function SiteHeader({ profile }: SiteHeaderProps) {
  const { audience: currentAudience } = useAudience();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }
    const handlePointer = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isMenuOpen]);

  return (
    <header className="site-header panel" ref={headerRef}>
      <div className="brand-block">
        <QueryLink href="/" audience={currentAudience} className="brand-name" onClick={() => setIsMenuOpen(false)}>
          {profile.name}
        </QueryLink>
        <span className="site-header-notice">This website is still under development.</span>
      </div>

      <button
        type="button"
        className="nav-toggle"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        aria-controls="primary-nav"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span className="nav-toggle-icon" data-open={isMenuOpen} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <nav
        id="primary-nav"
        className="nav-row"
        aria-label="Primary"
        data-open={isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
      >
        <QueryLink href="/" audience={currentAudience} className="button-ghost">Home</QueryLink>
        <QueryLink href="/projects" audience={currentAudience} className="button-ghost">Portfolio</QueryLink>
        <QueryLink href="/experience" audience={currentAudience} className="button-ghost">Experience</QueryLink>
        <QueryLink href="/contact" audience={currentAudience} className="button-ghost">Contact</QueryLink>
      </nav>
    </header>
  );
}
