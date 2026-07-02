import { expect, test, type Page } from "@playwright/test";

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

async function createProjectFromDashboard(page: Page, name: string) {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Create project" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Project name").fill(name);
  await dialog.getByRole("button", { name: "Create project" }).click();
}

async function ensureBlockEditorClosed(page: Page) {
  const blockEditor = page.getByRole("dialog", { name: "Block editor" });
  if (await blockEditor.isVisible()) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);

    if (await blockEditor.isVisible()) {
      const closeButton = blockEditor.getByRole("button", { name: "Close" }).first();
      if ((await closeButton.count()) > 0) {
        await closeButton.click({ force: true });
        await page.waitForTimeout(100);
      }
    }
  }
}

async function openProjectControls(page: Page) {
  const controlsSheet = page
    .locator('[role="dialog"]')
    .filter({ has: page.getByTestId("project-publish-status") });
  if (!(await controlsSheet.isVisible())) {
    await page.getByRole("button", { name: "Settings" }).click();
  }
  await expect(controlsSheet).toBeVisible();
  return controlsSheet;
}

async function saveProject(page: Page) {
  await ensureBlockEditorClosed(page);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Project content saved.")).toBeVisible();
}

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
  await createProjectFromDashboard(page, "Playwright Project");

  await page.waitForURL(/\/projects\/.+/);
  const infoSheet = await openProjectControls(page);
  await expect(infoSheet).toBeVisible();
  await expect(infoSheet.getByTestId("project-publish-status")).toHaveText("draft");
});

test("adds a block, saves content, and reloads the editor state", async ({ page }) => {
  await createProjectFromDashboard(page, "Editor Save Project");

  await page.waitForURL(/\/projects\/.+/);
  await page.getByRole("button", { name: "Add block" }).click();
  await page.getByRole("menuitem", { name: /Split image/i }).click();
  await page.getByLabel("Title", { exact: true }).fill("Saved Hero Title");
  await page.getByRole("textbox", { name: "Subtitle" }).fill(
    "Saved hero subtitle from Playwright."
  );
  await page.getByLabel("Button text", { exact: true }).fill("Launch");
  await saveProject(page);
  await page.reload();
  await page.getByTestId("Variant").first().click();

  await expect(page.getByLabel("Title", { exact: true })).toHaveValue("Saved Hero Title");
  await expect(page.getByRole("textbox", { name: "Subtitle" })).toHaveValue(
    "Saved hero subtitle from Playwright."
  );
  await expect(page.getByLabel("Button text", { exact: true })).toHaveValue("Launch");
});

test("publishes and unpublishes a project through the editor", async ({ page }) => {
  await createProjectFromDashboard(page, "Public Flow Project");

  await page.waitForURL(/\/projects\/.+/);
  let infoSheet = await openProjectControls(page);
  await expect(infoSheet).toBeVisible();
  await expect(infoSheet.getByTestId("project-publish-status")).toHaveText("draft");

  await infoSheet.getByTestId("project-publish-button").evaluate((button) => {
    (button as HTMLButtonElement).click();
  });
  await page.waitForURL(/\/projects\/.+/);
  infoSheet = await openProjectControls(page);
  await expect(infoSheet.getByTestId("project-publish-status")).toHaveText("published");

  const publicLink = page
    .getByTestId("project-settings")
    .getByRole("link", { name: "Open public page" });
  await expect(publicLink).toBeVisible();
  const publicUrl = await publicLink.getAttribute("href");

  if (!publicUrl) {
    throw new Error("Public URL was not generated");
  }

  await page.goto(publicUrl);
  await expect(page.getByTestId("project-mode-container")).toBeVisible();

  await page.goto("/dashboard");
  await page.getByRole("link", { name: "Open" }).first().click();
  infoSheet = await openProjectControls(page);
  await infoSheet.getByTestId("project-unpublish-button").evaluate((button) => {
    (button as HTMLButtonElement).click();
  });
  await page.waitForURL(/\/projects\/.+/);
  infoSheet = await openProjectControls(page);
  await expect(infoSheet.getByTestId("project-publish-status")).toHaveText("draft");

  await page.goto(publicUrl);
  await expect(page.getByText("This page could not be found.")).toBeVisible();
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
