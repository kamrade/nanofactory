# MVP-1 Technical Snapshot

## Overview

Nanofactory is a block-based landing page builder built on top of Next.js App Router.

Current product baseline:

- credentials-based authentication
- protected dashboard
- project creation and ownership isolation
- project editor backed by structured `content_json`
- publish / unpublish flow
- public rendering by slug
- project-scoped asset uploads
- variant-aware block system with colocated definitions

This file is intended as a technical handoff / memory document so future work does not start from zero.

---

## Core Stack

- Next.js App Router
- React
- PostgreSQL
- Drizzle ORM
- NextAuth credentials auth
- Cloudflare R2 for file storage
- Vitest for unit/integration tests
- Playwright for e2e tests

---

## Application Structure

High-level directories:

- `app/` — routes, pages, route handlers, server actions
- `components/` — page-level and orchestration-level UI
- `features/blocks/` — block system, variants, editors, renderers, shared primitives
- `lib/` — domain services for projects, assets, auth, editor parsing
- `db/` — schema, connection, seeds
- `tests/` — unit, integration, e2e

Important current architectural direction:

- block logic is being moved away from a monolithic `lib/editor/blocks.ts`
- block variants are now colocated under `features/blocks/*`
- `ProjectEditor` is being reduced to an orchestration layer

---

## Data Model

Main entities:

- `users`
- `projects`
- `project_contents`
- `assets`

Schema source of truth:

- `db/schema.ts`

Important project fields:

- `projects.slug`
- `projects.themeKey`
- `projects.status`
- `projects.publishedAt`

Important content storage rule:

- page content is stored as structured JSON in `project_contents.content_json`
- block data is not stored as arbitrary HTML

Current content shape:

```ts
type PageContent = {
  blocks: PageBlock[];
};

type PageBlock = {
  id: string;
  type: "hero" | "features" | "cta";
  variant?: string;
  props: Record<string, unknown>;
};
```

`variant` is optional in stored content for backward compatibility.
If omitted, the system falls back to `"default"`.

---

## Authentication

Main files:

