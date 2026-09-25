import { type Page, type Locator } from '@playwright/test';

export class MyAccountPage {
  readonly page: Page;
  readonly navigation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = page.locator('.woocommerce-MyAccount-navigation');
  }

  welcomeMessage(username: string): Locator {
    return this.page.getByText(`Welcome ${username}`);
  }
}