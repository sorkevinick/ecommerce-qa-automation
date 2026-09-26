import { type Page, type Locator } from '@playwright/test';

export class OrdersPage {
  readonly page: Page;
  readonly orderDetailsHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderDetailsHeading = page.getByRole('heading', { name: 'Detalhes do pedido' });
  }

  orderRow(orderNumber: string): Locator {
    return this.page.getByRole('row', { name: new RegExp(`#${orderNumber}\\b`) });
  }

  async viewOrder(orderNumber: string) {
    await this.orderRow(orderNumber).getByRole('link', { name: 'Visualizar' }).click();
  }

  async viewFirstOrder() {
    await this.page.getByRole('link', { name: 'Visualizar' }).first().click();
  }
}