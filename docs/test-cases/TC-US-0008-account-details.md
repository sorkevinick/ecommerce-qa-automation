# Test Cases – [US-0008] Account Details

| ID | Title | Type | Technique | Automation |
|---|---|---|---|---|
| TC-008-01 | Update personal details successfully | Happy path | Equivalence Partitioning | ✅ UI |
| TC-008-02 | Required field left empty | Negative | Equivalence Partitioning | ❌ Manual |
| TC-008-03 | Password is kept when fields are left blank | Alternative | Equivalence Partitioning | ❌ Manual |
| TC-008-04 | Change password successfully | Happy path | Equivalence Partitioning | ❌ Manual |
| TC-008-05 | Password change with wrong current password | Negative | Equivalence Partitioning | ✅ UI |
| TC-008-06 | Password confirmation does not match | Negative | Equivalence Partitioning | ✅ UI |

---

### TC-008-01 – Update personal details successfully
- **Type:** Happy path · **Priority:** High · **Automation:** ✅ UI (Playwright)
- **Preconditions:** User is logged in and on "Detalhes da conta".
- **Test data:** New first name and last name.
- **Steps:**
  1. Change the first name and last name.
  2. Click "Save Changes".
- **Expected result:** A success message is displayed, and the updated name is shown.

### TC-008-02 – Required field left empty
- **Type:** Negative · **Priority:** Medium · **Automation:** ❌ Manual
- **Test data:** First name, Last name, Display name, Email address (one empty field per execution).
- **Steps:**
  1. Clear the field under test.
  2. Click "Save Changes".
- **Expected result:** An error message informs that the field is required.

### TC-008-03 – Password is kept when fields are left blank
- **Type:** Alternative · **Priority:** Medium · **Automation:** ❌ Manual
- **Steps:**
  1. Change the first name, leaving all password fields blank.
  2. Click "Save Changes".
  3. Log out and log in with the current password.
- **Expected result:** Login succeeds with the current password.

### TC-008-04 – Change password successfully
- **Type:** Happy path · **Priority:** High · **Automation:** ❌ Manual
- **Steps:**
  1. Fill in the current password, a new password and the matching confirmation.
  2. Click "Save Changes".
  3. Log out and log in with the new password.
- **Expected result:** A success message is displayed, and login with the new password succeeds.
- **Why manual:** automating it would change the credentials of the shared test account and break other tests.

### TC-008-05 – Password change with wrong current password
- **Type:** Negative · **Priority:** High · **Automation:** ✅ UI (Playwright)
- **Steps:**
  1. Fill in a wrong current password, a new password and the matching confirmation.
  2. Click "Save Changes".
- **Expected result:** An error message informs that the current password is incorrect, and the password is not changed.

### TC-008-06 – Password confirmation does not match
- **Type:** Negative · **Priority:** High · **Automation:** ✅ UI (Playwright)
- **Steps:**
  1. Fill in the correct current password, a new password and a different confirmation.
  2. Click "Save Changes".
- **Expected result:** An error message informs that the passwords do not match.