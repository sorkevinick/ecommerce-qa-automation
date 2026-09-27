# Test Cases – [US-0009] Product Catalog – Store Manager App

**Precondition for all cases:** logged in as the store manager, on the Products tab.

| ID | Title | Type | Technique | Automation |
|---|---|---|---|---|
| TC-009-01 | Product list is displayed | Happy path | Equivalence Partitioning | ✅ Mobile |
| TC-009-02 | Search for an existing product | Happy path | Equivalence Partitioning | ✅ Mobile |
| TC-009-03 | Search with no results | Negative | Error Guessing | ✅ Mobile |
| TC-009-04 | Open product details | Happy path | Equivalence Partitioning | ✅ Mobile |
| TC-009-05 | Sort products from Z to A | Alternative | Equivalence Partitioning | ❌ Manual |

---

### TC-009-01 – Product list is displayed
- **Steps:** Open the Products tab.
- **Expected result:** Products are listed with their stock status ("In stock" or "Out of stock").

### TC-009-02 – Search for an existing product
- **Test data:** `Abominable Hoodie`
- **Steps:** Tap the search icon and type the product name.
- **Expected result:** "Abominable Hoodie" appears in the results.

### TC-009-03 – Search with no results
- **Test data:** `xyz123`
- **Steps:** Tap the search icon and type the search term.
- **Expected result:** The message "We're sorry, we couldn't find results for "xyz123"" is displayed.

### TC-009-04 – Open product details
- **Steps:** Search for "Abominable Hoodie" and tap the product.
- **Expected result:** The product details screen shows the name "Abominable Hoodie".

### TC-009-05 – Sort products from Z to A
- **Steps:** Tap "A to Z" and select the Z-to-A option.
- **Expected result:** Products are listed in reverse alphabetical order.
- **Why manual:** the shared store changes constantly, making the full list order unreliable to assert automatically.