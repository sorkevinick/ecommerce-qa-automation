import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emptyCartMessage = page.getByText('Seu carrinho está vazio.');
  }

  async goto() {
    await this.page.goto('/carrinho/');
  }

  productRow(productName: string): Locator {
    return this.page.getByRole('row', { name: new RegExp(productName) });
  }

  quantityOf(productName: string): Locator {
    return this.productRow(productName).getByRole('spinbutton');
  }

  async removeProduct(productName: string) {
    await this.productRow(productName).getByRole('link', { name: 'Remove this item' }).click();
  }
}