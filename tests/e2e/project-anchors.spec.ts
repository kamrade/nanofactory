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

async function addBlock(page: Page, descriptionText: string) {
  const blocks = page.getByTestId("Variant");
  const beforeCount = await blocks.count();
  await page.getByRole("button", { name: "Add block" }).click();
  await page.locator('[role="menuitem"]').filter({ hasText: descriptionText }).first().click();
  await expect(blocks).toHaveCount(beforeCount + 1);
}

async function closeBlockEditor(page: Page) {
  const editorSheet = page.getByRole("dialog", { name: "Block editor" });
  const closeButton = editorSheet.getByRole("button", { name: "Close" });
  await closeButton.scrollIntoViewIfNeeded();
  await closeButton.click({ force: true });
  const sheetRoot = editorSheet
    .locator("xpath=ancestor::div[contains(@class,'fixed inset-0 z-50')]")
    .first();
  await expect(sheetRoot).toHaveClass(/pointer-events-none/);
}

async function ensureBlockEditorClosed(page: Page) {
  const editorSheet = page.getByRole("dialog", { name: "Block editor" });
  if (await editorSheet.isVisible()) {
    await closeBlockEditor(page);
  }
}

test("app header and hero can target auto-generated anchors", async ({ page }) => {
  await createProjectFromDashboard(page, "Auto Anchors Project");

  await addBlock(page, "Basic App Header block template.");
  await addBlock(page, "Two-column hero with content on the left and image on the right.");
  await addBlock(page, "Simple stacked list of supporting points.");
  await ensureBlockEditorClosed(page);

  await page.getByRole("button", { name: /Edit block .*App Header/i }).first().click();
  const appHeaderEditorSheet = page.getByRole("dialog", { name: "Block editor" });
  const menuSection = appHeaderEditorSheet
    .locator("div")
    .filter({ hasText: "Center: Menu" })
    .first();
  await menuSection.getByPlaceholder("Menu label").first().fill("Features");
  await menuSection.getByRole("combobox", { name: "Anchor id" }).click();
  await page.getByRole("option", { name: /features-/i }).first().click();
  await menuSection.getByRole("button", { name: "Add item" }).click();
  await closeBlockEditor(page);

  const heroEditButton = page.getByRole("button", { name: /Edit block .*Hero/i }).first();
  await heroEditButton.scrollIntoViewIfNeeded();
  await heroEditButton.click({ force: true });
  const heroEditorSheet = page.getByRole("dialog", { name: "Block editor" });
  await heroEditorSheet.getByRole("combobox", { name: "Hero button anchor" }).click();
  await page.getByRole("option", { name: /features-/i }).first().click();
  await closeBlockEditor(page);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Project content saved.")).toBeVisible();

  await page.getByRole("button", { name: "Info" }).click();
  const infoSheet = page.getByRole("dialog", { name: "Project info" });
  await infoSheet.getByRole("button", { name: "Publish" }).click();
  await page.waitForURL(/\/projects\/.+/);

  await page.getByRole("button", { name: "Info" }).click();
  const publishedInfoSheet = page.getByRole("dialog", { name: "Project info" });
  const publicLink = publishedInfoSheet.getByRole("link", { name: "Open public page" });
  await expect(publicLink).toBeVisible();
  const publicUrl = await publicLink.getAttribute("href");
  if (!publicUrl) {
    throw new Error("Public URL was not generated");
  }

  await page.goto(publicUrl);

  await page.getByRole("link", { name: "Features" }).first().click();
  await expect(page).toHaveURL(/#features-1$/);

  await page.getByRole("link", { name: "Start now" }).first().click();
  await expect(page).toHaveURL(/#features-1$/);
});
