# BUG-003 – Coupons API does not validate required fields

| Field | Value |
|---|---|
| **Severity** | Major |
| **Priority** | High |
| **Status** | Open |
| **Environment** | Local (Docker) – `http://localhost/wp-json/wc/v3` |
| **Related** | US-0003 · TC-003-06 |

## Description
US-0003 defines `code`, `amount`, `discount_type` and `description` as required fields
for coupon creation. The API only validates `code` and accepts requests missing any
of the other three.

## Steps to Reproduce
Send an authenticated `POST /coupons` request without the `description` field:
```json
{
  "code": "explore-002",
  "amount": "10",
  "discount_type": "fixed_product"
}
```
Repeat omitting `amount` and `discount_type`, one at a time.

## Expected Result
Status `400` with an error message indicating the missing field.

## Actual Result
Status `201`: the coupon is created. When `description` is omitted, it is saved as an empty string.

| Missing field | Expected | Actual |
|---|---|---|
| `code` | 400 | 400 ✅ |
| `amount` | 400 | 201 ❌ |
| `discount_type` | 400 | 201 ❌ |
| `description` | 400 | 201 ❌ |

## Automated Test
`API/tests/coupons.test.ts` – TC-003-06 (marked with `test.failing` until the fix).