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
- Background scenes (current model):
  - global library API:
    - `src/app/api/background-library-scenes/route.ts` (GET/POST)
    - `src/app/api/background-library-scenes/[sceneId]/route.ts` (PATCH/DELETE)
  - project-scoped background scenes API is deprecated and returns `410`:
    - `src/app/api/projects/[projectId]/background-scenes/route.ts`
  - admin UI for library management:
    - `src/app/(protected)/background-library/page.tsx`
- Domain logic:
  - `src/lib/projects.ts`
  - `src/lib/assets.ts`
- DB schema:
  - `db/schema.ts`

4) Recent important changes (latest)
- Project editor primary actions moved to header:
  - `Add block` and `Save` now render in `ProjectSettings` (`size="sm"`).
  - `Save` is handled in `ProjectSettings` via `useActionState` and uses draft content from preview-draft store.
  - save success/error toasts are triggered from `ProjectSettings`.
- Editor action wiring update:
  - `ProjectEditor` no longer renders toolbar save/add controls.
  - add-block flow is now bridged via event (`src/components/editor/editor-events.ts`).
- E2E updates for header-driven save flow:
  - specs use helper-based save that closes block editor before clicking header `Save`.
  - removed unstable spec file:
    - `tests/e2e/project-anchors.spec.ts`
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
  - showcase sections split into modular files:
    - `src/app/showcase/uikit-sections/*`
    - `src/app/showcase/animation-sections/*`
- Project settings `Actions` in `ProjectSettings` now apply immediately on selection (no `Apply` buttons):
  - `modePolicy`, `borderRadiusPolicy`, and `theme` updates are triggered from client `onValueChange` via server actions.
  - files:
    - `src/components/projects/project-settings.tsx`
    - `src/components/projects/project-theme-form.tsx`
- Mode policy is mirrored to DOM for live UI behavior:
  - `main` now carries `data-mode-policy` on project page render.
  - `ProjectSettings` updates `data-mode-policy` on change before server roundtrip.
  - file:
    - `src/app/(protected)/projects/[projectId]/page.tsx`
- Feature block app header mode switcher visibility now follows live DOM mode policy:
  - `src/features/blocks/app-header/default/render.tsx` observes `data-mode-policy` and hides mode switcher when policy is not `switchable`.
- Added global project spacing scale:
  - DB: `projects.spacing_scale` with enum `project_spacing_scale` (`sm | md | lg`, default `md`).
  - wired through domain/actions/page/renderer/editor pipeline as project-level prop (`projectSpacingScale`).
  - files include:
    - `db/schema.ts`
    - `src/lib/projects.ts`
    - `src/app/(protected)/projects/[projectId]/actions.ts`
    - `src/app/(protected)/projects/[projectId]/page.tsx`
    - `src/components/projects/project-renderer.tsx`
    - `src/components/editor/project-editor.tsx`
    - `src/features/blocks/shared/types.ts`
- `ProjectSettings` project settings include immediate apply for spacing scale:
  - file:
    - `src/components/projects/project-settings.tsx`
- CTA button supports link + spacing-aware button sizing:
  - `buttonHref` added to CTA block definition.
  - CTA render uses link-style button and combines tone classes with spacing classes.
  - files:
    - `src/features/blocks/cta/default/definition.ts`
    - `src/features/blocks/cta/default/render.tsx`
- Spacing scale support added across block renders:
  - `features`, `gallery`, `projects-gallery`, `footer`, `app-header`, `hero`.
  - note: current intent is that spacing scale changes element spacing/typography density; it should not be used to scale image content size.
- Public preview navigation controls are spacing-aware:
  - `Back to ...`, `Item X of Y`, `Previous`, `Next` now receive spacing classes from route-level scale config.
  - `GalleryItemNav` accepts `controlClassName` and `controlBarClassName`.
  - files:
    - `src/app/p/[slug]/[galleryAnchor]/[itemAnchor]/gallery-item-nav.tsx`
    - `src/app/p/[slug]/[galleryAnchor]/[itemAnchor]/page.tsx`
    - `src/app/p/[slug]/[galleryAnchor]/[itemAnchor]/[entryAnchor]/page.tsx`
- Project preview route is first-class:
  - editor preview route:
    - `src/app/(protected)/projects/[projectId]/preview/page.tsx`
  - supports draft token + temporary theme/mode overrides via query params.
  - falls back to saved content if draft is missing/expired and enforces mode by policy.

5) Recent refactoring (dedup + cleanup)
- Duplicate `isUuid` extracted from 3 files to shared `src/lib/validate.ts`.
- Gallery navigation UI extracted into shared `GalleryItemNav` component:
  - `src/app/p/[slug]/[galleryAnchor]/[itemAnchor]/gallery-item-nav.tsx`
  - Used by both `[itemAnchor]/page.tsx` and `[entryAnchor]/page.tsx`.
- Raw markdown in SEO metadata fixed:
  - Added `stripMarkdownForMeta()` in `src/lib/markdown/meta.ts`.
  - Applied in `[entryAnchor]/page.tsx` `generateMetadata`.
- E2E test fixed: `projects-gallery-navigation.spec.ts` adjusted to match actual page structure (no separate image-preview section).
- Inline `cx()` classname utility extracted from 21 components to shared `src/lib/cn.ts`.
- Duplicate `createBlockId`/`createStorageId`/`createId` unified into `src/lib/id.ts`.
- DOM mode helpers (`readModeFromRoot`/`applyModeToRoot`) extracted to `src/lib/dom-utils.ts`; `ClosestCapableNode` adapter removed.
- Background palette lookup flattened from nested ternaries to a `PALETTES` record in `background-scene-defaults.ts`.
- `mapPlainObjects<T>` helper extracted in `model.ts` to deduplicate array parsing in `readEntryItems`/`readProjectItems`.

7) Projects gallery behavior (current intent)
- Project detail page (`/p/[slug]/[galleryAnchor]/[itemAnchor]`):
  - image preview list is image-only for opening entry pages.
- Entry detail page (`/p/[slug]/[galleryAnchor]/[itemAnchor]/[entryAnchor]`):
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
- Onest is now loaded from a local font file via `next/font/local`:
  - `src/app/fonts/Onest-Variable.ttf`
  - `src/app/layout.tsx`
- E2E should not require outbound network for font fetching.
