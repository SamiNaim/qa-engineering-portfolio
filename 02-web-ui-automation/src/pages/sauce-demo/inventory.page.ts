import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { env } from '@config/env';

export class InventoryPage extends BasePage {
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly inventoryList: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    super(page, env.baseUrls.sauceDemo);

    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.inventoryList = page.getByTestId('inventory-list');
    this.items = page.getByTestId('inventory-item');
  }

  async open() {
    await this.goto('/inventory.html');
  }

  addToCartButton(itemSlug: string): Locator {
    return this.page.getByTestId(`add-to-cart-${itemSlug}`);
  }

  async addItemToCart(itemSlug: string) {
    await this.addToCartButton(itemSlug).click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}
