import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { products } from '../data/products';

test.describe('US-0001 – Add item to cart', () => {
  let productPage: ProductPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
  });

  test('TC-001-01 – should add a product to the cart', async () => {
    const { slug, name, size, color } = products.abominableHoodie;

    await productPage.goto(slug);
    await productPage.addToCart(size, color);

    await expect(productPage.successMessage).toContainText(name);

    await cartPage.goto();
    await expect(cartPage.productRow(`${name} - ${size}, ${color}`)).toContainText('R$69,00');
    await expect(cartPage.quantityOf(name)).toHaveValue('1');
  });

  test('TC-001-02 – should allow 10 units of the same product', async () => {
    const { slug, name, size, color } = products.aeroDailyFitnessTee;

    await productPage.goto(slug);
    await productPage.addToCart(size, color, 10);

    await cartPage.goto();
    await expect(cartPage.quantityOf(name)).toHaveValue('10');
    await expect(cartPage.productRow(name)).toContainText('R$240,00');
  });

  test('TC-001-03 – should block 11 units of the same product', async () => {
    test.fail(true, 'BUG-001: the 10-unit limit per product is not enforced');

    const { slug, size, color } = products.aeroDailyFitnessTee;

    await productPage.goto(slug);
    await productPage.addToCart(size, color, 11);

    await expect(productPage.errorMessage).toBeVisible();
  });

  test('TC-001-04 – should remove a product from the cart', async () => {
    const { slug, name, size, color } = products.abominableHoodie;

    await productPage.goto(slug);
    await productPage.addToCart(size, color);

    await cartPage.goto();
    await cartPage.removeProduct(name);

    await expect(cartPage.emptyCartMessage).toBeVisible();
  });
});