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
archiveContext: |
  Optional long-form source material that should stay in the repo but should not be rendered on the site.
---
```

Project authoring notes:
- Keep the visible case study concise even if the source material is long.
- Use `archiveContext` to preserve reports, event summaries, metric caveats, planning notes, or raw copy for future rewrites.
- Use `links.kind: official` or `links.kind: reference` when a public site exists but was not your implementation.
- Use `links.kind: live` when you directly built or shipped the linked website or product.

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
