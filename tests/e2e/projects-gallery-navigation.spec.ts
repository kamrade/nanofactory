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

async function addBlock(page: Page, descriptionText: string) {
  await ensureBlockEditorClosed(page);
  await page.getByRole("button", { name: "Add block" }).click();
  await page.locator('[role="menuitem"]').filter({ hasText: descriptionText }).first().click();
}

async function publishProject(page: Page) {
  await ensureBlockEditorClosed(page);
  await page.getByRole("button", { name: "Info" }).click();
  const infoSheet = page.getByRole("dialog", { name: "Project info" });
  await expect(infoSheet).toBeVisible();
  await infoSheet.getByRole("button", { name: "Publish" }).click();
  await page.waitForURL(/\/projects\/.+/);
}

async function getPublicUrl(page: Page) {
  await ensureBlockEditorClosed(page);
  await page.getByRole("button", { name: "Info" }).click();
  const infoSheet = page.getByRole("dialog", { name: "Project info" });
  await expect(infoSheet).toBeVisible();
  const publicLink = infoSheet.getByRole("link", { name: "Open public page" });
  await expect(publicLink).toBeVisible();
  const href = await publicLink.getAttribute("href");
  if (!href) {
    throw new Error("Public URL was not generated");
  }
  return href;
}

async function openPublishedProjectsGalleryPage(
  page: Page,
  projectName: string,
  extraQuery?: string
) {
  await createProjectFromDashboard(page, projectName);
  await addBlock(page, "Projects gallery with nested per-project image galleries.");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Project content saved.")).toBeVisible();

  await publishProject(page);
  const publicUrl = await getPublicUrl(page);
  const targetUrl = extraQuery
    ? `${publicUrl}${publicUrl.includes("?") ? "&" : "?"}${extraQuery}`
    : publicUrl;
  await page.goto(targetUrl);
}

test("projects gallery supports project detail and nested image detail navigation", async ({
  page,
}) => {
  await openPublishedProjectsGalleryPage(page, "Projects Gallery Navigation");

  const firstProjectLink = page
    .locator('article a[href*="/project-1/gallery-1"]')
    .first();
  await expect(firstProjectLink).toBeVisible();
  await firstProjectLink.click();

  await expect(page).toHaveURL(/\/project-1\/gallery-1(?:\?mode=(?:light|dark))?$/);
  await expect(page.getByRole("heading", { name: "Project 1" })).toBeVisible();
  await expect(page.getByTestId("projects-gallery-entry-count")).toHaveText("2 items");

  const firstImageLink = page.locator('article a[href*="/project-1/gallery-1/"]').first();
  await expect(firstImageLink).toBeVisible();
  await firstImageLink.click();

  await expect(page).toHaveURL(/\/project-1\/gallery-1\/project-1-gallery-1-item-1(?:\?mode=(?:light|dark))?$/);
  await expect(page.getByTestId("projects-gallery-entry-counter")).toHaveText("Item 1 of 2");
  await expect(page.getByTestId("projects-gallery-entry-nav-previous")).toHaveCount(0);
  await expect(page.getByTestId("projects-gallery-entry-nav-next")).toHaveCount(1);

  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/\/project-1\/gallery-1\/project-1-gallery-1-item-2(?:\?mode=(?:light|dark))?$/);
  await expect(page.getByTestId("projects-gallery-entry-counter")).toHaveText("Item 2 of 2");
  await expect(page.getByTestId("projects-gallery-entry-nav-previous")).toHaveCount(1);
  await expect(page.getByTestId("projects-gallery-entry-nav-next")).toHaveCount(0);

  await page.getByTestId("projects-gallery-entry-back-link").click();
  await expect(page).toHaveURL(/\/project-1\/gallery-1(?:\?mode=(?:light|dark))?$/);
});

test("projects gallery preserves dark mode in nested routes", async ({ page }) => {
  await openPublishedProjectsGalleryPage(page, "Projects Gallery Mode", "mode=dark");
  await expect(page.getByTestId("project-mode-container")).toHaveAttribute("data-mode", "dark");

  const firstProjectLink = page
    .locator('article a[href*="/project-1/gallery-1"]')
    .first();
  await expect(firstProjectLink).toBeVisible();
  await firstProjectLink.click();

  await expect(page.getByTestId("projects-gallery-mode-container")).toHaveAttribute("data-mode", "dark");
  await expect(page).toHaveURL(/mode=dark/);

  const firstImageLink = page.locator('article a[href*="/project-1/gallery-1/"]').first();
  await expect(firstImageLink).toBeVisible();
  await firstImageLink.click();

  await expect(page.getByTestId("projects-gallery-entry-mode-container")).toHaveAttribute("data-mode", "dark");
  await expect(page).toHaveURL(/mode=dark/);
});

test("projects gallery supports markdown nested items with full-width preview and detail render", async ({
  page,
}) => {
  await createProjectFromDashboard(page, "Projects Gallery Markdown Item");
  await addBlock(page, "Projects gallery with nested per-project image galleries.");

  await page.getByRole("button", { name: "Add markdown" }).first().click();
  await page
    .getByPlaceholder("Markdown for this nested item")
    .first()
    .fill("## Markdown block\n\n- first point\n- second point");

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Project content saved.")).toBeVisible();

  await publishProject(page);
  const publicUrl = await getPublicUrl(page);
  await page.goto(publicUrl);

  const firstProjectLink = page
    .locator('article a[href*="/project-1/gallery-1"]')
    .first();
  await expect(firstProjectLink).toBeVisible();
  await firstProjectLink.click();

  await expect(page).toHaveURL(/\/project-1\/gallery-1(?:\?mode=(?:light|dark))?$/);
  await expect(page.getByTestId("projects-gallery-entry-count")).toHaveText("3 items");

  const markdownItemArticle = page.locator("article", { hasText: "Markdown block" }).first();
  await expect(markdownItemArticle).toBeVisible();
  await expect(markdownItemArticle).toHaveClass(/lg:col-span-3/);

  await markdownItemArticle.locator('a[href*="/project-1/gallery-1/"]').first().click();
  await expect(page).toHaveURL(/\/project-1\/gallery-1\/project-1-gallery-1-item-3(?:\?mode=(?:light|dark))?$/);
  await expect(page.getByRole("heading", { name: "Markdown block" })).toBeVisible();
});
