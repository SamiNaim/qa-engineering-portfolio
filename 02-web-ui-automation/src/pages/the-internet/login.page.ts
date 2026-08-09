import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { env } from '@config/env';

export class TheInternetLoginPage extends BasePage {
  readonly username: Locator;
  readonly password: Locator;
  readonly submitButton: Locator;
  readonly flashMessage: Locator;

  constructor(page: Page) {
    super(page, env.baseUrls.theInternet);

    this.username = page.getByLabel('Username');
    this.password = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Login' });
    // The flash banner carries no ARIA role and no test id — verified against
    // the live page, it renders as `<div data-alert id="flash" class="flash">`.
    // An id is the most stable handle available here; the class changes between
    // success and error.
    // eslint-disable-next-line no-restricted-syntax
    this.flashMessage = page.locator('#flash');
  }

  async open() {
    await this.goto('/login');
  }

  async login(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submitButton.click();
  }
}
