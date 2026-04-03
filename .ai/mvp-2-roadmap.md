# MVP-2 Roadmap

## Purpose

This document describes the recommended next development plan after the current MVP-1 baseline.

It is written from a technical and product-development perspective, with emphasis on:

- continuing the editor/block-system evolution
- improving content quality and UX
- keeping the architecture extensible
- avoiding unnecessary rewrites

The project already has a solid functional core.
The next stage should focus on turning that core into a stronger product and a more scalable implementation.

---

## Current Baseline

What already exists:

- login / logout
- protected dashboard
- project creation
- project editor
- content stored in structured JSON
- publish / unpublish
- public rendering by slug
- asset upload and usage by `assetId`
- variant-aware block system
- colocated block definitions under `features/blocks`
- custom variant editors are now possible and partially implemented

This means MVP-2 should not focus on basic CRUD anymore.
It should focus on usability, flexibility, and architectural leverage.

---

## Main Strategic Goal

The main goal of MVP-2 should be:

**turn the current working prototype into a scalable block platform with a noticeably better editing experience**

In practice, that means:

- better editor ergonomics
- more expressive block variants
- more reusable internal primitives
- safer content evolution
- better public output quality

---

## Recommended Development Order

The safest and most productive order is:

1. Block-level editor actions and workflow improvements
2. More reusable editor primitives
3. More variants and more custom editors
4. Variant switching and content transformation rules
5. Better theme system
6. Better assets workflow
7. Public rendering quality improvements
8. Test expansion and operational hardening

This order matters because it builds on the current architecture rather than fighting it.

---

## Phase 1: Block-Level Editor Actions

### Goal

Make block editing feel like a real page builder instead of a static form list.

### Tasks

- add `Duplicate` action per block
- add `Move up` action per block
- add `Move down` action per block
- optionally add `Collapse / Expand`
- keep these actions inside `BlockChrome`

### Why First

The architecture is already prepared:

- `ProjectEditor` is becoming orchestration-only
- `BlockChrome` now exists

This is the right moment to put block-level behavior there.

### Expected Outcome

- block manipulation becomes much faster
- users no longer need to delete and recreate blocks for ordering mistakes
- `BlockChrome` becomes the central block-shell primitive

---

## Phase 2: Shared Editor Primitives

### Goal

Continue extracting repeated UI logic into reusable editor building blocks.

### Already Done

- `AssetPicker`
- `BlockChrome`

### Next Candidates

- list editor / repeater primitive for arrays of strings or card items
- section header primitive for editor panels
- field group primitive
- variant selector primitive
- block action bar primitive if actions keep growing

### Why This Matters

The project is now at a point where duplication will start growing horizontally across variants.
Shared primitives will keep custom editors fast to build without reintroducing monolithic code.

### Expected Outcome

- faster variant development
- less JSX duplication
- more consistent editor UX

---

## Phase 3: Variant Expansion

### Goal

Make the block system meaningfully richer without exploding complexity.

### Recommendation

Do not add too many block types yet.
Instead, deepen the current ones with stronger variants.

### Suggested Next Variants

Hero:

- `hero/minimal`
- `hero/announcement`
- `hero/with-proof`

Features:

- `features/checklist`
- `features/two-column`
- `features/with-icons`

CTA:

- `cta/banner`
- `cta/split`
- `cta/with-note`

### Rule

Each new variant should justify itself by:

- meaningfully different public rendering
- meaningfully different editing experience

Do not create variants that are only cosmetic renames.

### Expected Outcome

- better content flexibility
- more realistic page composition
- stronger value from the variant-aware system

---

## Phase 4: Variant-Specific Editors

### Goal

Make the editor genuinely variant-aware, not only renderer-aware.

### Current State

Custom editors already exist for:

- `features/cards`
- `hero/centered`

Other variants still use the generic editor fallback.

### Plan

- gradually replace generic editor usage for the most important variants
- keep generic fallback for very simple variants
- use shared primitives where possible

### Good Candidates

- `hero/default`
- `cta/default`
- future `features/checklist`

### Expected Outcome

- editing experience becomes more intentional
- block variants feel like distinct tools, not just different templates

---

## Phase 5: Variant Switching

### Goal

Allow users to change a block variant without deleting and recreating the block.

### Technical Requirement

