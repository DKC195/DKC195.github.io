# SEO and AI-SEO

## Purpose
This document records how search-engine and AI/LLM discoverability are handled for `dhirajkc195.com.np`. SEO metadata is derived from existing content files, not hardcoded per page. Read this before changing metadata, structured data, sitemap/robots, icons, or the deploy pipeline.

## Constraints
- Output mode is static export only (`output: "export"` in `next.config.mjs`). No server runtime, no edge.
- Dynamic Open Graph image generation (`next/og` `ImageResponse`) is **not available** under static export. The share image must be a static file.
- `trailingSlash: true`, so every canonical, sitemap, and internal SEO URL must end in `/` (e.g. `/projects/`).
- Canonical origin is `https://dhirajkc195.com.np` (matches `public/CNAME`).
- `app/**/page.tsx` files are server components; metadata exports must stay in them, never inside `"use client"` components.

## Rendering & crawlability (critical)
Metadata in `<head>` is not enough — the page **body** must render into the static HTML, or non-JS crawlers and most AI bots see an empty shell.

- **Never call `useSearchParams()` / `usePathname()` in a render path.** Under `output: "export"` these force a client-side-rendering bailout (`BAILOUT_TO_CLIENT_SIDE_RENDERING`), stripping the whole subtree — body, header, nav, footer — from the static HTML. This was the original defect.
- The active audience comes from **`useAudience()`** (`components/audience-provider.tsx`), a client React context, **not** from the URL hook. It initializes to `"all"`, so the server prerender and first client render match (no hydration mismatch) and crawlers get the full unfiltered content. After mount the provider reads `?audience=` from `window.location`, re-filters, and keeps the URL in sync via `history.pushState` (shareable links, working back/forward).
- Because `filterByAudience(items, "all") === items`, the `"all"` view is just the raw content — fully server-renderable with no hooks.
- Pages render their client components **directly** (no `<Suspense fallback={null}>` wrapper). Adding such a wrapper around a searchParams reader reintroduces the empty-shell bug.
- Interactive-only client state (e.g. the experience view toggle, theme) is fine — only the dynamic URL hooks trigger the bailout.
- **Verify after any change**: `grep -rl BAILOUT_TO_CLIENT_SIDE_RENDERING out/*.html` must return nothing, and `out/index.html` must contain `<main>`, `<header>`, `<nav>`, and real heading text.

### First-paint theme
`app/layout.tsx` includes a small inline `<head>` script that sets `document.documentElement.dataset.theme` from `localStorage.theme ?? prefers-color-scheme` before paint (avoids FOUC now that bodies render server-side). `<html>` uses `suppressHydrationWarning` because that attribute is set outside React.

## Single Source of Truth
`lib/seo.ts` holds shared constants and the metadata builder. Do not duplicate these values elsewhere.
- `SITE_URL`, `SITE_NAME`, `OG_IMAGE` (`/DKC_NoBG.jpeg`).
- `SAME_AS`: only real, verified profiles (LinkedIn + `https://github.com/DKC195`). Never add placeholder URLs from `profile.json` here.
- `pageMetadata({ title, description, path, keywords?, ogType? })`: returns canonical + Open Graph + Twitter metadata. Pass `path` with a trailing slash.

### Title rules
- Root layout (`app/layout.tsx`) sets `title.default` (`"Dhiraj KC — <role>"`) and `title.template` (`"%s · Dhiraj KC"`).
- Inner pages pass a `title` → renders as `"<title> · Dhiraj KC"`.
- The home page passes **no** `title` so the default applies. `pageMetadata` omits the `title` key entirely when none is given; passing `title: undefined` would suppress the document `<title>` and must be avoided.

## Metadata Placement
- **Site-wide** (`app/layout.tsx`): `metadataBase`, default/template title, description (`profile.intro`), keywords, authors/creator, Open Graph, Twitter.
- **Static pages** (`app/page.tsx`, `projects/`, `experience/`, `contact/`): `export const metadata = pageMetadata(...)`.
- **Project detail** (`app/projects/[slug]/page.tsx`): `generateMetadata` pulls title/summary/tags from frontmatter via `getProjectBySlug`. `ogType: "article"`. This is what gives each project a unique title/description instead of the generic default.

