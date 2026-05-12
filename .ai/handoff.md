You are taking over Nanofactory (Next.js 16.2.1 App Router + React 19 + TypeScript).
This is a website/page builder with project-level editing, block-based content, theme/mode-aware rendering, background scenes, and image asset management.

1) Product summary
- Users create projects (name, slug, themeKey, status).
- Users edit page content via block editor.
- Projects can be previewed and published.
- Public page is available via `/p/[slug]`.

2) Core stack
- Next.js App Router, server actions, client/server components.
- Tailwind v4 tokens via `@theme inline` in `src/app/globals.css`.
- Auth via `next-auth`.
- DB: PostgreSQL + Drizzle ORM (code-first).
- File storage: S3-compatible (R2).
- Tests: Vitest + Playwright.

3) Must-know architecture
- Project workspace:
  - `src/app/(protected)/projects/[projectId]/page.tsx`
  - `src/components/projects/project-workspace.tsx`
- Editor:
  - `src/components/editor/project-editor.tsx`
- Rendering:
  - `src/components/projects/project-renderer.tsx`
  - `src/components/projects/section-shell.tsx`
  - `src/components/projects/background-renderer.tsx`
- Assets:
  - `src/components/assets/project-assets-panel.tsx`
  - `src/components/assets/image-asset-card.tsx`
  - `src/components/assets/image-asset-upload-card.tsx`
  - `src/components/assets/background-scene-card.tsx`
- Assets API:
  - `src/app/api/projects/[projectId]/assets/route.ts` (GET/POST)
  - `src/app/api/projects/[projectId]/assets/[assetId]/route.ts` (DELETE)
- Domain logic:
  - `src/lib/projects.ts`
  - `src/lib/assets.ts`
- DB schema:
  - `db/schema.ts`

4) Recent important changes (latest)
- Added markdown rendering support component and usage:
  - `src/components/md-renderer.tsx`
- `projects-gallery` now supports mixed nested entries:
  - `kind: "image" | "markdown"`
  - anchor naming migrated to `entryAnchor` semantics.
- Editor refactor for `projects-gallery` nested entries:
  - extracted pure operations from JSX:
    - `addImageEntry`, `addMarkdownEntry`, `updateEntry`, `removeEntry`
  - file: `src/features/blocks/projects-gallery/default/editor-operations.ts`
  - editor wired to helpers:
    - `src/features/blocks/projects-gallery/default/editor.tsx`
- Mode/navigation hardening:
  - mode resolution precedence covered by tests (`search > referer > cookie`).
  - navigation href builders/view-model covered by tests.
- E2E hardening with `data-testid` on critical UI nodes:
  - publish status/buttons, mode containers, gallery counters, nav buttons.
- Showcase refactor:
  - `showcase-client.tsx` slimmed down to composition.
  - demo cards extracted: `src/app/showcase/demo-cards.tsx`
  - UIKit sections split into modular files:
    - `src/app/showcase/uikit-sections/*`

5) Recent refactoring (dedup + cleanup)
- Duplicate `isUuid` extracted from 3 files to shared `src/lib/validate.ts`.
- Gallery navigation UI extracted into shared `GalleryItemNav` component:
  - `src/app/p/[slug]/[galleryAnchor]/[itemAnchor]/gallery-item-nav.tsx`
  - Used by both `[itemAnchor]/page.tsx` and `[entryAnchor]/page.tsx`.
- Raw markdown in SEO metadata fixed:
  - Added `stripMarkdownForMeta()` in `src/lib/markdown/meta.ts`.
  - Applied in `[entryAnchor]/page.tsx` `generateMetadata`.
- E2E test fixed: `projects-gallery-navigation.spec.ts` adjusted to match actual page structure (no separate image-preview section).

7) Projects gallery behavior (current intent)
- Project detail page (`/p/[slug]/[projectAnchor]/[galleryAnchor]`):
  - image preview list is image-only for opening entry pages.
- Entry detail page (`/p/[slug]/[projectAnchor]/[galleryAnchor]/[entryAnchor]`):
  - `Next/Previous` navigates by images only.
  - direct open of markdown entry URL should not keep user in markdown-only flow.
- Counter `Item X of Y` for projects-gallery entry detail is expected to be image-only.

8) Tests added/updated recently
- Unit:
  - `tests/unit/gallery-item-mode.test.ts`
  - `tests/unit/gallery-item-view-model.test.ts`
  - `tests/unit/projects-gallery-editor-operations.test.ts`
  - `tests/unit/projects-gallery-resolve.test.ts`
- E2E updates:
  - `tests/e2e/auth-dashboard.spec.ts`
  - `tests/e2e/project-gallery-navigation.spec.ts`
  - `tests/e2e/projects-gallery-navigation.spec.ts`

9) Known constraints
- DB is code-first and owned by app:
  - schema updates must go through migrations.
  - no manual prod schema changes.
- Keep DB/server credentials server-only.
- Avoid SSR/client divergence in initial render values.

10) High-risk zones
- Hydration-sensitive components:
  - `ProjectModeSwitcher`
  - background/theme/mode remap path
- Dialog nesting + body overflow lock.
- Theme/mode propagation across editor/preview/public routes.
- Mixed-entry galleries (`image + markdown`) where UX expectations differ between:
  - preview stream,
  - detail route,
  - next/previous flow.

11) Validation checklist after changes
Run at least:
- `npx tsc --noEmit`
- relevant unit tests (Vitest)
- relevant e2e:
  - `tests/e2e/project-gallery-navigation.spec.ts`
  - `tests/e2e/projects-gallery-navigation.spec.ts`

12) Practical note for local e2e
- Playwright webServer may fail in restricted network due to `next/font` fetching Google Fonts (`Onest`).
- If that happens, run with network-enabled execution in this environment.