This should only be done after variant definitions stabilize further.

### Needed Capabilities

- block-level `Change variant` action
- migration / transform logic from one variant props shape to another
- safe fallback when target variant cannot map all fields

### Important Note

Do not do naive variant switching by simply changing `variant` and keeping props unchanged.
That will create broken or incoherent content states.

### Expected Outcome

- much better iteration flow
- users can explore presentation changes without losing content

---

## Phase 6: Theme System Upgrade

### Goal

Turn `themeKey` from a passive field into a real visual system.

### Current State

- `themeKey` exists
- renderer currently has minimal theme branching

### Plan

- define real theme tokens
- move theme data into a proper registry
- make blocks consume shared theme tokens
- add a few clearly differentiated themes

### Suggested Deliverables

- `classic-light`
- one bold editorial theme
- one minimal startup/product theme

### Expected Outcome

- public pages stop feeling like the same layout with small differences
- themes become a product feature, not just a field in the DB

---

## Phase 7: Assets Workflow Improvement

### Goal

Improve usability of assets inside the editor.

### Current State

- upload works
- selection works
- public rendering works

### Recommended Improvements

- asset alt editing
- asset rename / label editing
- asset delete flow with safety checks
- better asset panel filtering / ordering
- more contextual asset usage in variant editors

### Important Constraint

Keep assets project-scoped for now.
Do not jump to cross-project media library too early.

### Expected Outcome

- asset usage becomes less technical and more editorial

---

## Phase 8: Public Rendering Quality

### Goal

Improve the quality of generated pages, not only the flexibility of the editor.

### Recommended Areas

- stronger spacing rhythm
- better typography hierarchy
- more intentional section composition
- smarter empty-state rendering for partially filled blocks
- more robust visual behavior with and without assets

### Why This Matters

A builder is only as good as the output it produces.
Editor capability without strong output quality leads to weak pages.

### Expected Outcome

- better perceived product quality
- better alignment between editor effort and rendered result

---

## Phase 9: Editor Persistence and UX Polish

### Goal

Reduce friction in day-to-day editing.

### Suggested Improvements

- dirty state indicator
- autosave or semi-autosave strategy
- save feedback improvements
- restore scroll/focus after save if needed
- more intentional empty states
- maybe inline preview hints per variant

### Caution

Do not add autosave casually.
It should be introduced only when content updates and server actions are well behaved.

### Expected Outcome

- editor feels less fragile
- less manual save anxiety

---

## Phase 10: Testing Expansion

### Goal

Make the new block architecture safer to evolve.

### Recommended Additions

- unit tests for registry behavior
- unit tests for custom variant editors where logic is non-trivial
- integration tests for variant persistence
- tests for duplicate / reorder once added
- tests for future variant switching

### Why This Matters

The old architecture was simple enough to reason about manually.
The new one is stronger, but also more compositional.
That makes automated coverage more important.

---

## Phase 11: Operational Hardening

### Goal

Reduce friction in deployment and environment management.

### Recommended Work

- document local/dev/prod env expectations more explicitly
- improve deployment documentation
- make test DB setup more robust
- reduce sandbox-sensitive test setup assumptions if possible
- optionally add more explicit health/readiness checks

### Expected Outcome

- easier continuation after pauses
- fewer environment-specific surprises

---

## Things I Would Avoid For Now

These are tempting, but premature at the current stage:

- multi-page sites
- custom domains
- collaborative editing
- rich animation system
- deep SEO feature set
- cross-project media library
- plugin ecosystem
- arbitrary layout freedom

These can wait until the editor and output quality are much more mature.

---

## Suggested MVP-2 Definition of Done

I would consider MVP-2 successful if the project reaches this state:

- block editor supports duplicate and reorder
- several variants have custom editors
- variant switching is at least designed or partially implemented safely
- theme system is more real and visible
- assets workflow is less raw
- public output quality is visibly stronger
- block architecture remains clean and extensible

---

## Best Immediate Next Steps

If continuing from the current codebase, I would do these next:

1. Add `Duplicate`, `Move up`, and `Move down` to `BlockChrome`
2. Build one more shared primitive for repeated list editing
3. Add another custom variant editor, likely `hero/default`
4. Add one more strong CTA variant
5. Start a proper theme registry

That sequence keeps momentum while continuing the architectural cleanup already underway.
