import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

// Credentials live in .env.e2e (gitignored). Present at run time, not committed.
loadEnv({ path: ".env.e2e" });

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
