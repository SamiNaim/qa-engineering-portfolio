import { Page } from '@playwright/test';

/**
 * Shared behaviour for every page object.
 *
 * Each site under test lives on its own host, so pages build absolute URLs from
 * their configured base URL rather than relying on a single global `baseURL`.
 *
 * Page objects expose `readonly` locators and actions; assertions belong in the
 * tests, not here.
 */
export abstract class BasePage {
  constructor(
    protected readonly page: Page,
    protected readonly baseUrl: string
  ) {}

  async goto(path: string = '/') {
    await this.page.goto(`${this.baseUrl}${path}`);
  }
}
