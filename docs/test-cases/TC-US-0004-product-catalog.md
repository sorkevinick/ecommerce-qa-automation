# Test Cases – [US-0004] Product Catalog

| ID | Title | Type | Technique | Automation |
|---|---|---|---|---|
| TC-004-01 | Products are displayed with name, image and price | Happy path | Equivalence Partitioning | ✅ UI · ✅ Mobile |
| TC-004-02 | Search for an existing product | Happy path | Equivalence Partitioning | ✅ UI · ✅ Mobile |
| TC-004-03 | Search with no results | Negative | Error Guessing | ✅ UI |
| TC-004-04 | Search within a category | Alternative | Equivalence Partitioning | ❌ Manual |
| TC-004-05 | Sort products by price | Happy path | Equivalence Partitioning | ✅ UI |
| TC-004-06 | Add to cart requires size and color | Negative | Decision Table | ✅ UI |

---

### TC-004-01 – Products are displayed with name, image and price
- **Type:** Happy path · **Technique:** Equivalence Partitioning · **Priority:** High · **Automation:** ✅ UI (Playwright) · ✅ Mobile (Appium)
- **Steps:**
  1. Open the products page.
- **Expected result:** Every product card displays a name, an image and a price.

### TC-004-02 – Search for an existing product
- **Type:** Happy path · **Technique:** Equivalence Partitioning · **Priority:** High · **Automation:** ✅ UI (Playwright) · ✅ Mobile (Appium)
- **Test data:** `Abominable Hoodie`
- **Steps:**
  1. Type the product name in the search field.
  2. Click "Search".
- **Expected result:** The results contain "Abominable Hoodie".

### TC-004-03 – Search with no results
- **Type:** Negative · **Technique:** Error Guessing · **Priority:** Medium · **Automation:** ✅ UI (Playwright)
- **Test data:** `nonexistent product xyz`
- **Steps:**
  1. Type the search term in the search field.
  2. Click "Search".
- **Expected result:** A message informs that no products were found.

### TC-004-04 – Search within a category
- **Type:** Alternative · **Technique:** Equivalence Partitioning · **Priority:** Medium · **Automation:** ❌ Manual
- **Test data:** Category `Hoodies & Sweatshirts`, term `Hoodie`
- **Steps:**
  1. Select the category in the "Selecione uma categoria" dropdown.
  2. Type the search term.
  3. Click "Search".
- **Expected result:** All results belong to the selected category.
- **Why manual:** checking each result's category requires opening every product page, which makes automation slow for little gain.

### TC-004-05 – Sort products by price
- **Type:** Happy path · **Technique:** Equivalence Partitioning · **Priority:** Medium · **Automation:** ✅ UI (Playwright, data-driven)
- **Test data:**

  | Option | Expected order |
  |---|---|
  | Ordenar por preço: menor para maior | Ascending |
  | Ordenar por preço: maior para menor | Descending |

- **Steps:**
  1. Open the products page.
  2. Select the sorting option.
- **Expected result:** The displayed prices follow the expected order.

### TC-004-06 – Add to cart requires size and color
- **Type:** Negative · **Technique:** Decision Table · **Priority:** High · **Automation:** ✅ UI (Playwright, data-driven)
- **Test data:** Product `Abominable Hoodie`
- **Decision table:**

  | Size selected | Color selected | "Comprar" button |
  |---|---|---|
  | No | No | Disabled |
  | Yes | No | Disabled |
  | No | Yes | Disabled |
  | Yes | Yes | **Enabled** |

- **Steps:**
  1. Open the product page.
  2. Apply each combination from the table.
- **Expected result:** The button state matches the decision table.