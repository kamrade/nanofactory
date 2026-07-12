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

async function setHeadingFont(page: Page, nextFontLabel: string) {
  const controlsSheet = await openProjectControls(page);
  const select = controlsSheet.getByRole("combobox", { name: "Heading font" });
  await expect(select).toBeVisible();
  await select.evaluate((node) => {
    (node as HTMLButtonElement).click();
  });
  await page.getByRole("option", { name: nextFontLabel }).click();
  await expect(select).toContainText(nextFontLabel);
  await page.waitForTimeout(750);
}

test("changes heading font and persists it after reload", async ({ page }) => {
  await createProjectFromDashboard(page, "Heading Font Project");
  await page.waitForURL(/\/projects\/.+/);

  await setHeadingFont(page, "Playfair Display");

  const projectRoot = page.locator("main[data-theme]").first();
  await expect(projectRoot).toHaveAttribute("data-heading-font", "playfair-display");

  await page.reload();

  const controlsSheet = await openProjectControls(page);
  await expect(
    controlsSheet.getByRole("combobox", { name: "Heading font" })
  ).toContainText("Playfair Display");
  await expect(page.locator("main[data-theme]").first()).toHaveAttribute(
    "data-heading-font",
    "playfair-display"
  );
});
