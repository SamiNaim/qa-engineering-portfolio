import { test, expect } from '@fixtures/test-fixtures';
import { env } from '@config/env';
import { LOGGED_OUT_STATE } from '@config/paths';

// These tests exercise the login form itself, so they must start logged out —
// the cached session from auth.setup.ts would skip the thing under test.
test.use({ storageState: LOGGED_OUT_STATE });

test.describe('Sauce Demo - Login', () => {
  test.beforeEach(async ({ sauceLogin }) => {
    await sauceLogin.open();
  });

  test(
    'standard user reaches the inventory',
    { tag: ['@smoke', '@regression'] },
    async ({ sauceLogin, inventory, page }) => {
      await sauceLogin.login(env.credentials.sauce.username, env.credentials.sauce.password);

      await expect(page).toHaveURL(/inventory\.html$/);
      await expect(inventory.inventoryList).toBeVisible();
      await expect(inventory.items).toHaveCount(6);
    }
  );

  test(
    'locked out user is rejected and never reaches the inventory',
    { tag: ['@regression'] },
    async ({ sauceLogin, inventory, page }) => {
      await sauceLogin.login(
        env.credentials.sauce.lockedOutUsername,
        env.credentials.sauce.password
      );

      await expect(sauceLogin.errorMessage).toContainText('this user has been locked out');
      await expect(inventory.inventoryList).toBeHidden();
      await expect(page).not.toHaveURL(/inventory\.html/);
    }
  );
});
