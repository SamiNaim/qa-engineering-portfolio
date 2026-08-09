import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { env } from '@config/env';

export type PracticeFormData = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
};

export class PracticeFormPage extends BasePage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly genderMale: Locator;
  readonly mobile: Locator;
  readonly submitButton: Locator;
  readonly confirmationModal: Locator;
  readonly confirmationTitle: Locator;

  constructor(page: Page) {
    super(page, env.baseUrls.demoQA);

    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.email = page.getByPlaceholder('name@example.com');
    // The radio input itself is visually hidden behind a styled label, so the
    // label is what a real user clicks.
    this.genderMale = page.getByText('Male', { exact: true });
    this.mobile = page.getByPlaceholder('Mobile Number');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.confirmationModal = page.getByRole('dialog');
    // The modal title is a `div.modal-title` styled to look like a heading, so
    // it exposes no heading role — match on its text within the dialog instead.
    this.confirmationTitle = this.confirmationModal.getByText('Thanks for submitting the form');
  }

  async open() {
    await this.goto('/automation-practice-form');
  }

  /** Value cell of the confirmation table row with the given label. */
  confirmationValue(label: string): Locator {
    return this.confirmationModal
      .getByRole('row')
      .filter({ hasText: label })
      .getByRole('cell')
      .nth(1);
  }

  async fillAndSubmit(data: PracticeFormData) {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.email.fill(data.email);
    await this.genderMale.click();
    await this.mobile.fill(data.mobile);
    await this.submitButton.click();
  }
}
