# Test Cases – [US-0001] Add Item to Cart

| ID | Title | Type | Technique | Automation |
|---|---|---|---|---|
| TC-001-01 | Add a product to the cart successfully | Happy path | Equivalence Partitioning | ✅ UI |
| TC-001-02 | Add 10 units of the same product | Happy path | Boundary Value Analysis | ✅ UI |
| TC-001-03 | Add 11 units of the same product | Negative | Boundary Value Analysis | ✅ UI |
| TC-001-04 | Remove a product from the cart | Alternative | Equivalence Partitioning | ✅ UI |
| TC-001-05 | Cart total limit of R$ 990.00 | Negative | Boundary Value Analysis | ❌ Manual |
| TC-001-06 | Automatic coupon based on cart total | Happy path | Decision Table + BVA | ❌ Manual |

---

### TC-001-01 – Add a product to the cart successfully
- **Type:** Happy path · **Technique:** Equivalence Partitioning · **Priority:** High · **Automation:** ✅ UI (Playwright)
- **Preconditions:** Cart is empty.
- **Test data:** Product "Abominable Hoodie", size XS, color Blue, quantity 1.
- **Steps:**
  1. Open the "Abominable Hoodie" product page.
  2. Select size "XS" and color "Blue".
  3. Click "Comprar".
- **Expected result:** A success message is displayed, and the cart shows 1 item with a total of R$ 69,00.

### TC-001-02 – Add 10 units of the same product (upper boundary)
- **Type:** Happy path · **Technique:** Boundary Value Analysis · **Priority:** High · **Automation:** ✅ UI (Playwright)
- **Preconditions:** Cart is empty.
- **Test data:** Product "Aero Daily Fitness Tee" (R$ 24,00), any valid size and color, quantity 10.
- **Steps:**
  1. Open the product page.
  2. Select a size and a color.
  3. Set the quantity to 10.
  4. Click "Comprar".
- **Expected result:** 10 units are added to the cart successfully.

### TC-001-03 – Add 11 units of the same product (above the limit)
- **Type:** Negative · **Technique:** Boundary Value Analysis · **Priority:** High · **Automation:** ✅ UI (Playwright)
- **Preconditions:** Cart is empty.
- **Test data:** Product "Aero Daily Fitness Tee", quantity 11.
- **Steps:**
  1. Open the product page.
  2. Select a size and a color.
  3. Set the quantity to 11.
  4. Click "Comprar".
- **Expected result:** The product is not added, and an error message informs that the limit is 10 units per product.

### TC-001-04 – Remove a product from the cart
- **Type:** Alternative · **Technique:** Equivalence Partitioning · **Priority:** Medium · **Automation:** ✅ UI (Playwright)
- **Preconditions:** Cart contains 1 product.
- **Steps:**
  1. Open the cart page.
  2. Click the "Remove" (trash) icon on the product.
- **Expected result:** The product is removed, and the cart is empty.

### TC-001-05 – Cart total limit of R$ 990.00
- **Type:** Negative · **Technique:** Boundary Value Analysis · **Priority:** High · **Automation:** ❌ Manual
- **Preconditions:** Test data prepared so the cart reaches each exact total (e.g., product prices adjusted in the admin panel).
- **Test data:**

  | Cart total | Expected |
  |---|---|
  | R$ 989,99 | Allowed |
  | R$ 990,00 | Allowed |
  | R$ 990,01 | Blocked |

- **Steps:**
  1. Add products until the cart reaches the total in the table.
  2. Try to proceed to checkout.
- **Expected result:** Totals up to R$ 990,00 are allowed; above that, the purchase is blocked with an error message.
- **Why manual:** exact totals depend on data prepared in the admin panel.

### TC-001-06 – Automatic coupon based on cart total
- **Type:** Happy path · **Technique:** Decision Table + Boundary Value Analysis · **Priority:** High · **Automation:** ❌ Manual
- **Preconditions:** Test data prepared so the cart reaches each exact total.
- **Decision table:**

  | Cart total | < R$ 200 | R$ 200 – 600 | > R$ 600 |
  |---|---|---|---|
  | **Test values** | R$ 199,99 | R$ 200,00 / R$ 600,00 | R$ 600,01 |
  | **Expected coupon** | None | 10% | 15% |

- **Steps:**
  1. Add products until the cart reaches each test value.
  2. Open the cart page.
- **Expected result:** The discount applied matches the decision table.
- **Note:** R$ 600,00 is assumed to receive 10% (see Open Questions in US-0001).