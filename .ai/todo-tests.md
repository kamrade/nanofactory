# Test Backlog

## Closed First-Priority Gaps

These five highest-value gaps are already covered:

1. Editor save flow success path
2. Editor save flow `AssetUploadError` path
3. Asset upload route success path
4. Asset upload route `AssetUploadError` path
5. Project editor variant switch/undo logic

---

## Next Priority

### 1. Remaining server action paths

Files:

- `app/(protected)/projects/[projectId]/actions.ts`
- `app/(protected)/dashboard/actions.ts`

Recommended tests:

- `saveProjectContent...` returns error for invalid JSON
- `saveProjectContent...` returns error when project is not found
- `publishProjectAction` success path
- `publishProjectAction` null path redirects to dashboard
- `unpublishProjectAction` success path
- `unpublishProjectAction` null path redirects to dashboard
- `createProjectAction` trims project name
- `createProjectAction` throws on empty name

Reason:

- This layer orchestrates auth, validation, persistence, redirect, and revalidation. It is still one of the most failure-prone parts of the app.

### 2. Remaining asset route HTTP branches

File:

- `app/api/projects/[projectId]/assets/route.ts`

Recommended tests:

- `POST` without file returns `400`
- `POST` without session returns `401`
- `GET` without session returns `401`
- `GET` success path returns assets
- `POST` handles `NoSuchBucket`
- `POST` handles `AccessDenied`
- `POST` handles generic `500` in development
- `POST` hides generic error in production

Reason:

- The main success/error asset flows are covered, but the HTTP boundary is not complete yet.

### 3. Auth coverage

Files:

- `auth.ts`
- `lib/auth/current-user.ts`

Recommended tests:

- `authorize` returns `null` for empty credentials
- `authorize` returns `null` for unknown user
- `authorize` returns `null` for wrong password
- `authorize` returns user for valid credentials
- `jwt` callback stores `token.id`
- `session` callback stores `session.user.id`
- `getCurrentUser` returns `null` without session user id
- `requireCurrentUser` redirects to `/login`

Reason:

- Auth is foundational for all protected flows and still lacks direct unit coverage.

---

## Second Priority

### 4. Preview flow

Files:

- `components/editor/open-preview-button.tsx`
- `app/(protected)/projects/[projectId]/preview/page.tsx`

Recommended tests:

- Open preview without draft content
- Open preview with draft content
- Preview action error path
- Expired draft falls back to saved content
- Draft from another user or project is ignored

Reason:

- Preview is a separate user workflow and is only partially covered right now.

### 5. Storage config and service

Files:

- `lib/storage/config.ts`
- `lib/storage/service.ts`
- `lib/assets.ts`

Recommended tests:

- Missing env variables throw
- Invalid URL throws
- Default endpoint is derived from account id
- `putObject` builds the expected command
- `deleteObject` builds the expected command
- Asset upload cleanup runs when DB write fails after upload

Reason:

- These tests improve infrastructure reliability rather than core product flow coverage.

### 6. Block registry and base helpers

Files:

- `features/blocks/shared/registry.ts`
- `features/blocks/shared/base.ts`

Recommended tests:

- `getBlockDefinition`
- `getBlockTypes`
- `getBlockVariants`
- `createPageBlock`
- `readOptionalString`
- `readStringList`
- `createBlockId`

Reason:

- Cheap, stable tests that harden the block system internals.

---

## Lower Priority

### 7. Small client components

Files:

- `components/assets/project-assets-panel.tsx`
- `components/auth/login-form.tsx`
- `components/auth/logout-button.tsx`

Recommended tests:

- Asset panel upload success/error states
- Login invalid credentials path
- Login success path
- Login respects `callbackUrl`
- Logout calls `signOut`

Reason:

- Useful coverage, but lower risk than server flows, auth core, and preview logic.

---

## Suggested Next Sequence

1. Finish remaining tests for `app/(protected)/projects/[projectId]/actions.ts`
2. Finish remaining tests for `app/api/projects/[projectId]/assets/route.ts`
3. Add auth tests for `auth.ts` and `lib/auth/current-user.ts`
