# Test Cases – [US-0006] My Orders

| ID | Title | Type | Technique | Automation |
|---|---|---|---|---|
| TC-006-01 | New order is displayed in the order history | Happy path | Equivalence Partitioning | ✅ UI (E2E) |
| TC-006-02 | View order details | Happy path | Equivalence Partitioning | ✅ UI |
| TC-006-03 | Customer without orders | Alternative | Equivalence Partitioning | ❌ Manual |
| TC-006-04 | Customer cannot view another customer's order | Negative | Error Guessing (Security) | ❌ Manual |

---

### TC-006-01 – New order is displayed in the order history
- **Type:** Happy path · **Priority:** High · **Automation:** ✅ UI (Playwright, end-to-end)
- **Preconditions:** User is logged in, and the cart is empty.
- **Test data:** Product `Abominable Hoodie` (XS, Blue); payment method "Pagamento na entrega".
- **Steps:**
  1. Add the product to the cart.
  2. Go to checkout, fill in the billing details and accept the terms.
  3. Click "Finalizar Compra" and note the order number.
  4. Open "Pedidos".
- **Expected result:** The order appears with its number, date, total ("R$69,00 de 1 item") and status "Processando".

### TC-006-02 – View order details
- **Type:** Happy path · **Priority:** High · **Automation:** ✅ UI (Playwright)
- **Preconditions:** The user has at least one order.
- **Steps:**
  1. Open "Pedidos".
  2. Click "Visualizar" on an order.
- **Expected result:** The page shows the products, subtotal, payment method, total and billing address.

### TC-006-03 – Customer without orders
- **Type:** Alternative · **Priority:** Low · **Automation:** ❌ Manual
- **Preconditions:** A newly registered account with no orders.
- **Steps:**
  1. Open "Pedidos".
- **Expected result:** A message informs that no orders have been made yet.

### TC-006-04 – Customer cannot view another customer's order (IDOR)
- **Type:** Negative · **Technique:** Error Guessing (Security) · **Priority:** High · **Automation:** ❌ Manual
- **Preconditions:** Two accounts (A and B); account B has an order.
- **Steps:**
  1. Log in with account B and copy the URL of one of its orders.
  2. Log out and log in with account A.
  3. Open the copied URL.
- **Expected result:** The order details are not displayed to account A.
- **Why manual:** security checks like this are run in exploratory sessions before each release.