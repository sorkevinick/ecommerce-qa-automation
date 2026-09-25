# BUG-001 – Quantity limit of 10 units per product is not enforced

| Field | Value |
|---|---|
| **Severity** | Major |
| **Priority** | High |
| **Status** | Open |
| **Environment** | Local (Docker) – `http://localhost` |
| **Related** | US-0001 · TC-001-03 |

## Description
The store allows adding more than 10 units of the same product to the cart,
violating the business rule defined in US-0001.

## Steps to Reproduce
1. Open the "Aero Daily Fitness Tee" product page.
2. Select size "XS" and color "Black".
3. Set the quantity to 11.
4. Click "Comprar".
5. Open the cart.

## Expected Result
The product is not added, and an error message informs that the limit is 10 units per product.

## Actual Result
11 units are added to the cart (total R$ 264,00), with no error message.

## Evidence
![Cart with 11 units](evidence/BUG-001.png)

## Automated Test
`UI/tests/cart.spec.ts` – TC-001-03 (marked with `test.fail()` until the fix).