# Test Cases – [US-0002] Login

| ID | Title | Type | Technique | Automation |
|---|---|---|---|---|
| TC-002-01 | Login with valid credentials | Happy path | Equivalence Partitioning | ✅ UI |
| TC-002-02 | Login with invalid username | Negative | Equivalence Partitioning | ✅ UI |
| TC-002-03 | Login with wrong password | Negative | Equivalence Partitioning | ✅ UI |
| TC-002-04 | Login with empty fields | Negative | Equivalence Partitioning | ✅ UI |
| TC-002-05 | Account locked after 3 failed attempts | Negative | State Transition + BVA | ❌ Manual |
| TC-002-06 | Account unlocked after 15 minutes | Alternative | State Transition | ❌ Manual |
| TC-002-07 | Inactive user cannot log in | Negative | Equivalence Partitioning | ❌ Manual |

---

### TC-002-01 – Login with valid credentials
- **Type:** Happy path · **Technique:** Equivalence Partitioning · **Priority:** High · **Automation:** ✅ UI (Playwright)
- **Preconditions:** An active account exists.
- **Test data:** Valid email and password (stored as environment variables).
- **Steps:**
  1. Open the "Minha Conta" page.
  2. Fill in the username/email and password.
  3. Click "Login".
- **Expected result:** The account menu is displayed, and the header shows "Welcome <username> !".

### TC-002-02 – Login with invalid username
- **Type:** Negative · **Technique:** Equivalence Partitioning · **Priority:** High · **Automation:** ✅ UI (Playwright)
- **Test data:** Username `invalid_user_xyz`, any password.
- **Steps:**
  1. Open the "Minha Conta" page.
  2. Fill in the invalid username and a password.
  3. Click "Login".
- **Expected result:** An error message is displayed, and the user remains on the login page.

### TC-002-03 – Login with wrong password
- **Type:** Negative · **Technique:** Equivalence Partitioning · **Priority:** High · **Automation:** ✅ UI (Playwright)
- **Preconditions:** An active account exists.
- **Test data:** Valid email, password `wrong_password`.
- **Steps:**
  1. Open the "Minha Conta" page.
  2. Fill in the valid email and the wrong password.
  3. Click "Login".
- **Expected result:** An error message is displayed, and the user remains on the login page.

### TC-002-04 – Login with empty fields
- **Type:** Negative · **Technique:** Equivalence Partitioning · **Priority:** Medium · **Automation:** ✅ UI (Playwright)
- **Steps:**
  1. Open the "Minha Conta" page.
  2. Leave both fields empty.
  3. Click "Login".
- **Expected result:** An error message informs that the username is required.

### TC-002-05 – Account locked after 3 failed attempts
- **Type:** Negative · **Technique:** State Transition + Boundary Value Analysis · **Priority:** High · **Automation:** ❌ Manual
- **Preconditions:** An active account with no recent failed attempts.
- **State transition table:**

  | Current state | Event | Next state |
  |---|---|---|
  | Unlocked (0 failures) | Wrong password | Unlocked (1 failure) |
  | Unlocked (1 failure) | Wrong password | Unlocked (2 failures) |
  | Unlocked (2 failures) | Wrong password | **Locked (15 min)** |
  | Unlocked (2 failures) | Correct password | Logged in |

- **Steps:**
  1. Enter a wrong password 3 times in a row.
  2. Try to log in with the correct password.
- **Expected result:** After the 3rd failure, login is locked for 15 minutes, and a message informs about the lock.
- **Why manual:** requires controlling the account state between executions, which is out of scope for the first automation cycle.

### TC-002-06 – Account unlocked after 15 minutes
- **Type:** Alternative · **Technique:** State Transition · **Priority:** Medium · **Automation:** ❌ Manual
- **Preconditions:** The account was locked by TC-002-05.
- **Steps:**
  1. Wait 15 minutes after the lock.
  2. Log in with valid credentials.
- **Expected result:** Login succeeds.
- **Why manual:** time-dependent (15-minute wait).

### TC-002-07 – Inactive user cannot log in
- **Type:** Negative · **Technique:** Equivalence Partitioning · **Priority:** High · **Automation:** ❌ Manual
- **Preconditions:** An account deactivated through the admin panel.
- **Steps:**
  1. Log in with the inactive account's valid credentials.
- **Expected result:** Login is rejected, and a message informs that the account is inactive.
- **Note:** WooCommerce has no native "inactive user" status; how accounts are deactivated must be confirmed with the PO.