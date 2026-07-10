"use client";

import { useAudience } from "@/components/audience-provider";
import type { AudienceDefinition } from "@/lib/types";

type AudienceSwitcherProps = {
  audiences: AudienceDefinition[];
  compact?: boolean;
};

export function AudienceSwitcher({ audiences, compact = false }: AudienceSwitcherProps) {
  const { audience: currentAudience, setAudience } = useAudience();

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
