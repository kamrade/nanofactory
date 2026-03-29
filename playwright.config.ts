import * as dotenv from "dotenv";
import { defineConfig } from "@playwright/test";

dotenv.config({ path: ".env.test", quiet: true });

const testServerEnv = [
  `DATABASE_URL=${process.env.DATABASE_URL}`,
  `AUTH_SECRET=${process.env.AUTH_SECRET}`,
  `NEXTAUTH_URL=${process.env.NEXTAUTH_URL ?? "http://127.0.0.1:3011"}`,
].join(" ");

const webServerCommand = [
  `env -u FORCE_COLOR -u NO_COLOR ${testServerEnv} npx next build`,
  `env -u FORCE_COLOR -u NO_COLOR ${testServerEnv} npx next start -p 3011`,
].join(" && ");

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      testMatch: /.*\.spec\.ts/,
      dependencies: ["setup"],
      use: {
        baseURL: process.env.NEXTAUTH_URL ?? "http://127.0.0.1:3011",
        headless: true,
        storageState: "tests/e2e/.auth/user.json",
      },
    },
  ],
  use: {
    baseURL: process.env.NEXTAUTH_URL ?? "http://127.0.0.1:3011",
    headless: true,
  },
  webServer: {
    command: webServerCommand,
    url: "http://127.0.0.1:3011",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
