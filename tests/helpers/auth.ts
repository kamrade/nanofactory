import { expect, Page } from "@playwright/test";

import { TEST_USER } from "../../db/seeds/test-data";

export async function loginAsTestUser(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(TEST_USER.email);
  await page.getByLabel("Password").fill(TEST_USER.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard");
  await expect(page.getByText(`Signed in as ${TEST_USER.email}`)).toBeVisible();
}
