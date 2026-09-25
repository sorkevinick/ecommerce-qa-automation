# Test Cases

## Coverage Summary

| User Story | Test Cases | Automated | Manual | Automation Tool |
|---|---|---|---|---|
| [US-0001 – Add Item to Cart](TC-US-0001-add-to-cart.md) | 6 | 4 | 2 | Playwright |
| [US-0002 – Login](TC-US-0002-login.md) | 7 | 4 | 3 | Playwright |
| [US-0003 – Coupons API](TC-US-0003-coupons-api.md) | 7 | 7 | 0 | Supertest |
| [US-0004 – Product Catalog](TC-US-0004-product-catalog.md) | 6 | 5 | 1 | Playwright + Appium |
| [US-0005 – My Account Dashboard](TC-US-0005-my-account-dashboard.md) | 5 | 3 | 2 | Playwright |
| [US-0006 – My Orders](TC-US-0006-my-orders.md) | 4 | 2 | 2 | Playwright |
| [US-0007 – Addresses](TC-US-0007-addresses.md) | 5 | 2 | 3 | Playwright |
| [US-0008 – Account Details](TC-US-0008-account-details.md) | 6 | 3 | 3 | Playwright |
| **Total** | **46** | **30** | **16** | |

## Automation Criteria
A test case is automated when it is **critical**, **repeatable** and **stable**.
It stays manual when it depends on time (e.g., 15-minute lock), on data prepared
in the admin panel, changes shared test data, or is a security check run in
exploratory sessions.

## Techniques Applied
Equivalence Partitioning, Boundary Value Analysis, Decision Table,
State Transition and Error Guessing.