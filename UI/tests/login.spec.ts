import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { env } from '../utils/env';

const { userEmail: USER_EMAIL, userPassword: USER_PASSWORD, userName: USER_NAME } = env;

test.describe('US-0002 – Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC-002-01 – should log in with valid credentials', async ({ page }) => {
    const myAccountPage = new MyAccountPage(page);

    await loginPage.login(USER_EMAIL, USER_PASSWORD);

    await expect(myAccountPage.navigation).toBeVisible();
    await expect(myAccountPage.welcomeMessage(USER_NAME)).toBeVisible();
  });

  test('TC-002-02 – should show an error with an invalid username', async () => {
    await loginPage.login('invalid_user_xyz', USER_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC-002-03 – should show an error with a wrong password', async () => {
    await loginPage.login(USER_EMAIL, 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC-002-04 – should show an error with empty fields', async () => {
    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toContainText('Nome de usuário é obrigatório');
  });
});