import { test, expect } from "@playwright/test";

test("create and mark task as completed (E2E)", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Open create form
  await page.getByTestId("create-task-btn").waitFor({ state: "visible", timeout: 10000 });
  await page.getByTestId("create-task-btn").click();

  // Fill title and submit (adjust placeholders/testIds to match your inputs)
  const titleInput = page.getByTestId("task-title-input");
  await titleInput.waitFor({ state: "visible", timeout: 5000 });
  const taskTitle = `E2E Update Task ${Date.now()}`;
  await titleInput.fill(taskTitle);
  await titleInput.press("Enter");

  // Fill description and submit
  const descInput = page.getByTestId("task-description-input");
  await descInput.waitFor({ state: "visible", timeout: 5000 });
  await descInput.fill("E2E update description");
  await descInput.press("Enter");

  // Wait for create toast
  await expect(page.locator("text=Task created successfully")).toBeVisible({ timeout: 15000 });

  // Find the task container by data-testid prefix and text (robust even if id unknown)
  const taskContainer = page.locator('div[data-testid^="task-item-"]').filter({ hasText: taskTitle }).first();
  await taskContainer.waitFor({ state: 'visible', timeout: 15000 });

  // Find the Done button inside that container and click it
  const doneButton = taskContainer.getByRole('button', { name: /done/i }).first();
  await doneButton.waitFor({ state: 'visible', timeout: 10000 });
  await doneButton.click();

  // Wait for completion toast and verify
  await expect(page.locator("text=Task marked as completed")).toBeVisible({ timeout: 15000 });

  // Switch to completed tasks view
  await page.click('button:has-text("Show Completed")');

  // Verify the task appears in completed list
  await expect(page.locator(`text=${taskTitle}`).first()).toBeVisible({ timeout: 15000 });
});