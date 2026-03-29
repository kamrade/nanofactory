import { test as setup } from "@playwright/test";

import { resetTestDatabase, seedTestUser } from "../../scripts/test-db-utils";
import { TEST_USER } from "../../db/seeds/test-data";

setup("authenticate test user", async ({ page }) => {
  await resetTestDatabase();
  seedTestUser();

  await page.goto("/login");
  await page.getByLabel("Email").fill(TEST_USER.email);
  await page.getByLabel("Password").fill(TEST_USER.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard");

  await page.context().storageState({ path: "tests/e2e/.auth/user.json" });
});
