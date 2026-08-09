import { test as setup, expect } from '@playwright/test';
import { SauceLoginPage } from '@pages/sauce-demo/login.page';
import { InventoryPage } from '@pages/sauce-demo/inventory.page';
import { env } from '@config/env';
import { SAUCE_STORAGE_STATE } from '@config/paths';

/**
 * Signs into Sauce Demo once per run and caches the session to disk.
 *
 * Every authenticated spec then reuses it via `test.use({ storageState })`
 * instead of driving the login form again, which keeps those tests focused on
 * what they actually verify.
 */
setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new SauceLoginPage(page);
  const inventory = new InventoryPage(page);

  await loginPage.open();
  await loginPage.login(env.credentials.sauce.username, env.credentials.sauce.password);

  // Wait for a real signed-in signal before saving, otherwise we can persist a
  // half-finished session.
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventory.inventoryList).toBeVisible();

  await page.context().storageState({ path: SAUCE_STORAGE_STATE });
});
