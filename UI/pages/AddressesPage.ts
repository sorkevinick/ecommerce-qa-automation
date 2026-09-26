import { type Page, type Locator, expect } from '@playwright/test';

type AddressType = 'billing' | 'shipping';

export class AddressesPage {
  readonly page: Page;
  readonly saveButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saveButton = page.locator('[name="save_address"]');
    this.successMessage = page.locator('.woocommerce-message');
    this.errorMessage = page.locator('.woocommerce-error');
  }

  // The theme does not use WooCommerce's default address block classes.
  // The page always shows two "Edit" links: billing first, shipping second.
  editLink(type: AddressType): Locator {
    const index = type === 'billing' ? 0 : 1;
    return this.page.getByRole('link', { name: 'Edit' }).nth(index);
  }

  async editAddress(type: AddressType) {
    await this.editLink(type).click();
    // The address form reorganizes its fields by country after it renders.
    // Interacting before that finishes can restore the original values.
    await this.page.waitForLoadState('networkidle');
  }

  async fillShippingAddress(address: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postcode: string;
  }) {
    await this.page.locator('#shipping_first_name').fill(address.firstName);
    await this.page.locator('#shipping_last_name').fill(address.lastName);
    // Country and state use a styled dropdown that hides the original <select>,
    // so "force" is needed to select the option directly.
    await this.page.locator('#shipping_country').selectOption('BR', { force: true });
    await this.page.locator('#shipping_state').selectOption('SP', { force: true });
    await this.page.locator('#shipping_address_1').fill(address.street);
    await this.page.locator('#shipping_city').fill(address.city);
    await this.page.locator('#shipping_postcode').fill(address.postcode);

    // Fail fast with a clear message if any value was lost
    await expect(this.page.locator('#shipping_address_1')).toHaveValue(address.street);
    await expect(this.page.locator('#shipping_postcode')).toHaveValue(address.postcode);
  }

  async clearField(fieldId: string) {
    const field = this.page.locator(`#${fieldId}`);
    await field.fill('');
    await expect(field).toHaveValue('');
  }

  async save() {
    await this.saveButton.click();
  }
}