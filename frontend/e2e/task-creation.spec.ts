import { test, expect } from "@playwright/test";

test("create task (E2E) - basic", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Open create form
  await page.getByTestId("create-task-btn").waitFor({ state: "visible", timeout: 5000 });
  await page.getByTestId("create-task-btn").click();

  // Fill title
  const titleInput = page.getByTestId("task-title-input");
  await titleInput.waitFor({ state: "visible", timeout: 5000 });
  await titleInput.fill("E2E Test Task");
  await titleInput.press("Enter");

  // Fill description
  const descInput = page.getByTestId("task-description-input");
  await descInput.waitFor({ state: "visible", timeout: 5000 });
  await descInput.fill("E2E description");
  await descInput.press("Enter");

  // Wait for toast
  await expect(page.locator("text=Task created successfully")).toBeVisible({ timeout: 10000 });

  // Avoid strict-mode error when duplicate texts exist
  await expect(page.locator("text=E2E Test Task").first()).toBeVisible();
});