import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { env } from '@config/env';

export class SignupPage extends BasePage {
  readonly signupForm: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly signupButton: Locator;
  readonly accountInfoHeader: Locator;

  constructor(page: Page) {
    super(page, env.baseUrls.automationExercise);

    // This page renders two forms — login and signup — and both use the
    // "Email Address" placeholder, so the fields are ambiguous page-wide.
    // Scope by the <form> element that contains the Signup button: a tag name
    // narrowed by a user-facing filter, rather than a brittle class selector.
    // eslint-disable-next-line no-restricted-syntax
    this.signupForm = page.locator('form', {
      has: page.getByRole('button', { name: 'Signup' }),
    });

    this.nameInput = this.signupForm.getByPlaceholder('Name');
    this.emailInput = this.signupForm.getByPlaceholder('Email Address');
    this.signupButton = this.signupForm.getByRole('button', { name: 'Signup' });
    this.accountInfoHeader = page.getByRole('heading', {
      name: 'Enter Account Information',
    });
  }

  async open() {
    await this.goto('/login');
  }

  async startSignup(name: string, email: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.signupButton.click();
  }
}
