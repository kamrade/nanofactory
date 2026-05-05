import { expect, test, type Page } from "@playwright/test";

import { resetTestDatabase, seedTestUser } from "../../scripts/test-db-utils";

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
  await page.waitForURL(/\/projects\/.+/);
}

async function openPreviewFromInfoSheet(page: Page) {
  await page.getByRole("button", { name: "Info" }).click();
  const infoSheet = page.getByRole("dialog", { name: "Project info" });
  await expect(infoSheet).toBeVisible();

  const popupPromise = page.waitForEvent("popup");
  await infoSheet.getByRole("button", { name: "Open preview" }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState("domcontentloaded");
  return popup;
}

test("keeps mode in preview URL while switching", async ({ page }) => {
  await createProjectFromDashboard(page, "Preview URL Mode Project");

  const previewPopup = await openPreviewFromInfoSheet(page);
  await expect(previewPopup).toHaveURL(/mode=light/);
  await expect(previewPopup.locator('main[data-mode="light"]')).toBeVisible();

  await previewPopup.getByRole("radio", { name: "Dark" }).click();
  await expect(previewPopup).toHaveURL(/mode=dark/);
  await expect(previewPopup.locator('main[data-mode="dark"]')).toBeVisible();

  await previewPopup.getByRole("radio", { name: "Light" }).click();
  await expect(previewPopup).toHaveURL(/mode=light/);
  await expect(previewPopup.locator('main[data-mode="light"]')).toBeVisible();
  await previewPopup.close();
});

test("restores selected preview mode after popup reload", async ({ page }) => {
  await createProjectFromDashboard(page, "Preview Reload Mode Project");

  const previewPopup = await openPreviewFromInfoSheet(page);
  await previewPopup.getByRole("radio", { name: "Dark" }).click();
  await expect(previewPopup).toHaveURL(/mode=dark/);
  await expect(previewPopup.locator('main[data-mode="dark"]')).toBeVisible();

  await previewPopup.reload();
  await previewPopup.waitForLoadState("domcontentloaded");
  await expect(previewPopup).toHaveURL(/mode=dark/);
  await expect(previewPopup.locator('main[data-mode="dark"]')).toBeVisible();
  await previewPopup.close();
});

