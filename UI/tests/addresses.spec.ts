import { test, expect } from '@playwright/test';
import { MyAccountPage } from '../pages/MyAccountPage';
import { AddressesPage } from '../pages/AddressesPage';
import { shippingAddress } from '../data/customers';
import { AUTH_FILE } from '../utils/auth';

test.use({ storageState: AUTH_FILE });

test.describe('US-0007 – Addresses', () => {
  let addressesPage: AddressesPage;

  test.beforeEach(async ({ page }) => {
    const myAccountPage = new MyAccountPage(page);
    addressesPage = new AddressesPage(page);

    await myAccountPage.goto();
    await myAccountPage.openSection('Endereços');
  });

  test('TC-007-03 – should save a shipping address', async ({ page }) => {
    const street = `Rua Teste, ${Date.now()}`;

    await addressesPage.editAddress('shipping');
    await addressesPage.fillShippingAddress({ ...shippingAddress, street });
    await addressesPage.save();

    await expect(addressesPage.successMessage).toBeVisible();
    await expect(page.getByText(street)).toBeVisible();
  });

  const requiredFields = [
    { id: 'billing_first_name', label: 'Nome' },
    { id: 'billing_address_1', label: 'Endereço' },
    { id: 'billing_city', label: 'Cidade' },
    { id: 'billing_postcode', label: 'CEP' },
    { id: 'billing_phone', label: 'Telefone' },
  ];

  for (const { id, label } of requiredFields) {
    test(`TC-007-04 – should require the "${label}" field`, async () => {
      await addressesPage.editAddress('billing');
      await addressesPage.clearField(id);
      await addressesPage.save();

      await expect(addressesPage.errorMessage).toContainText(label);
    });
  }
});