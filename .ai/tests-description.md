# Tests Description

## Test Types In This Project

### Unit tests

Location:

- `tests/unit/*`

Purpose:

- Check isolated logic without a real browser and usually without a real database transaction flow.
- Focus on helpers, validation, route/action helpers with injected dependencies, rendering helpers, and editor logic.

### Integration tests

Location:

- `tests/integration/*`

Purpose:

- Check application behavior against the test database and real domain modules.
- Focus on ownership rules, persistence, publication flow, asset scoping, and project queries.

### End-to-end tests

Location:

- `tests/e2e/*`

Purpose:

- Check the real browser flow through UI screens and routes.
- Focus on login, dashboard access, project creation, editor save flow, publication flow, and logout behavior.

### Test helpers

Location:

- `tests/helpers/*`
- `tests/e2e/.auth/user.json`

Purpose:

- Provide environment setup, DB utilities, auth state, and test-only server stubs used by the main test suites.

---

## Unit Tests

### `tests/unit/assets-route.test.ts`

What it covers:

- `postAssetWithDependencies(...)` success path.
- `postAssetWithDependencies(...)` `AssetUploadError` path.

What each test does:

- Verifies that a successful upload returns HTTP `201` with the created asset payload.
- Verifies that `AssetUploadError` is converted into the correct HTTP status and `{ error }` JSON response.

### `tests/unit/assets.test.ts`

What it covers:

- `validateAssetFile(...)` in `lib/assets.ts`

What each test does:

- Rejects unsupported MIME types such as SVG.
- Accepts a valid image file and returns normalized file metadata such as filename, MIME type, extension, and size.

### `tests/unit/page-content.test.ts`

What it covers:

- `validatePageContent(...)`
- `parsePageContentJson(...)`

What each test does:

- Accepts supported block types and normalizes their props.
- Preserves `imageAssetId` for hero blocks.
- Accepts supported hero variants.
- Accepts supported features variants.
- Rejects unsupported block types.
- Rejects invalid JSON payloads.

### `tests/unit/preview-draft-action.test.ts`

What it covers:

- `createProjectPreviewDraftForUserWithDependencies(...)` in `lib/project-preview.ts`

What each test does:

- Returns an error for invalid JSON.
- Returns an error when the project does not exist.
- Creates a preview draft when content is valid.
- Returns an error when hero asset validation fails.

### `tests/unit/preview-drafts.test.ts`

What it covers:

- `createPreviewDraft(...)`
- `getPreviewDraft(...)`

What each test does:

- Confirms that preview drafts can be created and loaded before expiry.
- Confirms that expired drafts are removed and no longer returned.

### `tests/unit/project-actions.test.ts`

What it covers:

- `saveProjectContentForUserWithDependencies(...)` in `app/(protected)/projects/[projectId]/actions.ts`

What each test does:

- Verifies successful content save flow, including asset validation, persistence, and revalidation of project paths.
- Verifies that `AssetUploadError` is converted into an editor error result and stops save/revalidation.

### `tests/unit/project-editor-variants.test.ts`

What it covers:

- Variant switch helper logic used by `ProjectEditor`

What each test does:

- Verifies that variant switching detects fields that would be lost.
- Verifies that applying a switch removes incompatible props.
- Verifies that undo restores the original block content.

### `tests/unit/project-renderer.test.ts`

What it covers:

- `ProjectRenderer`

What each test does:

- Renders a hero image when the referenced asset exists.
- Skips the image cleanly when the referenced asset does not exist.
- Renders a hero variant-aware block.
- Renders a features cards variant.

### `tests/unit/project-slug.test.ts`

What it covers:

- `slugifyProjectName(...)`
- `buildProjectSlugCandidate(...)`

What each test does:

- Converts a regular project name into a slug.
- Collapses spaces and symbols into a URL-safe slug.
- Falls back to `project` when no valid slug characters exist.
- Builds deterministic duplicate slug suffixes.

### `tests/unit/storage.test.ts`

What it covers:

- `buildStorageKey(...)`
- `buildPublicAssetUrl(...)`

What each test does:

- Builds a project-scoped storage key with normalized extension formatting.
- Builds a public asset URL from configured storage environment values.

---

## Integration Tests

### `tests/integration/assets.test.ts`

What it covers:

- Asset metadata creation and ownership-scoped retrieval.

What each test does:

- Confirms that asset metadata is created and visible only to the owning user.
- Confirms that public asset resolution returns only assets belonging to the requested project.

### `tests/integration/project-content.test.ts`

What it covers:

- Project content persistence and hero asset ownership validation.

What each test does:

- Saves `content_json` for the project owner and reloads it from the database.
- Returns `null` when another user tries to save project content.
- Confirms that `imageAssetId` is accepted only for assets belonging to the same project.

### `tests/integration/project-publication.test.ts`

What it covers:

- Publication and unpublication behavior.
- Public slug resolution.
- Published renderer asset scoping.

What each test does:

- Publishes a project and exposes it by slug.
- Unpublishes a project and removes it from the public route.
- Prevents other users from publishing or unpublishing a project.
- Renders a published hero image only from assets belonging to the current project.

### `tests/integration/projects.test.ts`

What it covers:

- Project creation, ownership filtering, slug uniqueness, and guarded access.

What each test does:

- Returns only projects owned by the current user.
- Creates a project together with its `project_contents` record.
- Creates predictable unique slugs for duplicate names.
- Returns `null` for foreign or invalid project access.

---

## End-To-End Tests

### `tests/e2e/auth.setup.ts`

What it covers:

- Playwright setup flow for authenticated state.

What it does:

- Resets the test database.
- Seeds the test user.
- Signs in through the real login page.
- Saves authenticated browser state to `tests/e2e/.auth/user.json`.

### `tests/e2e/auth-dashboard.spec.ts`

What it covers:

- Real browser behavior for auth, dashboard, editor basics, publication flow, and logout.

What each test does:

- Redirects guests from `/dashboard` to `/login`.
- Shows an error for invalid credentials.
- Redirects authenticated users away from `/login` to `/dashboard`.
- Creates a project from the dashboard and opens it.
- Adds a block, saves content, reloads the page, and verifies persisted editor values.
- Publishes and unpublishes a project through the editor and verifies public page visibility.
- Prevents viewing another user’s project in the dashboard or direct project URL.
- Logs out and confirms dashboard access is lost.

---

## Test Helpers And Support Files

### `tests/helpers/setup-env.ts`

What it does:

- Loads `.env.test` for test runs.

### `tests/helpers/server-only.ts`

What it does:

- Provides a test-safe replacement for `server-only` imports.

### `tests/helpers/db.ts`

What it does:

- Provides helper utilities for test database reset, connection shutdown, seeded users, and project seeding.

### `tests/helpers/auth.ts`

What it does:

- Provides auth-related helper utilities for tests.

### `tests/e2e/.auth/user.json`

What it does:

- Stores Playwright authenticated session state created by `tests/e2e/auth.setup.ts`.
