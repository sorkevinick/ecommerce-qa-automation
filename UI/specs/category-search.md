# Category Search in Product Catalog

## Application Overview

Feature under test: the category dropdown next to the search field on the product catalog page (`/produtos/`), combined with the free-text search box, used to filter search results down to a single product category.

This automates TC-004-04 ("Search within a category"), which is currently documented as Manual in `docs/test-cases/TC-US-0004-product-catalog.md` with the note "checking each result's category requires opening every product page, which makes automation slow for little gain." During exploration this was verified to be feasible (7 product pages checked, all consistent), so this plan promotes TC-004-04 to automated and adds one new negative case, TC-004-07 (next unused number in the `tests/catalog.spec.ts` suite; TC-004-01..06 already exist, TC-003 belongs to the API suite so it is skipped for UI numbering).

## How the category dropdown actually works (confirmed in the browser)
The widget is the "SumoSelect" jQuery plugin. It renders next to a real, but visually hidden, native `<select name="product_cat" id="product_cat">`. Key findings:
- Container markup: `<div class="SumoSelect sumo_product_cat"> <p class="CaptionCont SelectBox"><span>Selecione uma categoria</span><label><i></i></label></p> <div class="options-wrapper"><ul class="options"><li class="opt level-N"><label>Category Name</label></li>...</ul></div></div>`.
- Opening the dropdown = clicking the `<p class="CaptionCont">` element (the visible text, initially "Selecione uma categoria"). This reveals the `<ul class="options">` list of `<li class="opt"><label>...</label></li>` items — confirmed via snapshot (a `list`/`listitem` block appeared only after this click).
- Selecting a category = clicking its `<label>` text inside the opened list. After the click: (a) the trigger `<p class="CaptionCont">` text changes from the placeholder to the chosen category name, (b) the underlying native `<select name="product_cat">` gets its `value` and `selectedIndex` updated (confirmed via `page.evaluate` — selecting "Hoodies & Sweatshirts" set `select.value` to `"hoodies-sweatshirts"`), and (c) the list closes.
- **Gotcha #1 — duplicated markup:** the page contains **three** elements matching `select[name="product_cat"]` / `.SumoSelect.sumo_product_cat` (likely duplicated header markup for responsive/mobile menus). Only one is actually on-screen and interactable in a desktop viewport; the other two have no bounding box and `isVisible() === false`. Locators must be scoped to the visible instance, e.g. `page.locator('.SumoSelect.sumo_product_cat:visible')`, otherwise Playwright throws a strict-mode violation. This is a legitimate use of a CSS selector (matching the existing convention already used for `productCards`/`.price` in `CatalogPage.ts`) plus the `:visible` pseudo-class to disambiguate — not a list-position hack, since it targets "the one currently rendered/usable" rather than an arbitrary index.
- **Gotcha #2 — duplicate category label text:** "Hoodies & Sweatshirts" appears **twice** in the option list as plain text (once nested under Men > Tops, once under Women > Tops), and a third/fourth combined label "Hoodies & Sweatshirts|Clothing" also exists elsewhere in the list. Use an **exact** text match (`getByText(name, { exact: true })`) to avoid accidentally matching the "|Clothing" combined label, and take `.first()` of the exact matches to land on the Men > Tops entry — this was verified to resolve to `product_cat=hoodies-sweatshirts` (the value used in this plan). This is documented here so whoever automates it doesn't "fix" the `.first()` call thinking it's an arbitrary list-position violation — it is a deliberate, evidence-based choice tied to a known duplicate in the category tree, not a substitute for a unique locator that doesn't exist.

## Confirmed URL contract
Submitting the search with a category selected navigates to the WordPress/WooCommerce default search URL (not `/produtos/`) with both parameters present, e.g.:
`http://localhost/?product_cat=hoodies-sweatshirts&s=Hoodie&post_type=product`
Page title becomes `Resultados da pesquisa por "Hoodie" – EBAC – Shop` and an on-page heading reads `Resultados da pesquisa por: "Hoodie"`. The breadcrumb also reflects the category path (e.g. `Início / Clothing / Men / Tops / Hoodies & Sweatshirts / Resultados da pesquisa para "Hoodie"`), and an active-filter chip ("hoodies-sweatshirts" with a "Clear All" button) is shown above the results grid.

## How each result's category is verified
Every product card in the results grid already carries a `product_cat-<slug>` CSS class directly on its container element (e.g. `product_cat-hoodies-sweatshirts`), alongside the generic `product` class. This means category membership can be asserted for **every** result directly on the results page, with no navigation required. The test asserts this class is present on every card returned.

As a secondary, user-facing confirmation (not a substitute for the class check, but a check that the class actually corresponds to what a shopper would see), the test then opens only the **first** result's product page (`/product/<slug>/`) and reads the `Category:` meta line WooCommerce renders there: `<span class="posted_in">Category: <a href="/product-category/.../hoodies-sweatshirts/">Hoodies &amp; Sweatshirts</a></span>`. It asserts that link's accessible name equals the selected category name exactly. Opening every result's product page was explicitly rejected as too slow for the marginal gain (this was the original reason TC-004-04 stayed Manual); the class-based check already covers every card, so only one representative product page needs opening.

