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

async function openPublishedProjectsGalleryPage(
  page: Page,
  projectName: string,
  extraQuery?: string
) {
  await createProjectFromDashboard(page, projectName);
  await addBlock(page, "Projects gallery with nested per-project image galleries.");
  await saveProject(page);

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

test("projects gallery marks image-only count and redirects markdown entry URL to nearest image", async ({
  page,
}) => {
  await createProjectFromDashboard(page, "Projects Gallery Markdown Item");
  await addBlock(page, "Projects gallery with nested per-project image galleries.");

  await page.getByRole("button", { name: "Add markdown" }).first().click();
  await page
    .getByPlaceholder("Markdown for this nested item")
    .first()
    .fill("## Markdown block\n\n- first point\n- second point");

  await saveProject(page);

  await publishProject(page);
  const publicUrl = await getPublicUrl(page);
  await page.goto(publicUrl);

  const firstProjectLink = page
    .locator('article a[href*="/project-1/gallery-1"]')
    .first();
  await expect(firstProjectLink).toBeVisible();
  await firstProjectLink.click();

  await expect(page).toHaveURL(/\/project-1\/gallery-1(?:\?mode=(?:light|dark))?$/);
  await expect(page.getByTestId("projects-gallery-entry-count")).toHaveText("2 items");

  await expect(page.getByTestId("projects-gallery-all-entries").locator("article", { hasText: "Markdown block" })).toHaveCount(1);

  await page.goto(`${publicUrl}/project-1/gallery-1/project-1-gallery-1-item-3`);
  await expect(page).toHaveURL(/\/project-1\/gallery-1\/project-1-gallery-1-item-(1|2)(?:\?mode=(?:light|dark))?$/);
});

test("projects gallery counter uses image-only sequence when markdown is in the middle", async ({
  page,
}) => {
  await createProjectFromDashboard(page, "Projects Gallery Mixed Counter");
  await addBlock(page, "Projects gallery with nested per-project image galleries.");

  await page.getByRole("button", { name: "Add markdown" }).first().click();
  await page
    .getByPlaceholder("Markdown for this nested item")
    .first()
    .fill("### Middle markdown");

  await page.getByRole("button", { name: "Add entry (image)" }).first().click();

  await saveProject(page);

  await publishProject(page);
  const publicUrl = await getPublicUrl(page);
  await page.goto(`${publicUrl}/project-1/gallery-1/project-1-gallery-1-item-3`);

  await expect(page).toHaveURL(/\/project-1\/gallery-1\/project-1-gallery-1-item-4(?:\?mode=(?:light|dark))?$/);
  await expect(page.getByTestId("projects-gallery-entry-counter")).toHaveText("Item 3 of 3");
});

test("projects gallery entry nav controls follow project spacing scale", async ({ page }) => {
  await createProjectFromDashboard(page, "Projects Gallery Spacing Controls");
  await addBlock(page, "Projects gallery with nested per-project image galleries.");
  await saveProject(page);
  await setSpacingScale(page, "sm");
  await publishProject(page);

  const publicUrl = await getPublicUrl(page);
  await page.goto(publicUrl);
  await page.locator('article a[href*="/project-1/gallery-1"]').first().click();
  await page.locator('article a[href*="/project-1/gallery-1/"]').first().click();

  await expect(page.getByTestId("projects-gallery-entry-back-link")).toHaveClass(/text-xs/);
  await expect(page.getByTestId("projects-gallery-entry-back-link")).toHaveClass(/px-2/);
  await expect(page.getByTestId("projects-gallery-entry-nav-next")).toHaveClass(/size-10/);
  await expect(page.getByTestId("projects-gallery-entry-nav-next")).toHaveClass(/rounded-full/);
});
