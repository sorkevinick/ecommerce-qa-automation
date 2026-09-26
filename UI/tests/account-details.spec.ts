import { test, expect } from '@playwright/test';
import { MyAccountPage } from '../pages/MyAccountPage';
import { AccountDetailsPage } from '../pages/AccountDetailsPage';
import { AUTH_FILE } from '../utils/auth';
import { env } from '../utils/env';

test.use({ storageState: AUTH_FILE });

test.describe('US-0008 – Account details', () => {
  let myAccountPage: MyAccountPage;
  let accountDetailsPage: AccountDetailsPage;

  test.beforeEach(async ({ page }) => {
    myAccountPage = new MyAccountPage(page);
    accountDetailsPage = new AccountDetailsPage(page);

    await myAccountPage.goto();
    await myAccountPage.openSection('Detalhes da conta');
  });

  test('TC-008-01 – should update first and last name', async () => {
    const firstName = `Kevin${Date.now()}`;

    await accountDetailsPage.updateName(firstName, 'QA');
    await expect(accountDetailsPage.successMessage).toBeVisible();

    await myAccountPage.openSection('Detalhes da conta');
    await expect(accountDetailsPage.firstNameInput).toHaveValue(firstName);
  });

  // The password is never actually changed: only error paths are automated,
  // because a real change would invalidate the shared session (see TC-008-04).
  test('TC-008-05 – should reject a wrong current password', async () => {
    await accountDetailsPage.changePassword('wrong_password', 'New#Pass-2026', 'New#Pass-2026');

    await expect(accountDetailsPage.errorMessage).toBeVisible();
  });

  test('TC-008-06 – should reject a password confirmation that does not match', async () => {
    await accountDetailsPage.changePassword(env.userPassword, 'New#Pass-2026', 'Different#2026');

    await expect(accountDetailsPage.errorMessage).toBeVisible();
  });
});