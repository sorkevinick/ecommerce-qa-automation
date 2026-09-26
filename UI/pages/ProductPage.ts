import { type Page, type Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.quantityInput = page.getByRole('spinbutton', { name: 'Qty' });
    this.addToCartButton = page.getByRole('button', { name: 'Comprar' });
    this.successMessage = page.locator('.woocommerce-message');
    this.errorMessage = page.locator('.woocommerce-error');
  }

  async goto(slug: string) {
    await this.page.goto(`/product/${slug}/`);
    // The size and color buttons only respond after the page scripts finish loading.
    // Clicking earlier can silently lose the selection (seen in WebKit).
    await this.page.waitForLoadState('networkidle');
  }

  // Matches "XS XS" for size XS, but not "XS XS" for size S
  private variation(value: string): Locator {
    return this.page.getByRole('radio', { name: new RegExp(`^${value}(\\s|$)`) });
  }

  async selectSize(size: string) {
    await this.variation(size).click();
    await expect(this.variation(size)).toBeChecked();
  }

  async selectColor(color: string) {
    await this.variation(color).click();
    await expect(this.variation(color)).toBeChecked();
  }

  async addToCart(size: string, color: string, quantity = 1) {
    await this.selectSize(size);
    await this.selectColor(color);
    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();
    // Wait for the store to confirm the result before moving on.
    // Navigating away too early cancels the request and the product is never added.
    await expect(this.successMessage.or(this.errorMessage)).toBeVisible();
  }

  // Clicks "Comprar" and returns the browser alert message (empty if no alert appears)
  async clickAddToCartAndGetAlert(): Promise<string> {
    let alertMessage = '';
    this.page.once('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    await this.addToCartButton.click();
    return alertMessage;
  }
}