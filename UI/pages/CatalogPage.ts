import { type Page, type Locator, expect } from '@playwright/test';

export class CatalogPage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly sortSelect: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly noResultsMessage: Locator;
  // Container markup renders three copies of this widget (duplicated header markup for
  // responsive/mobile menus); only one is on-screen/interactable in a desktop viewport.
  readonly categoryDropdown: Locator;
  readonly categoryDropdownTrigger: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('.products .product');
    this.sortSelect = page.getByLabel('Pedido da loja');
    this.searchInput = page.getByRole('textbox', { name: 'Enter your search' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.noResultsMessage = page.getByText('Nenhum produto foi encontrado');
    this.categoryDropdown = page.locator('.SumoSelect.sumo_product_cat:visible');
    this.categoryDropdownTrigger = this.categoryDropdown.locator('p.CaptionCont');
  }

  async goto() {
    await this.page.goto('/produtos/');
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  categoryOption(name: string): Locator {
    // Scoped to the rendered options list (role "list"), not the whole widget, otherwise
    // this also matches the hidden native <select><option> that SumoSelect keeps in the
    // DOM, which never becomes visible and hangs the click.
    // Exact match avoids accidentally matching the combined "<name>|Clothing" label;
    // .first() resolves a confirmed duplicate category label (same name nested under
    // both Men > Tops and Women > Tops) — validated to resolve to the intended
    // product_cat slug for "Hoodies & Sweatshirts".
    return this.categoryDropdown
      .getByRole('list')
      .getByText(name, { exact: true })
      .first();
  }

  async selectCategory(categoryName: string) {
    await this.categoryDropdownTrigger.click();
    await this.categoryOption(categoryName).click();
    await expect(this.categoryDropdownTrigger).toHaveText(categoryName);
  }

  async searchInCategory(categoryName: string, term: string) {
    await this.selectCategory(categoryName);
    await this.search(term);
  }

  productCardCategoryClass(slug: string): string {
    return `product_cat-${slug}`;
  }

  async openFirstResult() {
    await this.productCards.first().getByRole('heading').getByRole('link').click();
  }

  async sortBy(option: 'price' | 'price-desc') {
    await this.sortSelect.selectOption(option);
    await this.page.waitForURL(/orderby=price/);
  }

  async getPrices(): Promise<number[]> {
    const texts = await this.productCards.locator('.price').allTextContents();
    return texts.map(parsePrice);
  }
}

// Converts "R$69,00" to 69. For sale prices ("R$80,00 R$69,00"), uses the last value.
function parsePrice(text: string): number {
  const values = text.match(/[\d.]+,\d{2}/g) ?? [];
  const current = values[values.length - 1] ?? '0,00';
  return Number(current.replace(/\./g, '').replace(',', '.'));
}