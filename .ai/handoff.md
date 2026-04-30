You are taking over Nanofactory (Next.js 16.2.1 App Router + React 19 + TypeScript).
This is a website/page builder with project-level editing, block-based content, theme/mode-aware rendering, background scenes, and image asset management.

1) Product summary
Users create projects (name, slug, themeKey, status).
They edit page content via block editor.
They can preview and publish projects.
Public page is available via /p/[slug].
2) Core stack
Next.js App Router, server actions, client/server components.
Tailwind v4 tokens via @theme inline in src/app/globals.css.
Auth via next-auth.
DB: PostgreSQL + Drizzle ORM (code-first).
File storage: S3-compatible (R2).
Tests: Vitest + Playwright.
3) Must-know architecture
Project page/workspace:
src/app/(protected)/projects/[projectId]/page.tsx
src/components/projects/project-workspace.tsx
Editor:
src/components/editor/project-editor.tsx
Rendering:
src/components/projects/project-renderer.tsx
src/components/projects/section-shell.tsx
src/components/projects/background-renderer.tsx
Assets UI:
src/components/assets/project-assets-panel.tsx
src/components/assets/image-asset-card.tsx
src/components/assets/image-asset-upload-card.tsx
src/components/assets/background-scene-card.tsx
Assets API:
src/app/api/projects/[projectId]/assets/route.ts (GET/POST)
src/app/api/projects/[projectId]/assets/[assetId]/route.ts (DELETE)
Domain logic:
src/lib/projects.ts
src/lib/assets.ts
DB schema:
db/schema.ts
4) Recent important changes
Rename dialog now updates both name and slug.
Slug validation rule: only [A-Za-z0-9-], no spaces.
Field highlighting in rename dialog triggers only after clicking Save changes.
Image assets are now card-based:
Image preview card opens details modal.
Deletion requires confirm dialog (Delete permanently).
Upload image moved to first card in Image assets grid via modal upload form.
Background catalog now has matching card+modal behavior (no delete).
Fixed scroll-lock bug with nested dialogs:
src/components/ui/dialog.tsx now uses open-dialog counter on body.
Fixed hydration mismatches:
Theme/mode fallback alignment for background rendering.
ProjectModeSwitcher now receives initialMode in preview renderer.
5) Known constraints
DB is code-first and owned by app:
schema updates must go through migrations.
No manual prod schema changes.
Keep DB/server credentials server-only.
Avoid introducing SSR/client divergence in initial render values.
6) High-risk zones
Hydration-sensitive components:
ProjectModeSwitcher
BackgroundRenderer / theme+mode remap path
Dialog nesting and body overflow lock.
Asset delete flow consistency between UI state and backend state.
Theme/mode propagation across editor, preview, public rendering.
7) Current UX behavior expected
Project preview mode switch should not trigger hydration warnings.
Image delete should always require confirmation.
After modal/dialog close, body must not stay overflow: hidden.
Upload card is first card in Image assets section.
8) If you change anything here, run at least
npx tsc --noEmit
relevant unit tests (Vitest) for touched actions/components
relevant e2e for dashboard/project preview flows if behavior changed.