import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { env } from '@config/env';

export class HomePage extends BasePage {
  readonly signupLoginLink: Locator;
  readonly carousel: Locator;

  constructor(page: Page) {
    super(page, env.baseUrls.automationExercise);

    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.carousel = page.getByRole('heading', { name: 'AutomationExercise' }).first();
  }

  async open() {
    await this.goto('/');
  }

  async goToSignupLogin() {
    await this.signupLoginLink.click();
  }
}
