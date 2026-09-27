import { byId, byText } from '../../utils/selectors';

class ProductsScreen {
  get productsTab() { return $('~Products'); }
  get searchButton() { return $('~Search'); }
  get searchInput() { return byId('search_src_text'); }
  get collapseSearchButton() { return $('~Collapse'); }
  get stockStatus() {
    return $('android=new UiSelector().textMatches(".*(In stock|Out of stock).*")');
  }
  get noResultsMessage() {
    return $('android=new UiSelector().textContains("find results")');
  }

  product(name: string) {
    // Matches only plain TextViews: the search field (AutoCompleteTextView)
    // also shows the typed name and would cause false positives
    return $(`android=new UiSelector().className("android.widget.TextView").text("${name}")`);
  }

  async open() {
    await this.productsTab.click();
  }

  async search(term: string) {
    await this.searchButton.click();
    await this.searchInput.setValue(term);
  }

  async openProduct(name: string) {
    await this.product(name).click();
  }
}

export default new ProductsScreen();