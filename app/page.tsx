import { Suspense } from "react";
import { HomePageClient } from "@/components/home-page-client";
import { getAudiences, getExperienceEntries, getHomeContent, getProfile, getProjects } from "@/lib/content";

export default function HomePage() {
  const profile = getProfile();
  const audiences = getAudiences();
  const home = getHomeContent();
  const featuredProjects = getProjects().filter((project) => project.featured);
  const featuredExperience = getExperienceEntries().filter((entry) => entry.featured);

  return (
    <Suspense fallback={null}>
      <HomePageClient
        audiences={audiences}
        profile={profile}
        home={home}
        featuredProjects={featuredProjects}
        featuredExperience={featuredExperience}
      />
    </Suspense>
  );
}
