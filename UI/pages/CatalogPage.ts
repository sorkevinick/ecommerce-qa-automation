import { type Page, type Locator } from '@playwright/test';

export class CatalogPage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly sortSelect: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('.products .product');
    this.sortSelect = page.getByLabel('Pedido da loja');
    this.searchInput = page.getByRole('textbox', { name: 'Enter your search' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.noResultsMessage = page.getByText('Nenhum produto foi encontrado');
  }

  async goto() {
    await this.page.goto('/produtos/');
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
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