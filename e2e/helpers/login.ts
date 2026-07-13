import { expect, type Page } from "@playwright/test";

/**
 * Log in through the email+password form (Firebase Auth emulator locally).
 * Reads creds from the environment (loaded from .env.e2e by playwright.config.ts).
 */
export async function login(page: Page): Promise<void> {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "E2E_TEST_EMAIL / E2E_TEST_PASSWORD must be set (see .env.e2e)",
    );
  }

  await page.goto("/login");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.getByRole("button", { name: "Login" }).click();

  // Successful login redirects to /fixtures.
  await expect(page).toHaveURL(/\/fixtures/, { timeout: 15_000 });
}
