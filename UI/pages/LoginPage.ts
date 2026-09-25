import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly registerEmailInput: Locator;
  readonly registerPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly passwordStrength: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
    this.errorMessage = page.getByRole('alert');
    this.registerEmailInput = page.locator('#reg_email');
    this.registerPasswordInput = page.locator('#reg_password');
    this.registerButton = page.getByRole('button', { name: 'Register', exact: true });
    this.passwordStrength = page.locator('.woocommerce-password-strength');
  }

  async goto() {
    await this.page.goto('/minha-conta/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async register(email: string, password: string) {
    // The password strength library (zxcvbn) loads in the background after the page renders.
    // Filling the form before it loads leaves the meter empty and the form blocked.
    await this.page.waitForFunction(() => typeof (window as any).zxcvbn === 'function');

    await this.registerEmailInput.fill(email);
    await this.registerPasswordInput.fill(password);
    await this.registerPasswordInput.press('Tab');
    await expect(this.passwordStrength).toHaveClass(/strong/);
    await this.registerButton.click();
  }
}