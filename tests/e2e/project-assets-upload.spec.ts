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

test("uploads multiple images in Image assets and shows them in gallery", async ({ page }) => {
  await createProjectFromDashboard(page, "Assets Upload Project");
  const projectId = page.url().split("/projects/")[1];
  if (!projectId) {
    throw new Error("Project id not found in URL");
  }

  let uploadCallCount = 0;
  await page.route(`**/api/projects/${projectId}/assets`, async (route, request) => {
    if (request.method() !== "POST") {
      await route.continue();
      return;
    }

    uploadCallCount += 1;
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        asset: {
          id: `asset-${uploadCallCount}`,
          projectId,
          kind: "image",
          storageKey: `projects/${projectId}/assets/asset-${uploadCallCount}.png`,
          originalFilename: `asset-${uploadCallCount}.png`,
          mimeType: "image/png",
          sizeBytes: 68,
          width: null,
          height: null,
          alt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publicUrl: `https://example.com/assets/${uploadCallCount}.png`,
        },
      }),
    });
  });

  const imageAssetsSection = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Image assets" }) })
    .first();
  const beforeCount = await imageAssetsSection.locator("img").count();

  const uploadInput = page.locator('input[type="file"][multiple]').first();
  const validPngBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9xS6EAAAAASUVORK5CYII=",
    "base64"
  );

  await uploadInput.setInputFiles([
    {
      name: "asset-1.png",
      mimeType: "image/png",
      buffer: validPngBuffer,
    },
    {
      name: "asset-2.png",
      mimeType: "image/png",
      buffer: validPngBuffer,
    },
  ]);

  await expect.poll(() => uploadCallCount).toBe(2);
  await expect(imageAssetsSection.locator("img")).toHaveCount(beforeCount + 2);
});
