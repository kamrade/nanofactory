import { expect, test } from "@playwright/test";

import {
  resetTestDatabase,
  seedProject,
  seedTestUser,
  seedUser,
} from "../../scripts/test-db-utils";
import { TEST_USER } from "../../db/seeds/test-data";

test.describe.configure({ mode: "serial" });

test.beforeEach(async () => {
  await resetTestDatabase();
  seedTestUser();
});

test("redirects guests from dashboard to login", async ({ page }) => {
  await page.context().clearCookies();
  await page.goto("/dashboard");

  await page.waitForURL("**/login");
  await expect(page.getByRole("heading", { name: "Sign in to your workspace" })).toBeVisible();
});

test("shows a clear error for invalid credentials", async ({ page }) => {
  await page.context().clearCookies();
  await page.goto("/login");
  await page.getByLabel("Email").fill(TEST_USER.email);
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL("**/login");
  await expect(page.getByText("Invalid email or password.")).toBeVisible();
});

test("logs in and redirects an authenticated user away from login", async ({ page }) => {
  await page.goto("/login");
  await page.waitForURL("**/dashboard");
  await expect(page.getByText(`Signed in as ${TEST_USER.email}`)).toBeVisible();
});

test("creates a project from dashboard and opens it", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByLabel("Project name").fill("Playwright Project");
  await page.getByRole("button", { name: "Create project" }).click();

  await page.waitForURL(/\/projects\/.+/);
  await expect(page.getByRole("heading", { name: "Playwright Project" })).toBeVisible();
  await expect(page.getByText("Slug: playwright-project").first()).toBeVisible();
});

test("adds a block, saves content, and reloads the editor state", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByLabel("Project name").fill("Editor Save Project");
  await page.getByRole("button", { name: "Create project" }).click();

  await page.waitForURL(/\/projects\/.+/);
  await page.getByRole("button", { name: "Add block" }).click();
  await page.getByRole("button", { name: "Hero Choose variant" }).click();
  await page.getByRole("button", { name: "Split image" }).click();
  await page.getByLabel("Title", { exact: true }).fill("Saved Hero Title");
  await page.getByRole("textbox", { name: "Subtitle" }).fill(
    "Saved hero subtitle from Playwright."
  );
  await page.getByLabel("Button text", { exact: true }).fill("Launch");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Project content saved.")).toBeVisible();
  await page.reload();

  await expect(page.getByLabel("Title", { exact: true })).toHaveValue("Saved Hero Title");
  await expect(page.getByRole("textbox", { name: "Subtitle" })).toHaveValue(
    "Saved hero subtitle from Playwright."
  );
  await expect(page.getByLabel("Button text", { exact: true })).toHaveValue("Launch");
});

test("publishes and unpublishes a project through the editor", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByLabel("Project name").fill("Public Flow Project");
  await page.getByRole("button", { name: "Create project" }).click();

  await page.waitForURL(/\/projects\/.+/);
  await expect(page.getByText("Status: draft").first()).toBeVisible();

  await page.getByRole("button", { name: "Publish" }).click();
  await page.waitForURL(/\/projects\/.+/);
  await expect(page.getByText("Status: published").first()).toBeVisible();

  const publicLink = page.getByRole("link", { name: "Open public page" });
  await expect(publicLink).toBeVisible();
  const publicUrl = await publicLink.getAttribute("href");

  if (!publicUrl) {
    throw new Error("Public URL was not generated");
  }

  await page.goto(publicUrl);
  await expect(page.getByText("Published with Nanofactory")).toBeVisible();

  await page.goto("/dashboard");
  await page.getByRole("link", { name: "Open" }).first().click();
  await page.getByRole("button", { name: "Unpublish" }).click();
  await page.waitForURL(/\/projects\/.+/);
  await expect(page.getByText("Status: draft").first()).toBeVisible();

  await page.goto(publicUrl);
  await expect(page.getByText("This page could not be found.")).toBeVisible();
});

test("applies selected theme in preview before save and persists after apply", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await page.getByLabel("Project name").fill("Theme Preview Project");
  await page.getByRole("button", { name: "Create project" }).click();

  await page.waitForURL(/\/projects\/.+/);
  await page.locator('select[name="themeKey"]').selectOption("nightfall");
  await expect(page.getByText("Theme: sunwash").first()).toBeVisible();

  const previewPopupBeforeSavePromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Open preview" }).click();
  const previewPopupBeforeSave = await previewPopupBeforeSavePromise;

  await previewPopupBeforeSave.waitForLoadState("domcontentloaded");
  await expect(previewPopupBeforeSave).toHaveURL(/theme=nightfall/);
  await expect(previewPopupBeforeSave.locator('main[data-theme="nightfall"]')).toBeVisible();
  await expect(previewPopupBeforeSave.getByText("Theme preview: nightfall.")).toBeVisible();
  await previewPopupBeforeSave.close();

  await expect(page.getByText("Theme: sunwash").first()).toBeVisible();
  await page.getByRole("button", { name: "Apply theme" }).click();
  await page.waitForURL(/\/projects\/.+/);
  await expect(page.getByText("Theme: nightfall").first()).toBeVisible();

  const previewPopupAfterSavePromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Open preview" }).click();
  const previewPopupAfterSave = await previewPopupAfterSavePromise;

  await previewPopupAfterSave.waitForLoadState("domcontentloaded");
  await expect(previewPopupAfterSave.locator('main[data-theme="nightfall"]')).toBeVisible();
  await expect(previewPopupAfterSave.getByText("Theme: nightfall.")).toBeVisible();
  await previewPopupAfterSave.close();
});

test("switches preview mode between light and dark", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByLabel("Project name").fill("Mode Switch Project");
  await page.getByRole("button", { name: "Create project" }).click();

  await page.waitForURL(/\/projects\/.+/);

  const previewPopupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Open preview" }).click();
  const previewPopup = await previewPopupPromise;

  await previewPopup.waitForLoadState("domcontentloaded");
  await expect(previewPopup.locator('main[data-mode="light"]')).toBeVisible();

  await previewPopup.getByRole("button", { name: "Dark" }).click();
  await expect(previewPopup.locator('main[data-mode="dark"]')).toBeVisible();

  await previewPopup.getByRole("button", { name: "Light" }).click();
  await expect(previewPopup.locator('main[data-mode="light"]')).toBeVisible();
  await previewPopup.close();
});

test("does not show or open projects owned by another user", async ({ page }) => {
  const otherUser = await seedUser({
    email: "other.user@nanofactory.local",
    displayName: "Other User",
  });
  const otherProject = await seedProject({
    userId: otherUser.id,
    name: "Other User Project",
    slug: "other-user-project",
  });

  await page.goto("/dashboard");
  await expect(page.getByText("Other User Project")).toHaveCount(0);

  await page.goto(`/projects/${otherProject.id}`);
  await expect(page).toHaveTitle(/404|Nanofactory/);
  await expect(page.getByText("This page could not be found.")).toBeVisible();
});

test("logs out and loses access to dashboard", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Log out" }).click();

  await page.waitForURL("**/login");
  await page.goto("/dashboard");
  await page.waitForURL("**/login");
});
