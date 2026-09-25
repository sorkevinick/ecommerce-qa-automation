# Test Cases – [US-0005] My Account Dashboard

| ID | Title | Type | Technique | Automation |
|---|---|---|---|---|
| TC-005-01 | Dashboard is displayed after login | Happy path | Equivalence Partitioning | ✅ UI |
| TC-005-02 | Navigate through the account sections | Happy path | Equivalence Partitioning | ❌ Manual |
| TC-005-03 | Logout ends the session | Alternative | Equivalence Partitioning | ✅ UI |
| TC-005-04 | Unauthenticated user sees login and register forms | Negative | Equivalence Partitioning | ❌ Manual |
| TC-005-05 | Register a new account | Happy path | Equivalence Partitioning | ✅ UI |

---

### TC-005-01 – Dashboard is displayed after login
- **Type:** Happy path · **Priority:** High · **Automation:** ✅ UI (Playwright)
- **Preconditions:** An active account exists.
- **Steps:**
  1. Log in with valid credentials.
- **Expected result:** The account menu shows Painel, Pedidos, Downloads, Endereços, Detalhes da conta and Sair, and the header shows "Welcome <username> !".

### TC-005-02 – Navigate through the account sections
- **Type:** Happy path · **Priority:** Low · **Automation:** ❌ Manual
- **Preconditions:** User is logged in.
- **Test data:**

  | Menu | Expected page title |
  |---|---|
  | Pedidos | PEDIDOS |
  | Endereços | ENDEREÇOS |
  | Detalhes da conta | DETALHES DA CONTA |

- **Steps:**
  1. Click each menu item.
- **Expected result:** The page title matches the table.
- **Why manual:** this navigation is already exercised indirectly by the automated tests of US-0006 to US-0008.

### TC-005-03 – Logout ends the session
- **Type:** Alternative · **Priority:** High · **Automation:** ✅ UI (Playwright)
- **Preconditions:** User is logged in.
- **Steps:**
  1. Click "Sair" in the account menu.
- **Expected result:** The Login and Register forms are displayed, and the account menu is no longer visible.

### TC-005-04 – Unauthenticated user sees login and register forms
- **Type:** Negative · **Priority:** Medium · **Automation:** ❌ Manual
- **Preconditions:** User is not logged in.
- **Steps:**
  1. Open the "Minha Conta" page.
- **Expected result:** The Login and Register forms are displayed; the account menu is not.

### TC-005-05 – Register a new account
- **Type:** Happy path · **Priority:** High · **Automation:** ✅ UI (Playwright)
- **Test data:** A unique email generated at runtime (e.g., `qa.<timestamp>@ebac.com`) and a strong password.
- **Steps:**
  1. Open the "Minha Conta" page.
  2. Fill in the Register form.
  3. Click "Register".
- **Expected result:** The user is logged in, and the account menu is displayed.
- **Note:** this flow also creates fresh accounts for other tests (e.g., "customer without orders").