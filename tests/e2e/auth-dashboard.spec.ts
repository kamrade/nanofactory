import { expect, test } from "@playwright/test";

import { TEST_USER } from "../../db/seeds/test-data";
import { resetTestDatabase, seedTestUser } from "../../scripts/test-db-utils";
import { loginAsTestUser } from "../helpers/auth";

test.describe.configure({ mode: "serial" });

test.beforeEach(async () => {
  await resetTestDatabase();
  seedTestUser();
});

test("redirects guests from dashboard to login", async ({ page }) => {
  await page.goto("/dashboard");

  await page.waitForURL("**/login");
  await expect(page.getByRole("heading", { name: "Sign in to your workspace" })).toBeVisible();
});

test("logs in and redirects an authenticated user away from login", async ({ page }) => {
  await loginAsTestUser(page);

  await page.goto("/login");
  await page.waitForURL("**/dashboard");
  await expect(page.getByText(`Signed in as ${TEST_USER.email}`)).toBeVisible();
});

test("creates a project from dashboard and opens it", async ({ page }) => {
  await loginAsTestUser(page);

  await page.getByLabel("Project name").fill("Playwright Project");
  await page.getByRole("button", { name: "Create project" }).click();

  await page.waitForURL(/\/projects\/.+/);
  await expect(page.getByRole("heading", { name: "Playwright Project" })).toBeVisible();
  await expect(page.getByText("Slug: playwright-project")).toBeVisible();
});

test("logs out and loses access to dashboard", async ({ page }) => {
  await loginAsTestUser(page);

  await page.getByRole("button", { name: "Log out" }).click();

  await page.waitForURL("**/login");
  await page.goto("/dashboard");
  await page.waitForURL("**/login");
});