- `auth.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `lib/auth/current-user.ts`
- `types/next-auth.d.ts`

Current auth mode:

- email + password via NextAuth credentials provider
- JWT session strategy
- server-side current user lookup

Protected area:

- `app/(protected)/...`

Unauthenticated users are redirected to `/login`.

---

## Projects

Main files:

- `lib/projects.ts`
- `app/(protected)/dashboard/page.tsx`
- `app/(protected)/dashboard/actions.ts`
- `app/(protected)/projects/[projectId]/page.tsx`
- `app/(protected)/projects/[projectId]/actions.ts`

Implemented behavior:

- create project
- generate unique slug
- create matching `project_contents` row with empty content
- load projects only for the current owner
- load single project only for the current owner
- publish and unpublish only for the current owner

Public route:

- `app/p/[slug]/page.tsx`

Only published projects resolve there.

---

## Assets

Main files:

- `lib/assets.ts`
- `lib/storage/*`
- `app/api/projects/[projectId]/assets/route.ts`
- `components/assets/project-assets-panel.tsx`

Implemented behavior:

- project-scoped uploads
- server-side ownership enforcement
- MIME validation
- size validation
- upload to Cloudflare R2
- metadata write to `assets`
- public URL resolution through storage helpers

Supported formats:

- `image/jpeg`
- `image/png`
- `image/webp`

Important rule:

- content stores `assetId`
- content does not store raw storage URLs

---

## Block System

### Current Direction

The old single-file block definition approach has been replaced with a colocated variant-based structure.

Current root:

- `features/blocks/`

Shared files:

- `features/blocks/shared/content.ts`
- `features/blocks/shared/types.ts`
- `features/blocks/shared/base.ts`
- `features/blocks/shared/registry.ts`

Compatibility adapter:

- `lib/editor/blocks.ts`

This adapter re-exports the new block registry so older imports still work.

### Variant Model

Blocks are now resolved by:

- `type`
- `variant`

Current supported types:

- `hero`
- `features`
- `cta`

Current variants:

- `hero/default`
- `hero/centered`
- `features/default`
- `features/cards`
- `cta/default`

### Variant Files

Each variant is colocated and may contain:

- `definition.ts`
- `render.tsx`
- `editor.tsx` when the variant has a custom editor

Examples:

- `features/blocks/hero/default/*`
- `features/blocks/hero/centered/*`
- `features/blocks/features/cards/*`

---

## Renderer Architecture

Public rendering is registry-driven.

Main file:

- `components/projects/project-renderer.tsx`

Behavior:

- route loads published project
- route loads project assets
- content is normalized
- each block is resolved through the block registry
- registry returns the variant `Renderer`

This means block rendering is no longer hardcoded as one large monolithic switch for future growth.

---

## Editor Architecture

Main file:

- `components/editor/project-editor.tsx`

Current role of `ProjectEditor`:

- load block list from `content`
- manage local editor state
- add blocks
- remove blocks
- update block props
- save serialized content through server action

It is no longer responsible for rendering field-level UI directly.

### Editor Layers

The editor now has 3 conceptual layers:

1. `ProjectEditor`
   orchestration and state

2. `BlockChrome`
   reusable shell for block cards

3. `definition.Editor`
   variant-specific editor UI

Shared block shell:

- `features/blocks/shared/block-chrome.tsx`

### Add Block Flow

The add-block UI is two-step:

1. choose block type
2. choose variant

This is driven by the registry, not by hardcoded UI lists.

### Current Editor Implementations

Shared fallback editor:

- `features/blocks/shared/generic-editor.tsx`

Custom variant editors implemented so far:

- `features/blocks/features/cards/editor.tsx`
- `features/blocks/hero/centered/editor.tsx`

Meaning:

- some variants still use `GenericBlockEditor`
- some variants already provide their own editing experience

This is intentional and is the current migration model.

---

## Shared Editor Primitives

Shared editor primitives added so far:

- `features/blocks/shared/asset-picker.tsx`
- `features/blocks/shared/block-chrome.tsx`

### AssetPicker

Purpose:

- reusable media-selection UI for block editors

Currently used by:

- `GenericBlockEditor`
- `HeroCenteredEditor`

What it handles:

- asset list
- selected state
- preview
- select / clear actions
- empty state
- list/grid layout options

### BlockChrome

Purpose:

- reusable block shell inside the project editor

What it handles:

- block card container
- block index label
- block title
- block meta line
- delete action

This keeps `ProjectEditor` cleaner and prepares the system for more block-level actions later.

---

## Content Validation

Main file:

- `lib/editor/content.ts`

Behavior:

- validates that content is an object
- validates that `blocks` is an array
- validates block `id`
- validates supported `type`
- resolves `variant` with default fallback
- normalizes props through the variant definition

This is the bridge between stored JSON and the block registry.

---

## Testing Status

Current automated checks used during the recent refactor:

- `npx eslint ...`
- `npx tsc --noEmit`
- targeted Vitest unit runs

Unit coverage currently verifies:

- content validation
- slug helpers
- public renderer behavior
- variant-aware rendering behavior

Note:

- full `npm test` may fail inside restricted sandbox because `tsx` test-db setup uses IPC pipes
- this is an environment limitation, not currently a known code regression

---

## Current Technical State

The project is now in a transitional but much healthier architecture than before:

- block variants are first-class
- renderer is variant-aware
- editor is variant-aware
- generic UI has started to move into shared primitives
- custom variant editors are possible and already in use

This is no longer a single-registry MVP with one generic form.
It is now a modular block platform with a clear path to richer variants.

---

## Recommended Next Steps

Logical next technical steps from this point:

1. Add block-level actions through `BlockChrome`
   Examples: duplicate, move up, move down, collapse

2. Add more custom variant editors
   Good candidates: `hero/default`, `cta/default`

3. Introduce richer variant metadata
   Examples: thumbnails, recommended use case, editor hints

4. Consider variant switching for existing blocks
   Example: convert `hero/default` to `hero/centered` without deleting/recreating

5. Continue extracting reusable editor primitives where duplication starts to appear

---

## Important Files To Read First

If someone returns to the project later, start here:

- `db/schema.ts`
- `lib/projects.ts`
- `lib/assets.ts`
- `lib/editor/content.ts`
- `components/editor/project-editor.tsx`
- `components/projects/project-renderer.tsx`
- `features/blocks/shared/registry.ts`
- `features/blocks/shared/generic-editor.tsx`
- `features/blocks/shared/asset-picker.tsx`
- `features/blocks/shared/block-chrome.tsx`

Then inspect the active variants:

- `features/blocks/hero/default/definition.ts`
- `features/blocks/hero/centered/definition.ts`
- `features/blocks/features/default/definition.ts`
- `features/blocks/features/cards/definition.ts`
- `features/blocks/cta/default/definition.ts`
