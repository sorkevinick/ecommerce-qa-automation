import { type Page, type Locator } from '@playwright/test';

export class MyAccountPage {
  readonly page: Page;
  readonly navigation: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = page.locator('.woocommerce-MyAccount-navigation');
    this.logoutLink = this.navigation.getByRole('link', { name: 'Sair' });
  }

  async goto() {
    await this.page.goto('/minha-conta/');
  }

  welcomeMessage(username: string): Locator {
    return this.page.getByText(`Welcome ${username}`);
  }

  async logout() {
    await this.logoutLink.click();
  }
}