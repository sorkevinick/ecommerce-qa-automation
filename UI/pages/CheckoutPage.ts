import { type Page, type Locator } from '@playwright/test';
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
    await this.page.locator('#billing_first_name').fill(address.firstName);
    await this.page.locator('#billing_last_name').fill(address.lastName);
    await this.page.locator('#billing_address_1').fill(address.address);
    await this.page.locator('#billing_city').fill(address.city);
    await this.page.locator('#billing_postcode').fill(address.postcode);
    await this.page.locator('#billing_phone').fill(address.phone);
    await this.page.locator('#billing_phone').press('Tab');
  }

  async placeOrderWithCashOnDelivery() {
    // WooCommerce reloads the payment section in the background after address changes.
    // Waiting for the network to settle prevents the selection from being lost.
    await this.page.waitForLoadState('networkidle');
    await this.codPaymentOption.check();
    await this.termsCheckbox.check();
    await this.placeOrderButton.click();
  }

  async getOrderNumber(): Promise<string> {
    return (await this.orderNumber.innerText()).trim();
  }
}