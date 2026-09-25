import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { AUTH_FILE } from '../utils/auth';
import { env } from '../utils/env';

test.describe('US-0005 – My Account dashboard', () => {
  test.describe('with a saved session', () => {
    test.use({ storageState: AUTH_FILE });

    test('TC-005-01 – should display the dashboard for a logged-in user', async ({ page }) => {
      const myAccountPage = new MyAccountPage(page);

      await myAccountPage.goto();

      await expect(myAccountPage.navigation).toBeVisible();
      await expect(myAccountPage.welcomeMessage(env.userName)).toBeVisible();
    });
  });

  test.describe('without a saved session', () => {
    // Logging out invalidates the session on the server,
    // so this test logs in on its own instead of using the shared session.
    test('TC-005-03 – should end the session on logout', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const myAccountPage = new MyAccountPage(page);

      await loginPage.goto();
      await loginPage.login(env.userEmail, env.userPassword);
      await myAccountPage.logout();

      await expect(loginPage.usernameInput).toBeVisible();
      await expect(myAccountPage.navigation).not.toBeVisible();
    });

    test('TC-005-05 – should register a new account', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const myAccountPage = new MyAccountPage(page);
      const uniqueEmail = `qa.${Date.now()}@ebac.com`;

      await loginPage.goto();
      await loginPage.register(uniqueEmail, 'Ebac#QA-2026-strong');

      await expect(myAccountPage.navigation).toBeVisible();
    });
  });
});