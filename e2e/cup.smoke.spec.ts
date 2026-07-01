import { expect, test } from "@playwright/test";
import { login } from "./helpers/login";

test.describe("weekly cup", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("cup leaderboard renders and a bet updates the pot", async ({
    page,
  }) => {
    // Open the cup page and confirm the leaderboard/header rendered.
    await page.goto("/cup");
    await expect(
      page.getByRole("heading", { name: "Cup", exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Weekly Cup")).toBeVisible();
    await expect(page.getByText("Your pot")).toBeVisible();

    // Capture the "This week" pot from the nav before betting.
    const potPill = page.locator("nav >> text=This week").locator("..");
    const potBefore = (await potPill.innerText()).trim();

    // Place a bet on the first available fixture.
    await page.goto("/fixtures");
    const placeBet = page.getByRole("button", { name: "Place Bet" }).first();
    await expect(placeBet).toBeVisible();
    await placeBet.click();

    await expect(
      page.getByRole("heading", { name: "Place Your Bet" }),
    ).toBeVisible();
    await page.fill("#stake", "10");
    await page.getByRole("button", { name: "Confirm Bet" }).click();

    // Toast confirms placement, then the nav pot should reflect the stake.
    await expect(page.getByText("Bet Placed")).toBeVisible();
    await expect(async () => {
      const potAfter = (await potPill.innerText()).trim();
      expect(potAfter).not.toEqual(potBefore);
    }).toPass({ timeout: 15_000 });

    // Leaderboard should still render for the current user after the bet.
    await page.goto("/cup");
    await expect(page.getByText("(you)")).toBeVisible();
  });
});
