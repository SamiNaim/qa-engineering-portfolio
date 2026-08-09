import { test, expect } from '@fixtures/test-fixtures';
import { uniqueUser } from '@data/test-data';

test.describe('Automation Exercise - Signup', () => {
  // Third-party ad scripts make this site slow to settle even with ads blocked.
  test.slow();

  test(
    'new user can start the signup flow',
    { tag: ['@regression', '@flaky-site'] },
    async ({ aeHome, aeSignup, page }) => {
      const user = uniqueUser();

      await aeHome.open();
      await aeHome.goToSignupLogin();
      await expect(page).toHaveURL(/\/login$/);

      await aeSignup.startSignup(user.name, user.email);

      await expect(page).toHaveURL(/\/signup$/);
      await expect(aeSignup.accountInfoHeader).toBeVisible();
    }
  );
});
