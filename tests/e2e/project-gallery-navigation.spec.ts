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
  const closeButton = blockEditor.getByRole("button", { name: "Close" }).first();

  const isBlockEditorOpen = async () => {
    return blockEditor.evaluate((dialog) => {
      const panel = dialog.parentElement as HTMLElement | null;
      const root = panel?.parentElement as HTMLElement | null;

      if (!panel || !root) {
        return false;
      }

      return (
        root.className.includes("pointer-events-auto") &&
        panel.className.includes("pointer-events-auto") &&
        !panel.className.includes("translate-x-full")
      );
    });
  };

  if (!(await isBlockEditorOpen())) {
    return;
  }

  await blockEditor.press("Escape");
  await page.waitForTimeout(150);

  if (!(await isBlockEditorOpen())) {
    return;
  }

  await closeButton.evaluate((button) => {
    const closeTarget =
      button.parentElement instanceof HTMLElement ? button.parentElement : button;
    closeTarget.click();
  });
  await page.waitForTimeout(150);

  if (!(await isBlockEditorOpen())) {
    return;
  }

  await blockEditor.press("Escape");
  await page.waitForTimeout(150);
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

async function setSpacingScale(page: Page, nextScale: "sm" | "md" | "lg") {
  const controlsSheet = await openProjectControls(page);
  const select = controlsSheet.getByRole("combobox", { name: "Spacing scale" });
  await expect(select).toBeVisible();
  await select.evaluate((node) => {
    (node as HTMLButtonElement).click();
  });
  await page.getByRole("option", { name: nextScale }).click();
  await expect(select).toContainText(nextScale);
}

async function addBlock(page: Page, descriptionText: string) {
  await ensureBlockEditorClosed(page);
  const blockType = descriptionText.includes("Projects gallery")
    ? "projects-gallery"
    : "gallery";
  await page.evaluate(({ nextBlockType }) => {
    window.dispatchEvent(
      new CustomEvent("project-editor:add-block", {
        detail: { blockType: nextBlockType, variant: "default" },
      })
    );
  }, { nextBlockType: blockType });
}

async function saveProject(page: Page) {
  await ensureBlockEditorClosed(page);
  const saveButton = page.getByRole("button", { name: "Save" });
  await saveButton.click();
  await expect(saveButton).toHaveClass(/border-neutral-line/);
}

async function publishProject(page: Page) {
  await ensureBlockEditorClosed(page);
  const infoSheet = await openProjectControls(page);
  await expect(infoSheet).toBeVisible();
  await infoSheet.getByTestId("project-publish-button").evaluate((button) => {
    (button as HTMLButtonElement).click();
  });
  await page.waitForURL(/\/projects\/.+/);
}

async function getPublicUrl(page: Page) {
  await ensureBlockEditorClosed(page);
  const infoSheet = await openProjectControls(page);
  await expect(infoSheet).toBeVisible();
  const publicLink = page
    .getByTestId("project-settings")
    .getByRole("link", { name: "Open public page" });
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
  await saveProject(page);

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

  await expect(page.getByTestId("gallery-counter")).toHaveText("Item 1 of 2");
  const firstDetailUrl = new URL(page.url());
  const firstSegments = firstDetailUrl.pathname.split("/").filter(Boolean);
  const galleryAnchor = firstSegments[firstSegments.length - 2];

  await page.getByTestId("gallery-nav-next").click();
  await expect(page.getByTestId("gallery-counter")).toHaveText("Item 2 of 2");
  const secondDetailUrl = new URL(page.url());
  expect(secondDetailUrl.pathname).not.toBe(firstDetailUrl.pathname);

  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTestId("gallery-counter")).toHaveText("Item 1 of 2");
  await expect(page).toHaveURL(firstDetailUrl.toString());

  await page.getByTestId("gallery-back-link").click();
  await expect(page).toHaveURL(new RegExp(`#${galleryAnchor}$`));
});

test("gallery item page handles ArrowRight and edge states for previous/next", async ({ page }) => {
  await openPublishedGalleryPage(page, "Gallery Navigation Edge States");

  const firstItemLink = page.locator('article[id^="gallery-"] a[href*="/gallery-"]').first();
  await expect(firstItemLink).toBeVisible();
  await firstItemLink.click();

  await expect(page.getByTestId("gallery-counter")).toHaveText("Item 1 of 2");
  const firstDetailUrl = page.url();
  await expect(page.getByTestId("gallery-nav-previous")).toHaveCount(0);
  await expect(page.getByTestId("gallery-nav-next")).toHaveCount(1);

  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("gallery-counter")).toHaveText("Item 2 of 2");
  await expect(page.url()).not.toBe(firstDetailUrl);
  await expect(page.getByTestId("gallery-nav-previous")).toHaveCount(1);
  await expect(page.getByTestId("gallery-nav-next")).toHaveCount(0);

  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("gallery-counter")).toHaveText("Item 2 of 2");
});

