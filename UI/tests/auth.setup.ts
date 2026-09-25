import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { env } from '../utils/env';
import { AUTH_FILE } from '../utils/auth';


setup('authenticate as the test user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const myAccountPage = new MyAccountPage(page);

  await loginPage.goto();
  await loginPage.login(env.userEmail, env.userPassword);
  await expect(myAccountPage.navigation).toBeVisible();

  await page.context().storageState({ path: AUTH_FILE });
});