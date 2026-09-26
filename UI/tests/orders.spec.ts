import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrdersPage } from '../pages/OrdersPage';
import { products } from '../data/products';
import { billingAddress, TEST_PASSWORD } from '../data/customers';
import { AUTH_FILE } from '../utils/auth';

test.describe('US-0006 – My orders', () => {
  test('TC-006-01 – should display a new order in the order history', async ({ page }) => {
    test.slow(); // End-to-end flow: gives this test extra time

    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const myAccountPage = new MyAccountPage(page);
    const ordersPage = new OrdersPage(page);
    const { slug, size, color } = products.abominableHoodie;

    // A fresh account keeps this test isolated from the shared test user
    await loginPage.goto();
    await loginPage.register(`qa.${Date.now()}@ebac.com`, TEST_PASSWORD);

    await productPage.goto(slug);
    await productPage.addToCart(size, color);

    await cartPage.goto();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillBillingAddress(billingAddress);
    await checkoutPage.placeOrderWithCashOnDelivery();

    await expect(checkoutPage.orderReceivedMessage).toBeVisible({ timeout: 15_000 });
    const orderNumber = await checkoutPage.getOrderNumber();

    await myAccountPage.goto();
    await myAccountPage.openSection('Pedidos');

    const orderRow = ordersPage.orderRow(orderNumber);
    await expect(orderRow).toContainText('Processando');
    await expect(orderRow).toContainText('R$69,00');
  });

  test.describe('with a saved session', () => {
    test.use({ storageState: AUTH_FILE });

    test('TC-006-02 – should display the details of an order', async ({ page }) => {
      const myAccountPage = new MyAccountPage(page);
      const ordersPage = new OrdersPage(page);

      await myAccountPage.goto();
      await myAccountPage.openSection('Pedidos');
      await ordersPage.viewFirstOrder();

      await expect(ordersPage.orderDetailsHeading).toBeVisible();
      await expect(page.getByText('Método de pagamento:')).toBeVisible();
    });
  });
});