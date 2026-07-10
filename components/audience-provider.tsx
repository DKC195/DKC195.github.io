"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAudienceFromValue } from "@/lib/audience";
import type { AudienceSlug } from "@/lib/types";

type AudienceContextValue = {
  audience: AudienceSlug;
  setAudience: (next: AudienceSlug) => void;
};

const AudienceContext = createContext<AudienceContextValue>({
  audience: "all",
  setAudience: () => {}
});

/**
 * Holds the active audience as client state instead of reading it from
 * `useSearchParams()`. That hook forces a client-side-rendering bailout under
 * `output: "export"`, which strips all page content from the static HTML.
 *
 * The initial value is always "all", so the server prerender and the first
 * client render match (no hydration mismatch) and crawlers receive the full,
 * unfiltered content. After mount we read the URL and re-filter, and we keep
 * `?audience=` in sync via history so links stay shareable and back/forward work.
 */
export function AudienceProvider({ children }: { children: React.ReactNode }) {
  const [audience, setAudienceState] = useState<AudienceSlug>("all");

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setAudienceState(getAudienceFromValue(params.get("audience")));
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const setAudience = useCallback((next: AudienceSlug) => {
    setAudienceState(next);
    const url = new URL(window.location.href);
    if (next === "all") {
      url.searchParams.delete("audience");
    } else {
      url.searchParams.set("audience", next);
    }
    window.history.pushState(null, "", url);
  }, []);

  return (
    <AudienceContext.Provider value={{ audience, setAudience }}>
      {children}
    </AudienceContext.Provider>
  );
}

export function useAudience() {
  return useContext(AudienceContext);
}