## Concrete data verified in the browser (against the live seeded store)
This section records what was observed during exploration, to justify the approach above. **The test itself does not assert on the exact count or the exact list of names below** — that would couple it to data that can change as the catalog is reseeded; the test only asserts "at least one result" plus the category class/link checks described above.
- **Positive:** category **"Hoodies & Sweatshirts"** (`product_cat=hoodies-sweatshirts`) + term **"Hoodie"** → **7** results, stable list of names: `Marco Lightweight Active Hoodie`, `Abominable Hoodie`, `Oslo Trek Hoodie`, `Hero Hoodie`, `Stark Fundamental Hoodie`, `Teton Pullover Hoodie`, `Ajax Full-Zip Sweatshirt`. All 7 product pages were fetched and parsed for their `Category:` meta — **all 7 report exactly "Hoodies & Sweatshirts"**. No defect found: the category filter is correctly applied to every result for this data set.
  - Note: `Ajax Full-Zip Sweatshirt` matches the term "Hoodie" even though "Hoodie" is not in its title — its description text contains "hoodie" ("Mint striped full zip hoodie."), which is expected WordPress/WooCommerce full-text search behavior, not a bug.
- **Negative:** category **"Bras & Tanks"** (`product_cat=bras-tanks`) + term **"Hoodie"** → **0** results. The no-results paragraph reads exactly: **"Nenhum produto foi encontrado para a sua seleção."** (this is a superset of/matches the existing `CatalogPage.noResultsMessage` locator, which does a substring `getByText('Nenhum produto foi encontrado')`).
  - Confirmed the term itself is valid/exists elsewhere: searching "Hoodie" with **no** category filter (`/?s=Hoodie&post_type=product`) returns products (9 shown on the first results page), and searching it inside "Hoodies & Sweatshirts" returns the 7 products above. So the zero-result outcome for "Bras & Tanks" is specifically due to the category filter, not a broken/mistyped term.

## Suggested `pages/CatalogPage.ts` additions (Page Object Model — do not put locators/logic in the spec file)
```ts
// New locators
readonly categoryDropdown: Locator; // page.locator('.SumoSelect.sumo_product_cat:visible') — scoped to the one visible/interactable instance; the page renders duplicate hidden copies of this widget.
readonly categoryDropdownTrigger: Locator; // this.categoryDropdown.locator('p.CaptionCont') — shows the placeholder or the currently selected category name; click toggles the option list.

// New methods
categoryOption(name: string): Locator {
  // exact match avoids "<name>|Clothing" collisions; .first() resolves a confirmed duplicate
  // category label (same name nested under both Men > Tops and Women > Tops) — validated to
  // resolve to the intended product_cat slug for "Hoodies & Sweatshirts".
  return this.categoryDropdown.getByText(name, { exact: true }).first();
}

async selectCategory(categoryName: string) {
  await this.categoryDropdownTrigger.click();
  await this.categoryOption(categoryName).click();
  await expect(this.categoryDropdownTrigger).toHaveText(categoryName);
}

async searchInCategory(categoryName: string, term: string) {
  await this.selectCategory(categoryName);
  await this.search(term); // reuses the existing search() method
}
```

## Suggested `pages/ProductPage.ts` addition
```ts
readonly categoryLink: Locator; // page.locator('.posted_in').getByRole('link') — the "Category:" meta link on the product page.
```
Used as `await expect(productPage.categoryLink).toHaveText(categoryName)` to confirm the product truly belongs to the expected category.

## Suggested `pages/CatalogPage.ts` addition for the per-card class check
```ts
productCardCategoryClass(slug: string): string {
  return `product_cat-${slug}`;
}
```
Used from the spec as:
```ts
for (const card of await catalogPage.productCards.all()) {
  await expect(card).toHaveClass(new RegExp(catalogPage.productCardCategoryClass(category.slug)));
}
```
This asserts every card returned, without opening any product page.

## Suggested test data (`/UI/data/categories.ts`, new file)
```ts
export const categories = {
  hoodiesAndSweatshirts: {
    name: 'Hoodies & Sweatshirts',
    slug: 'hoodies-sweatshirts',
  },
  brasAndTanks: {
    name: 'Bras & Tanks',
    slug: 'bras-tanks',
  },
};
```
No `expectedProductNames` list — the test must not be coupled to the current catalog data (see "Concrete data verified" above).

## Test case ID mapping
- **TC-004-04** — "Search within a category" (positive) — already documented in `docs/test-cases/TC-US-0004-product-catalog.md` as Manual with test data `Hoodies & Sweatshirts` / `Hoodie`; this plan automates it exactly as documented and its doc entry should be flipped to "✅ UI" once implemented.
- **TC-004-07** — "Search within a category with no matches" (negative) — new case, next unused number in the `US-0004` / `tests/catalog.spec.ts` suite (TC-004-01 through TC-004-06 already exist; TC-003 is reserved for the API/coupons suite and intentionally skipped for UI numbering).

