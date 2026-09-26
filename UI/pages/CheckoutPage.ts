import { type Page, type Locator, expect } from '@playwright/test';
import { billingAddress } from '../data/customers';

type BillingAddress = typeof billingAddress;

export class CheckoutPage {
  readonly page: Page;
  readonly codPaymentOption: Locator;
  readonly termsCheckbox: Locator;
  readonly placeOrderButton: Locator;
  readonly orderReceivedMessage: Locator;
  readonly orderNumber: Locator;

  constructor(page: Page) {
    this.page = page;
    this.codPaymentOption = page.locator('#payment_method_cod');
    this.termsCheckbox = page.locator('#terms');
    this.placeOrderButton = page.locator('#place_order');
    this.orderReceivedMessage = page.getByText('Obrigado. Seu pedido foi recebido.');
    this.orderNumber = page.locator('.woocommerce-order-overview__order strong');
  }

  async fillBillingAddress(address: BillingAddress) {
    const fields: [string, string][] = [
      ['#billing_first_name', address.firstName],
      ['#billing_last_name', address.lastName],
      ['#billing_address_1', address.address],
      ['#billing_city', address.city],
      ['#billing_postcode', address.postcode],
      ['#billing_phone', address.phone],
    ];

    // The checkout keeps initializing and updating in the background after it renders.
    // Filling fields during that process can erase their values (seen in Firefox).
    await this.page.waitForLoadState('networkidle');

    for (const [selector, value] of fields) {
      await this.page.locator(selector).fill(value);
    }
    await this.page.locator('#billing_phone').press('Tab');
    await this.page.waitForLoadState('networkidle');

    // Fail fast with a clear message if any value was lost
    for (const [selector, value] of fields) {
      await expect(this.page.locator(selector)).toHaveValue(value);
    }
  }

  async placeOrderWithCashOnDelivery() {
    await this.codPaymentOption.check();
    await this.termsCheckbox.check();
    await expect(this.codPaymentOption).toBeChecked();
    await expect(this.termsCheckbox).toBeChecked();
    await this.placeOrderButton.click();
  }

  async getOrderNumber(): Promise<string> {
    return (await this.orderNumber.innerText()).trim();
  }
}