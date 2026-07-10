import type { AudienceSlug } from "@/lib/types";

export function getAudienceFromValue(value?: string | null): AudienceSlug {
  const allowed: AudienceSlug[] = ["all", "engineering", "design", "research", "leadership"];
  if (value && allowed.includes(value as AudienceSlug)) {
    return value as AudienceSlug;
  }
  return "all";
}

export function filterByAudience<T extends { audiences: AudienceSlug[] }>(items: T[], audience: AudienceSlug) {
  if (audience === "all") {
    return items;
  }
  return items.filter((item) => item.audiences.includes(audience));
}
