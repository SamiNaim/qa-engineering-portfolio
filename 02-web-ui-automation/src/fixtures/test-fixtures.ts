import { test as base, expect } from '@playwright/test';
import { TheInternetLoginPage } from '@pages/the-internet/login.page';
import { SauceLoginPage } from '@pages/sauce-demo/login.page';
import { InventoryPage } from '@pages/sauce-demo/inventory.page';
import { CartPage } from '@pages/sauce-demo/cart.page';
import { HomePage } from '@pages/automation-exercise/home.page';
import { SignupPage } from '@pages/automation-exercise/signup.page';
import { PracticeFormPage } from '@pages/demoqa/forms.page';

/**
 * Third-party ad and analytics hosts. DemoQA and AutomationExercise both embed
 * ad iframes that can float over the page and swallow clicks. The single
 * biggest source of flake in this suite. Aborting these requests is far more
 * reliable than scrolling elements into view before every click, and it makes
 * those specs noticeably faster.
 */
const AD_AND_ANALYTICS_HOSTS =
  /(googlesyndication|doubleclick|adservice|googleadservices|google-analytics|googletagmanager|googletagservices|adsystem|adnxs|taboola|outbrain)/;

type PageFixtures = {
  theInternetLogin: TheInternetLoginPage;
  sauceLogin: SauceLoginPage;
  inventory: InventoryPage;
  cart: CartPage;
  aeHome: HomePage;
  aeSignup: SignupPage;
  demoqaForm: PracticeFormPage;
  blockAds: void;
};

export const test = base.extend<PageFixtures>({
  blockAds: [
    async ({ page }, use) => {
      await page.route(AD_AND_ANALYTICS_HOSTS, (route) => route.abort());
      await use();
    },
    { auto: true },
  ],

  theInternetLogin: async ({ page }, use) => {
    await use(new TheInternetLoginPage(page));
  },

  sauceLogin: async ({ page }, use) => {
    await use(new SauceLoginPage(page));
  },

  inventory: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cart: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  aeHome: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  aeSignup: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  demoqaForm: async ({ page }, use) => {
    await use(new PracticeFormPage(page));
  },
});

export { expect };