test("returns 404 for invalid gallery item anchors", async ({ page }) => {
  const projectName = "Gallery Navigation NotFound";
  await createProjectFromDashboard(page, projectName);
  await addBlock(page, "Image gallery with configurable columns and optional text details.");
  await saveProject(page);
  await publishProject(page);
  const publicUrl = await getPublicUrl(page);
  const url = new URL(publicUrl, page.url());
  url.pathname = `${url.pathname.replace(/\/$/, "")}/missing-gallery/missing-item`;

  await page.goto(url.toString());
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});

test("preserves dark mode when opening a gallery item", async ({ page }) => {
  await openPublishedGalleryPage(page, "Gallery Navigation Mode Preserve", "mode=dark");
  await expect(page.getByTestId("project-mode-container")).toHaveAttribute("data-mode", "dark");

  const firstItemLink = page.locator('article[id^="gallery-"] a[href*="/gallery-"]').first();
  await expect(firstItemLink).toBeVisible();
  await firstItemLink.click();

  await expect(page.getByTestId("gallery-entry-mode-container")).toHaveAttribute("data-mode", "dark");
  await expect(page).toHaveURL(/mode=dark/);
});

test("gallery detail nav controls follow project spacing scale", async ({ page }) => {
  await createProjectFromDashboard(page, "Gallery Spacing Controls");
  await addBlock(page, "Image gallery with configurable columns and optional text details.");
  await saveProject(page);
  await setSpacingScale(page, "lg");
  await publishProject(page);

  const publicUrl = await getPublicUrl(page);
  await page.goto(publicUrl);

  const firstItemLink = page.locator('article[id^="gallery-"] a[href*="/gallery-"]').first();
  await expect(firstItemLink).toBeVisible();
  await firstItemLink.click();

  await expect(page.getByTestId("gallery-back-link")).toHaveClass(/text-base/);
  await expect(page.getByTestId("gallery-back-link")).toHaveClass(/px-4/);
  await expect(page.getByTestId("gallery-nav-next")).toHaveClass(/size-10/);
  await expect(page.getByTestId("gallery-nav-next")).toHaveClass(/rounded-full/);
});

test("single image preview size class stays stable across spacing scale changes", async ({
  page,
}) => {
  test.setTimeout(90_000);

  await createProjectFromDashboard(page, "Gallery Spacing SM");
  await addBlock(page, "Image gallery with configurable columns and optional text details.");
  await saveProject(page);
  await setSpacingScale(page, "sm");
  await publishProject(page);

  const smPublicUrl = await getPublicUrl(page);
  await page.goto(smPublicUrl);
  await page.locator('article[id^="gallery-"] a[href*="/gallery-"]').first().click();
  await expect(page).toHaveURL(/\/gallery-[^/]+\/[^/?#]+(?:\?mode=(?:light|dark))?$/);
  const smContainer = page.getByTestId("gallery-entry-mode-container");
  await expect(smContainer).toBeVisible();
  const smPreviewImageClass = await smContainer
    .locator(':scope > div > section a img')
    .first()
    .getAttribute("class");

  await createProjectFromDashboard(page, "Gallery Spacing LG");
  await addBlock(page, "Image gallery with configurable columns and optional text details.");
  await saveProject(page);
  await setSpacingScale(page, "lg");
  await publishProject(page);

  const lgPublicUrl = await getPublicUrl(page);
  await page.goto(lgPublicUrl);
  await page.locator('article[id^="gallery-"] a[href*="/gallery-"]').first().click();
  await expect(page).toHaveURL(/\/gallery-[^/]+\/[^/?#]+(?:\?mode=(?:light|dark))?$/);
  const lgContainer = page.getByTestId("gallery-entry-mode-container");
  await expect(lgContainer).toBeVisible();
  const lgPreviewImageClass = await lgContainer
    .locator(':scope > div > section a img')
    .first()
    .getAttribute("class");

  expect(smPreviewImageClass).toBe(lgPreviewImageClass);
});
