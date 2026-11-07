# Content Schema

## Projects
Store projects in `content/projects/*.md`.

Recommended frontmatter shape:

```md
---
title: Project Title
slug: project-slug
summary: One-line summary
audiences: [engineering, leadership]
tags: [Next.js, FastAPI]
status: ongoing
featured: true
year: 2025
period: 2025 - Present
relatedExperienceIds:
  - example-role-id
links:
  - label: Live site
    href: https://example.com
    kind: live
  - label: GitHub
    href: https://github.com/example/repo
    kind: github
  - label: Official website
    href: https://example.org
    kind: official
    note: Optional scope clarification when the site exists but was not your implementation.
gallery:
  - src: /content/projects/project-slug/images/01-cover.webp
    alt: Short factual description of the image
    caption: Optional display caption
archiveContext: |
  Optional long-form source material that should stay in the repo but should not be rendered on the site.
---
```

Project authoring notes:
- Keep the visible case study concise even if the source material is long.
- Use `archiveContext` to preserve reports, event summaries, metric caveats, planning notes, or raw copy for future rewrites.
- Use `links.kind: official` or `links.kind: reference` when a public site exists but was not your implementation.
- Use `links.kind: live` when you directly built or shipped the linked website or product.
- Use `links.kind: app-store` for App Store links. They render as Apple's official "Download on the App Store" badge (`components/app-store-badge.tsx`, artwork in `public/badges/app-store-black.svg`, from developer.apple.com/app-store/marketing/guidelines/; Apple prefers the black badge in every theme and forbids modifying it). Use a campaign link with `pt` and `ct` so App Store Connect can attribute visits to this site.
- Store project images under `public/content/projects/<project-slug>/images/`.
- Reference project images from frontmatter using root-relative paths such as `/content/projects/<project-slug>/images/01-cover.jpg`.
- Prefer resized `webp` files for gallery images unless there is a clear reason to keep another format.
- The first `gallery` item is treated as the project cover image for cards and as the first image in the project detail gallery.
- Keep `alt` text factual and concise; use `caption` only when extra visible context helps.
- To scaffold both the markdown file and image folder at once, run `pnpm new:project --title "Project Title" --slug project-slug`.

## Experience
Store experience in `content/experience/entries.json`.

Required fields:

```json
{
  "id": "unique-id",
  "title": "Role Title",
  "organization": "Organization Name",
  "kind": "work",
  "location": "Nepal",
  "start": "2025-01",
  "end": null,
  "audiences": ["engineering"],
  "tags": ["nextjs", "fastapi"],
  "featured": true,
  "summary": "Short summary",
  "highlights": ["Bullet one", "Bullet two"],
  "relatedProjectSlugs": ["project-slug"]
}
```

Rules:
- Use one entry per role, even for promotions in the same organization
- Do not merge multiple promotions into one record
- Use `end: null` for current roles
- Keep `audiences` aligned with the site filter options

## Recognition
Store awards, honors, and selections in `content/recognition/*.md`, one file per item. Each one gets a card on `/recognition/`, its own page at `/recognition/<slug>/`, and a sidebar card on each related project page. Add an optional `image` (`src`, `alt`, `caption`) for a certificate or event photo; it becomes the card and page image.

```md
---
title: National Winner
event: Code for Impact 2026
slug: code-for-impact-2026
issuer: U.S. Embassy Nepal × Aadyanta Advisory
date: 2026-07
summary: One sentence on what was won and against what field.
role: Lead Engineer, team Neptou
audiences: [engineering, leadership]
relatedProjectSlugs: [neptou]
relatedExperienceIds: [neptou-head-of-technology]
links:
  - label: Program page
    href: https://example.org
    kind: official
    note: Scope note when you did not build the site.
  - label: News coverage
    href: https://example.com/article
    kind: reference
archiveContext: |
  Source notes, quotes, and caveats. Not rendered.
---
```

Rules:
- A competition or program win is recognition, not a project. Link it to the project it came from with `relatedProjectSlugs`.
- Use the wording that sources support (for example "National Winner" rather than an unofficial title), and link the sources.
- `date` is `YYYY-MM`; entries sort newest first.

## Profile Metadata
Store profile metadata in `content/site/profile.json`.

Use it for:
- visible role text
- location
- contact links
- social/work links
- current focus copy

## Audience Labels
Store audience labels and summaries in `content/site/audiences.json`.

Changing labels there updates the UI without changing component logic.