Both tests belong in `tests/catalog.spec.ts`, inside the existing `test.describe('US-0004 – Product catalog', ...)` block, reusing the existing `catalogPage.goto()` in `beforeEach`. No credentials or authenticated state are required (this is a public catalog page), so no `utils/env.ts` values are needed here — only the new `data/categories.ts` file.

## Assumptions / starting state
Each test starts fresh from `catalogPage.goto()` (`/produtos/`), with no category or search term pre-selected (native select value `""`, trigger text "Selecione uma categoria"). Tests are independent and can run in any order/in parallel; neither test depends on cart, login, or any other suite's state.

## Test Scenarios

### 1. Category search (US-0004)

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC-004-04 – should return only products from the selected category when searching within it

**File:** `tests/catalog.spec.ts`

**Steps:**
  1. Start from the products page (`catalogPage.goto()` in beforeEach, navigating to /produtos/).
    - expect: The default product grid is visible.
  2. Click the category dropdown trigger next to the search field (the styled widget showing the placeholder text "Selecione uma categoria"). This is a custom SumoSelect widget that hides a native <select name="product_cat">; clicking its visible caption opens the option list.
    - expect: The option list becomes visible/attached, showing entries such as "Clothing", "Men", "Tops", "Hoodies & Sweatshirts", etc.
  3. Click the "Hoodies & Sweatshirts" option (exact text match; the store's category tree lists this name twice — under Men > Tops and Women > Tops — so the first exact match is used, confirmed to map to the `hoodies-sweatshirts` category slug).
    - expect: The dropdown trigger's visible text changes from "Selecione uma categoria" to "Hoodies & Sweatshirts".
    - expect: The underlying native select's value becomes "hoodies-sweatshirts" (can be asserted via the hidden select if needed, but the visible trigger text change is the primary, user-facing assertion).
  4. Type "Hoodie" into the search textbox (`getByRole('textbox', { name: 'Enter your search' })`) and click the "Search" button (`getByRole('button', { name: 'Search' })`).
    - expect (mandatory, must run immediately after this step, before any other assertion): The browser navigates to a URL matching `product_cat=hoodies-sweatshirts` and `s=Hoodie` and `post_type=product` (confirmed real URL: `http://localhost/?product_cat=hoodies-sweatshirts&s=Hoodie&post_type=product`). This is placed right after the search so that accidentally selecting the wrong category option (e.g. the "Women > Tops" duplicate) fails loudly here instead of silently passing a looser downstream check.
    - expect: The page heading reads `Resultados da pesquisa por: "Hoodie"`.
  5. Read the product cards in the results grid (`.products .product`, same locator as `catalogPage.productCards`).
    - expect: At least one product card is shown (do not assert an exact count — the catalog's data can change).
    - expect: Every product card carries the `product_cat-hoodies-sweatshirts` CSS class directly on the results page (see "How each result's category is verified" above). This covers all results, not a sample.
  6. Open only the **first** result's product page (via its card link, e.g. `/product/<slug>/`) and read the "Category:" meta link near the SKU (`.posted_in a`).
    - expect: That product's category link has the accessible name "Hoodies & Sweatshirts" exactly — a user-facing confirmation that the CSS class corresponds to what a shopper actually sees. The remaining results are not opened; their category membership is already covered by step 5.

#### 1.2. TC-004-07 – should show no results when the search term has no matches in the selected category

**File:** `tests/catalog.spec.ts`

**Steps:**
  1. Start from the products page (`catalogPage.goto()`).
    - expect: The default product grid is visible.
  2. Open the category dropdown and select "Bras & Tanks" (exact text match).
    - expect: The dropdown trigger's visible text changes to "Bras & Tanks".
  3. Type "Hoodie" into the search textbox and click "Search".
    - expect: The browser navigates to a URL matching `product_cat=bras-tanks` and `s=Hoodie` and `post_type=product` (confirmed real URL: `http://localhost/?product_cat=bras-tanks&s=Hoodie&post_type=product`).
  4. Read the results area.
    - expect: Zero product cards are rendered (`.products .product` has count 0).
    - expect: The no-results message is visible; the exact text on this page is "Nenhum produto foi encontrado para a sua seleção.", which the existing `catalogPage.noResultsMessage` locator (`getByText('Nenhum produto foi encontrado')`) already matches as a substring.
  5. Sanity-check that the term itself is valid store-wide (not simply mistyped): search "Hoodie" again with no category selected (or with the category filter cleared).
    - expect: Product cards are returned (confirmed: 9 shown on the first results page without any category filter), proving "Hoodie" is a real term that exists in the store but simply has no matches inside the "Bras & Tanks" category — this is the negative condition under test, not a broken search term.
