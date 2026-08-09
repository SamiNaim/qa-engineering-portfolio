import { test, expect } from '@fixtures/test-fixtures';

test.describe('The Internet - Login', () => {
  test.beforeEach(async ({ theInternetLogin }) => {
    await theInternetLogin.open();
  });

  test(
    'successful login shows success message',
    { tag: ['@smoke', '@regression'] },
    async ({ theInternetLogin, page }) => {
      await theInternetLogin.login('tomsmith', 'SuperSecretPassword!');

      await expect(theInternetLogin.flashMessage).toContainText('You logged into a secure area');
      await expect(page).toHaveURL(/\/secure$/);
    }
  );

  test(
    'invalid login shows error and stays on the login page',
    { tag: ['@regression'] },
    async ({ theInternetLogin, page }) => {
      await theInternetLogin.login('wrongUser', 'wrongPass');

      await expect(theInternetLogin.flashMessage).toContainText('Your username is invalid!');
      await expect(page).toHaveURL(/\/login$/);
    }
  );
});
