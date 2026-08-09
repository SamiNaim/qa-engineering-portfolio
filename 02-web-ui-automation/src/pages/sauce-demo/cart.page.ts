import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { env } from '@config/env';

/**
 * Covers the cart plus the three checkout steps that follow it. The steps are
 * separate methods on purpose so tests can assert intermediate state (the
 * checkout overview in particular) rather than blindly running the whole flow.
 */
export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly itemTotal: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page, env.baseUrls.sauceDemo);

    this.cartItems = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.postalCode = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.itemTotal = page.getByTestId('subtotal-label');
    this.completeHeader = page.getByTestId('complete-header');
  }

  itemByName(name: string): Locator {
    return this.page.getByTestId('inventory-item-name').filter({ hasText: name });
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }

  async fillShippingInfo(first: string, last: string, zip: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(zip);
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }
}
