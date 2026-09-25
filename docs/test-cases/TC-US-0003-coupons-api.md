# Test Cases – [US-0003] Coupons API

All requests use Basic Auth with admin credentials stored as environment variables.
Every successful response must also pass **contract (schema) validation**.

| ID | Title | Type | Technique | Automation |
|---|---|---|---|---|
| TC-003-01 | List all coupons | Happy path | Equivalence Partitioning | ✅ API |
| TC-003-02 | Retrieve a coupon by ID | Happy path | Equivalence Partitioning | ✅ API |
| TC-003-03 | Retrieve a non-existent coupon | Negative | Error Guessing | ✅ API |
| TC-003-04 | Create a coupon with all required fields | Happy path | Equivalence Partitioning | ✅ API |
| TC-003-05 | Create a coupon with a duplicated code | Negative | Equivalence Partitioning | ✅ API |
| TC-003-06 | Create a coupon without a required field | Negative | Decision Table | ✅ API |
| TC-003-07 | Request without authentication | Negative | Error Guessing | ✅ API |

---

### TC-003-01 – List all coupons
- **Type:** Happy path · **Priority:** High · **Automation:** ✅ API (Supertest)
- **Request:** `GET /wc/v3/coupons`
- **Expected result:** Status `200`; the body is an array of coupons matching the coupon schema.

### TC-003-02 – Retrieve a coupon by ID
- **Type:** Happy path · **Priority:** High · **Automation:** ✅ API (Supertest)
- **Preconditions:** A coupon exists (created in the test setup).
- **Request:** `GET /wc/v3/coupons/{id}`
- **Expected result:** Status `200`; the body contains the coupon with the requested `id` and matches the schema.

### TC-003-03 – Retrieve a non-existent coupon
- **Type:** Negative · **Priority:** Medium · **Automation:** ✅ API (Supertest)
- **Request:** `GET /wc/v3/coupons/999999999`
- **Expected result:** Status `404` with an error message.

### TC-003-04 – Create a coupon with all required fields
- **Type:** Happy path · **Priority:** High · **Automation:** ✅ API (Supertest)
- **Test data:** a unique code generated at runtime (e.g., `Ganhe10-<timestamp>`), so the test can run repeatedly.
- **Request:** `POST /wc/v3/coupons`
```json
  {
    "code": "Ganhe10-<timestamp>",
    "amount": "10.00",
    "discount_type": "fixed_product",
    "description": "Test coupon"
  }
```
- **Expected result:** Status `201`; the body returns the sent values and matches the schema.

### TC-003-05 – Create a coupon with a duplicated code
- **Type:** Negative · **Priority:** High · **Automation:** ✅ API (Supertest)
- **Preconditions:** A coupon with the same code already exists (created in the test setup).
- **Request:** `POST /wc/v3/coupons` with the existing code.
- **Expected result:** Status `400` with an error message about the duplicated code.

### TC-003-06 – Create a coupon without a required field
- **Type:** Negative · **Technique:** Decision Table · **Priority:** High · **Automation:** ✅ API (Supertest, data-driven)
- **Decision table:**

  | code | amount | discount_type | description | Expected |
  |---|---|---|---|---|
  | ✅ | ✅ | ✅ | ✅ | `201` |
  | ❌ | ✅ | ✅ | ✅ | `400` |
  | ✅ | ❌ | ✅ | ✅ | `400` |
  | ✅ | ✅ | ❌ | ✅ | `400` |
  | ✅ | ✅ | ✅ | ❌ | `400` |

- **Expected result:** Any request missing a required field returns `400`.
- **Note:** WooCommerce natively requires only `code`. If other rows return `201`, the business rule is not implemented and a defect must be reported.

### TC-003-07 – Request without authentication
- **Type:** Negative · **Priority:** High · **Automation:** ✅ API (Supertest)
- **Request:** `GET /wc/v3/coupons` without the `Authorization` header.
- **Expected result:** Status `401`.