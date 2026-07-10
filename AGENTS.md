# Repository Guidelines

## Project Structure & Module Organization
This repository is a static-export `Next.js` portfolio for `dhirajkc195.com.np`.

- `app/`: App Router pages for `Home`, `Projects`, `Experience`, and `Contact`
- `components/`: UI components and client-side interaction controls
- `content/pages/`: editable Markdown page content
- `content/projects/`: one Markdown file per project/case study
- `content/experience/entries.json`: structured experience data
- `content/site/`: profile metadata and audience labels
- `lib/`: content loaders, shared types, and audience helpers
- `public/`: static assets such as profile images and `CNAME`
- `docs/`: persistent design, architecture, and content-schema decisions

Read `docs/site-decisions.md` and `docs/content-schema.md` before changing structure or UI behavior. Read `docs/seo.md` before changing metadata, structured data, sitemap/robots, icons, or the deploy pipeline.

## Build, Test, and Development Commands
Use the existing npm scripts:

```bash
npm install
npm run dev
npm run dev -- --hostname 0.0.0.0
npm run build
npm run typecheck
```

- `npm run dev`: local development server
- `npm run dev -- --hostname 0.0.0.0`: test on phone/tablet over local network
- `npm run build`: required before handoff; validates the static export
- `npm run typecheck`: TypeScript validation without building

## Content Workflow
Do not hardcode portfolio content in components unless it is true UI chrome.

- Update homepage copy in `content/pages/home.md`
- Add or edit projects in `content/projects/*.md`
- Add experience entries in `content/experience/entries.json`
- Update links, role text, and profile metadata in `content/site/profile.json`
- Update audience labels and summaries in `content/site/audiences.json`

For promotions in the same organization, keep separate role entries and rely on the Experience page’s grouping mode instead of merging entries.

## Project Intake Guidelines
When converting rough notes, reports, or event summaries into portfolio projects, keep the public case study concise and store long-form source context in the project file for future reuse.

- Use one Markdown file per project in `content/projects/`
- Keep rendered sections focused on `Overview`, `Execution` or `Role`, and `Outcomes`
- Store long-form raw notes in a non-rendered frontmatter field such as `archiveContext`
- Use `archiveContext` for copied reports, planning notes, metric caveats, quote fragments, or future rewrite material
- Do not render `archiveContext` in components
- If a project has an official site or public page that you did not build, include it as a link with a scope note instead of implying implementation ownership
- If you did build the live website or shipped product yourself, use a `live` link without a scope disclaimer
- Keep role-to-project relationships explicit by updating `relatedExperienceIds` in the project file and `relatedProjectSlugs` in matching experience entries

Recommended project handoff format for new content:

- Project name
- What it was for
- Your role
- What you actually did
- Tools or stack used
- Scale, participants, or reach
- Constraints or challenges
- Outcome or impact
- Official links and whether you built them
- Any long-form notes or source material for `archiveContext`

## Coding Style & Naming Conventions
Use 2-space indentation in JSON, CSS, and TypeScript. Prefer:

- PascalCase for React component files: `ProjectCard.tsx`
- lowercase route files in `app/`
- kebab-case for content slugs and asset names

Keep the site GitHub Pages-friendly: preserve static export compatibility and avoid server-only runtime assumptions.

Never call `useSearchParams()`/`usePathname()` in a render path — under static export they blank the page body from the static HTML. Read the active audience from `useAudience()` (`components/audience-provider.tsx`) instead. See `docs/seo.md` (Rendering & crawlability).

## Testing Guidelines
There is no dedicated test suite yet. Minimum verification is:

- run `npm run build`
- check the affected route in desktop and mobile layouts
- confirm audience filtering, experience view toggles, and settings panel behavior still work

## Commit & Pull Request Guidelines
Keep commits short and specific, for example:

- `Add grouped experience timeline`
- `Refine mobile settings panel`

For PRs, include a concise summary, screenshots for UI changes, and note any content schema updates.
