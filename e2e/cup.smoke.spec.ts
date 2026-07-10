import { expect, test } from "@playwright/test";
import { login } from "./helpers/login";

test.describe("weekly cup", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("a bet creates the cup and updates the pot and leaderboard", async ({
    page,
  }) => {
    // Capture the pot pill from the nav before betting.
    const potPill = page.getByTestId("balance-pill").first();
    const potBefore = (await potPill.innerText()).trim();

    // Place a bet on the first available fixture. This must come first: on a
    // fresh stack the week's cup doesn't exist until the first bet creates it.
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

    // The bet created this week's cup — the page and leaderboard now render.
    await page.goto("/cup");
    await expect(
      page.getByRole("heading", { name: "Weekly Cup" }),
    ).toBeVisible();
    await expect(page.getByText("(you)")).toBeVisible();
  });
});
