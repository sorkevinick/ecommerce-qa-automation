import { type Page, type Locator } from '@playwright/test';

export class AccountDetailsPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#account_first_name');
    this.lastNameInput = page.locator('#account_last_name');
    this.currentPasswordInput = page.locator('#password_current');
    this.newPasswordInput = page.locator('#password_1');
    this.confirmPasswordInput = page.locator('#password_2');
    this.saveButton = page.locator('[name="save_account_details"]');
    this.successMessage = page.locator('.woocommerce-message');
    this.errorMessage = page.locator('.woocommerce-error');
  }

  async updateName(firstName: string, lastName: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.saveButton.click();
  }

  async changePassword(current: string, newPassword: string, confirmation: string) {
    await this.currentPasswordInput.fill(current);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmation);
    await this.saveButton.click();
  }
}