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

    if (await blockEditor.isVisible()) {
      await page.keyboard.press("Escape");
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

async function openPublishedGalleryPage(page: Page, projectName: string, extraQuery?: string) {
  await createProjectFromDashboard(page, projectName);
  await addBlock(page, "Image gallery with configurable columns and optional text details.");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Project content saved.")).toBeVisible();

  await publishProject(page);
  const publicUrl = await getPublicUrl(page);
  const targetUrl = extraQuery ? `${publicUrl}${publicUrl.includes("?") ? "&" : "?"}${extraQuery}` : publicUrl;
  await page.goto(targetUrl);
}

test("gallery item page supports next/previous, keyboard arrows, and back to gallery", async ({
  page,
}) => {
  await openPublishedGalleryPage(page, "Gallery Navigation Project");

  const firstItemLink = page.locator('article[id^="gallery-"] a[href*="/gallery-"]').first();
  await expect(firstItemLink).toBeVisible();
  await firstItemLink.click();

  await expect(page.getByText("Item 1 of 2")).toBeVisible();
  const firstDetailUrl = new URL(page.url());
  const firstSegments = firstDetailUrl.pathname.split("/").filter(Boolean);
  const galleryAnchor = firstSegments[firstSegments.length - 2];

  await page.getByRole("link", { name: "Next" }).click();
  await expect(page.getByText("Item 2 of 2")).toBeVisible();
  const secondDetailUrl = new URL(page.url());
  expect(secondDetailUrl.pathname).not.toBe(firstDetailUrl.pathname);

  await page.keyboard.press("ArrowLeft");
  await expect(page.getByText("Item 1 of 2")).toBeVisible();
  await expect(page).toHaveURL(firstDetailUrl.toString());

  await page.getByRole("link", { name: "Back to gallery" }).click();
  await expect(page).toHaveURL(new RegExp(`#${galleryAnchor}$`));
});

test("gallery item page handles ArrowRight and edge states for previous/next", async ({ page }) => {
  await openPublishedGalleryPage(page, "Gallery Navigation Edge States");

  const firstItemLink = page.locator('article[id^="gallery-"] a[href*="/gallery-"]').first();
  await expect(firstItemLink).toBeVisible();
  await firstItemLink.click();

  await expect(page.getByText("Item 1 of 2")).toBeVisible();
  const firstDetailUrl = page.url();
  await expect(page.getByText("Previous")).toBeVisible();
  await expect(page.getByRole("link", { name: "Previous" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Next" })).toHaveCount(1);

  await page.keyboard.press("ArrowRight");
  await expect(page.getByText("Item 2 of 2")).toBeVisible();
  await expect(page.url()).not.toBe(firstDetailUrl);
  await expect(page.getByRole("link", { name: "Previous" })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Next" })).toHaveCount(0);

  await page.keyboard.press("ArrowRight");
  await expect(page.getByText("Item 2 of 2")).toBeVisible();
});

test("returns 404 for invalid gallery item anchors", async ({ page }) => {
  const projectName = "Gallery Navigation NotFound";
  await createProjectFromDashboard(page, projectName);
  await addBlock(page, "Image gallery with configurable columns and optional text details.");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Project content saved.")).toBeVisible();
  await publishProject(page);
  const publicUrl = await getPublicUrl(page);
  const url = new URL(publicUrl, page.url());
  url.pathname = `${url.pathname.replace(/\/$/, "")}/missing-gallery/missing-item`;

  await page.goto(url.toString());
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});

test("preserves dark mode when opening a gallery item", async ({ page }) => {
  await openPublishedGalleryPage(page, "Gallery Navigation Mode Preserve", "mode=dark");
  await expect(page.locator('main[data-mode="dark"]')).toBeVisible();

  const firstItemLink = page.locator('article[id^="gallery-"] a[href*="/gallery-"]').first();
  await expect(firstItemLink).toBeVisible();
  await firstItemLink.click();

  await expect(page.locator('main[data-mode="dark"]')).toBeVisible();
  await expect(page).toHaveURL(/mode=dark/);
});
