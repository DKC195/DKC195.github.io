"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AudienceDefinition, AudienceSlug } from "@/lib/types";

type AudienceSwitcherProps = {
  audiences: AudienceDefinition[];
  currentAudience: AudienceSlug;
  compact?: boolean;
};

export function AudienceSwitcher({ audiences, currentAudience, compact = false }: AudienceSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setAudience(nextAudience: AudienceSlug) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextAudience === "all") {
      params.delete("audience");
    } else {
      params.set("audience", nextAudience);
    }

    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  return (
    <div className="audience-switcher" data-compact={compact} aria-label="Audience filter">
      <span className="audience-switcher-label">Focus</span>
      <div className="audience-switcher-track">
        {audiences.map((audience) => (
          <button
            key={audience.slug}
            type="button"
            className="audience-switcher-option"
            data-active={currentAudience === audience.slug}
            onClick={() => setAudience(audience.slug)}
          >
            {audience.shortLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
