import { expect, test } from "@playwright/test";

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
  await page.goto("/dashboard");
  await page.getByLabel("Project name").fill("Playwright Project");
  await page.getByRole("button", { name: "Create project" }).click();

  await page.waitForURL(/\/projects\/.+/);
  await expect(page.getByRole("heading", { name: "Playwright Project" })).toBeVisible();
  await expect(page.getByText("Slug: playwright-project")).toBeVisible();
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
