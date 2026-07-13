import { expect, test } from "@playwright/test";
import { login } from "./helpers/login";
import { emulatorReachable, getResetOobCode } from "./helpers/emulator";

const email = process.env.E2E_TEST_EMAIL;
const password = process.env.E2E_TEST_PASSWORD;

test.describe("password reset", () => {
  test("request a reset link, set the password via the action page, then log in", async ({
    page,
  }) => {
    test.skip(!email || !password, "E2E_TEST_EMAIL / E2E_TEST_PASSWORD not set");
    test.skip(!(await emulatorReachable()), "Auth emulator not reachable");

    // Request the reset from the UI (global-setup seeded the user).
    await page.goto("/forgot-password");
    await page.fill("#email", email!);
    await page.getByRole("button", { name: "Send reset link" }).click();
    // CardTitle renders a div, not a heading — match on text.
    await expect(page.getByText("Check your email")).toBeVisible();

    // Pull the oobCode straight from the emulator — no real email involved.
    let oobCode: string | null = null;
    await expect(async () => {
      oobCode = await getResetOobCode(email!);
      expect(oobCode).toBeTruthy();
    }).toPass({ timeout: 10_000 });

    // Land on the branded action page and set the SAME password back.
    await page.goto(`/auth/action?mode=resetPassword&oobCode=${oobCode}`);
    await expect(
      page.getByText(`Resetting the password for ${email}`),
    ).toBeVisible();
    await page.fill("#password", password!);
    await page.fill("#confirmPassword", password!);
    await page.getByRole("button", { name: "Reset password" }).click();
    await expect(page.getByText("Password reset", { exact: true })).toBeVisible();

    // Log back in with the (unchanged) password.
    await login(page);
  });
});