## Structured Data (AI-SEO)
JSON-LD is how LLMs and rich-result crawlers read the site as entities, not just prose. Rendered via `components/structured-data.tsx`.
- **`Person` + `WebSite`** graph in `app/layout.tsx` (site-wide). `Person` carries name, role (`jobTitle`), image, email, location, and `sameAs`. Stable `@id` anchors: `#person`, `#website`.
- **`CreativeWork`** in `app/projects/[slug]/page.tsx` per project (name, description, keywords, `dateCreated` from `year`, `author` → the `#person` node).
- All entity data comes from `profile.json` and project frontmatter — keep those accurate and the structured data stays correct.

### AI-SEO principles applied
- Clear semantic HTML and one `<h1>` per page (already in place) so content is machine-parseable.
- Descriptive, self-contained `summary` frontmatter per project — reused verbatim as meta description and JSON-LD description, which is what AI answers quote.
- `sameAs` links tie the site to authoritative external profiles for entity resolution.
- Canonical URLs prevent duplicate-content ambiguity across the audience query-string variants (`?audience=...`).

## Discovery Files
- `app/sitemap.ts`: static routes + one entry per project from `getProjects()`. Trailing-slash absolute URLs. Emits `out/sitemap.xml`.
- `app/robots.ts`: allow-all + sitemap reference. Emits `out/robots.txt`.
- `public/llms.txt`: generated LLM-facing site overview in the current `llmstxt.org` markdown format. Emitted to `out/llms.txt`.
- Both use `export const dynamic = "force-static"` so they work under static export.
- When a route is added, confirm it appears in `sitemap.ts` (project routes are automatic; new top-level routes must be added manually).

### `llms.txt` generation
- Source of truth is existing content, not a separately maintained hand-written file.
- `scripts/generate-llms-txt.mjs` reads `profile.json`, `home.md`, and project frontmatter to generate `public/llms.txt`.
- `pnpm generate:llms` runs the generator directly.
- `predev` and `prebuild` run the generator automatically, so local dev and production exports stay current.
- The current implementation links to canonical HTML pages because the site does not yet publish `.md` mirrors of page content.

## Icons, Manifest, Share Image
- `app/icon.png` (512²) and `app/apple-icon.png` (180²) are resized copies of `public/DKC.png` (Next file-based icon convention).
- `app/manifest.ts` references `/DKC.png` from `public/` (not the hashed `app/icon.png` route).
- Share image is `public/DKC_NoBG.jpeg`, referenced via `OG_IMAGE`. It is a portrait, not a 1200×630 card; a branded card can later replace the same path without code changes.

## Deployment (required for any of the above to reach production)
SEO output only exists after `pnpm build` writes it into `out/`. `out/` is gitignored and must **not** be committed.
- `.github/workflows/deploy.yml` builds the export and publishes `out/` via `actions/deploy-pages` on push to `main`.
- GitHub Pages **Source** must be set to **"GitHub Actions"** (not the legacy branch builder, which serves raw source and does not run `pnpm build`).
- `public/.nojekyll` prevents Jekyll from stripping `_next/` assets.
- `public/CNAME` carries the custom domain into `out/`.

## Verification
1. `pnpm typecheck` and `pnpm build`.
2. Confirm `out/sitemap.xml`, `out/robots.txt`, `out/llms.txt`, `out/.nojekyll`, `out/CNAME` exist.
3. Spot-check emitted HTML for unique `<title>`, `<meta name="description">`, `<link rel="canonical">` (trailing slash), and `og:`/`twitter:` tags per page.
4. Confirm project pages carry `CreativeWork` JSON-LD and the home page carries `Person` + `WebSite`.
5. After deploy, validate a project URL with Google Rich Results Test and a social-card debugger.
