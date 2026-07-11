# Site Decisions

## Purpose
This is a personal portfolio built for `dhirajkc195.com.np`. The site is meant to be editable through content files, not through repeated component rewrites.

## Technical Direction
- Framework: `Next.js` App Router
- Hosting target: GitHub Pages
- Output mode: static export only
- Styling: custom CSS in `app/globals.css`

Avoid patterns that require a server runtime.

## Content Model
- `content/pages/home.md`: landing-page narrative copy
- `content/projects/*.md`: project case studies with frontmatter
- `content/experience/entries.json`: full experience dataset
- `content/site/profile.json`: profile metadata, links, role text
- `content/site/audiences.json`: audience labels and summaries

## Audience and Navigation Behavior
- Audience filtering uses the `audience` query string
- Supported views include `all`, `engineering`, `design`, `research`, and `leadership`
- Internal links should preserve the active audience query

## Experience Page Decisions
- Experience must support two views:
  - `By organization`
  - `By role`
- Promotions in the same organization remain separate entries in data
- Grouping is done in UI, not by collapsing entries in `entries.json`
- Overlapping roles in the same organization should still remain separate

## Control Pattern
- Theme and audience controls live behind a floating settings button
- Desktop and mobile use the same interaction model
- The settings button should align to the content width on desktop
- The mobile settings panel may be wider than the button, but the button remains round

## Visual Direction
- Tone: professional and story-driven
- Component feel: shadcn-inspired structure with custom styling
- Dark mode should use a pure black page background
- Light mode can use soft warm surfaces, but not purple-default styling

## Portrait Assets
- `public/DKC.png`: white-background portrait for light mode
- `public/DKC_NoBG.jpeg`: no-background portrait for dark mode
- `public/DKC-home-light.webp`: optimized homepage portrait derived from `DKC.png`
- `public/DKC-home-dark.webp`: optimized homepage portrait derived from `DKC_NoBG.jpeg`

The homepage currently uses a single optimized transparent portrait asset so the hero image stays directly discoverable and highly prioritized for LCP.
