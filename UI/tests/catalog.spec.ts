import { test, expect } from '@playwright/test';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { products } from '../data/products';

const VARIATION_ALERT =
  'Selecione uma das opções do produto antes de adicioná-lo ao carrinho.';

test.describe('US-0004 – Product catalog', () => {
  let catalogPage: CatalogPage;

  test.beforeEach(async ({ page }) => {
    catalogPage = new CatalogPage(page);
    await catalogPage.goto();
  });

  test('TC-004-01 – should display products with image and price', async () => {
    await expect(catalogPage.productCards).toHaveCount(9);

    for (const card of await catalogPage.productCards.all()) {
      await expect(card.locator('img').first()).toBeVisible();
      await expect(card.locator('.price')).toBeVisible();
    }
  });

  test('TC-004-02 – should open the product page when the search has a single match', async ({ page }) => {
    const { slug, name } = products.abominableHoodie;

    await catalogPage.search(name);

    await expect(page).toHaveURL(new RegExp(`/product/${slug}/`));
    await expect(page.getByRole('heading', { name, level: 1 })).toBeVisible();
  });

  test('TC-004-03 – should show a message when no products are found', async () => {
    await catalogPage.search('nonexistent product xyz');

    await expect(catalogPage.noResultsMessage).toBeVisible();
  });

  const sortOptions = [
    { option: 'price', direction: 'ascending' },
    { option: 'price-desc', direction: 'descending' },
  ] as const;

  for (const { option, direction } of sortOptions) {
    test(`TC-004-05 – should sort products by price in ${direction} order`, async () => {
      await catalogPage.sortBy(option);

      const prices = await catalogPage.getPrices();
      const expected = [...prices].sort((a, b) =>
        direction === 'ascending' ? a - b : b - a,
      );

      expect(prices.length).toBeGreaterThan(0);
      expect(prices).toEqual(expected);
    });
  }
});

test.describe('US-0004 – Variation selection (decision table)', () => {
  const { slug, size, color } = products.abominableHoodie;

  const blockedCombinations = [
    { selectSize: false, selectColor: false },
    { selectSize: true, selectColor: false },
    { selectSize: false, selectColor: true },
  ];

  for (const { selectSize, selectColor } of blockedCombinations) {
    test(`TC-004-06 – should block add to cart (size: ${selectSize}, color: ${selectColor})`, async ({ page }) => {
      const productPage = new ProductPage(page);
      await productPage.goto(slug);

      if (selectSize) await productPage.selectSize(size);
      if (selectColor) await productPage.selectColor(color);

      const alertMessage = await productPage.clickAddToCartAndGetAlert();

      expect(alertMessage).toBe(VARIATION_ALERT);
      await expect(productPage.successMessage).not.toBeVisible();
    });
  }

  test('TC-004-06 – should add to cart when size and color are selected', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.goto(slug);

    await productPage.selectSize(size);
    await productPage.selectColor(color);
    const alertMessage = await productPage.clickAddToCartAndGetAlert();

    expect(alertMessage).toBe('');
    await expect(productPage.successMessage).toBeVisible();
  });
});