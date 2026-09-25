# Test Cases – [US-0007] Addresses

| ID | Title | Type | Technique | Automation |
|---|---|---|---|---|
| TC-007-01 | Billing address is saved from the first checkout | Happy path | Equivalence Partitioning | ❌ Manual |
| TC-007-02 | Shipping address not set up yet | Alternative | Equivalence Partitioning | ❌ Manual |
| TC-007-03 | Add a shipping address | Happy path | Equivalence Partitioning | ✅ UI |
| TC-007-04 | Required field left empty | Negative | Equivalence Partitioning | ✅ UI |
| TC-007-05 | Invalid postcode and email | Negative | Boundary Value Analysis + EP | ❌ Manual |

---

### TC-007-01 – Billing address is saved from the first checkout
- **Type:** Happy path · **Priority:** Medium · **Automation:** ❌ Manual
- **Preconditions:** A new account that has just completed its first checkout.
- **Steps:**
  1. Open "Endereços".
- **Expected result:** The Billing Address shows the data entered at checkout.

### TC-007-02 – Shipping address not set up yet
- **Type:** Alternative · **Priority:** Low · **Automation:** ❌ Manual
- **Preconditions:** An account without a saved shipping address.
- **Steps:**
  1. Open "Endereços".
- **Expected result:** The message "You have not set up this type of address yet." is displayed under Shipping Address.

### TC-007-03 – Add a shipping address
- **Type:** Happy path · **Priority:** High · **Automation:** ✅ UI (Playwright)
- **Preconditions:** User is logged in.
- **Test data:** Valid name, street address, city, state and postcode.
- **Steps:**
  1. Open "Endereços".
  2. Click "Edit" on Shipping Address.
  3. Fill in all required fields and save.
- **Expected result:** A success message is displayed, and the shipping address shows the saved data.

### TC-007-04 – Required field left empty
- **Type:** Negative · **Priority:** High · **Automation:** ✅ UI (Playwright, data-driven)
- **Preconditions:** User is editing the billing address.
- **Test data:** Nome, Endereço, Cidade, CEP, Telefone (one empty field per execution).
- **Steps:**
  1. Clear the field under test.
  2. Save the address.
- **Expected result:** An error message is displayed for the empty field, and the address is not saved.

### TC-007-05 – Invalid postcode and email
- **Type:** Negative · **Technique:** Boundary Value Analysis + Equivalence Partitioning · **Priority:** Medium · **Automation:** ❌ Manual
- **Preconditions:** User is editing the billing address.
- **Test data:**

  | Field | Value | Expected |
  |---|---|---|
  | CEP | `1000000` (7 digits) | Error |
  | CEP | `10000000` (8 digits) | Saved as `10000-000` |
  | CEP | `100000000` (9 digits) | Error |
  | E-mail | `invalid-email` | Error |

- **Steps:**
  1. Fill in the field with each value.
  2. Save the address.
- **Expected result:** Results match the table.