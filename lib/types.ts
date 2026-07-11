export type AudienceSlug = "all" | "engineering" | "design" | "research" | "leadership";

export type ProjectLink = {
  label: string;
  href: string;
  kind: "official" | "reference" | "live" | "github" | "demo" | "document";
  note?: string;
};

export type ProjectGalleryImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type ProjectFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  audiences: AudienceSlug[];
  tags?: string[];
  status?: string;
  featured?: boolean;
  year?: number;
  period?: string;
  links?: ProjectLink[];
  gallery?: ProjectGalleryImage[];
  relatedExperienceIds?: string[];
  sections?: string[];
};

export type Project = ProjectFrontmatter & {
  content: string;
};

export type ExperienceEntry = {
  id: string;
  title: string;
  organization: string;
  kind: "work" | "volunteer" | "fellowship" | "education" | "club" | "project";
  location?: string;
  start: string;
  end: string | null;
  audiences: AudienceSlug[];
  tags: string[];
  featured: boolean;
  summary: string;
  highlights: string[];
  relatedProjectSlugs?: string[];
};

export type ProfileData = {
  name: string;
  location: string;
  email: string;
  phone?: string;
  role: string;
  intro: string;
  currentFocus: string;
  currentStory: string;
  contactSectionTitle: string;
  links: Array<{
    label: string;
    href: string;
    category: "contact" | "social" | "work";
  }>;
};

export type AudienceDefinition = {
  slug: AudienceSlug;
  label: string;
  shortLabel: string;
  headline: string;
  summary: string;
};
