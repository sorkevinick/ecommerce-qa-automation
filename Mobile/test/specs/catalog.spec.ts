import LoginScreen from '../screens/LoginScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import { env } from '../../utils/env';

const KNOWN_PRODUCT = 'Abominable Hoodie';

describe('US-0009 – Product catalog (store manager app)', () => {
  before(async () => {
    await LoginScreen.login(env.storeUrl, env.username, env.password);
    await ProductsScreen.open();
  });

  // Returns to the product list so each test starts from the same place
  afterEach(async () => {
    if (await ProductDetailsScreen.navigateUpButton.isDisplayed()) {
      await ProductDetailsScreen.navigateUpButton.click();
    }
    if (await ProductsScreen.collapseSearchButton.isDisplayed()) {
      await ProductsScreen.collapseSearchButton.click();
    }
  });

  it('TC-009-01 – should display products with their stock status', async () => {
    await expect(ProductsScreen.stockStatus).toBeDisplayed();
  });

  it('TC-009-02 – should find an existing product', async () => {
    await ProductsScreen.search(KNOWN_PRODUCT);
    
    // await ProductsScreen.search('xyz123');

    await expect(ProductsScreen.product(KNOWN_PRODUCT)).toBeDisplayed();
  });

  it('TC-009-03 – should show a message when no products are found', async () => {
    await ProductsScreen.search('xyz123');

    await expect(ProductsScreen.noResultsMessage).toBeDisplayed();
  });

  it('TC-009-04 – should open the product details', async () => {
    await ProductsScreen.search(KNOWN_PRODUCT);
    await ProductsScreen.openProduct(KNOWN_PRODUCT);

    await expect(ProductDetailsScreen.productNameField).toHaveText(KNOWN_PRODUCT);
  });
});