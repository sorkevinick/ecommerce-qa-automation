# EBAC Shop – QA Engineering Project

End-to-end quality strategy for the EBAC Shop e-commerce: test planning,
BDD acceptance criteria, UI/API/Mobile automation, CI and performance testing.

> Final project for the **Software Quality Engineer** program at EBAC.

## Project Structure
| Folder | Content |
|---|---|
| `UI/` | Web automation |
| `API/` | API tests with Supertest + contract validation |
| `Mobile/` | Android app automation |
| `performance/` | k6 load tests |
| `docs/` | Test strategy, user stories, test cases and final report |

## Documentation
- [Test Strategy](docs/test-strategy.md)
- [UI Tool Comparison](docs/ui-tool-comparison.md)

### User Stories
- [US-0001 – Add Item to Cart](docs/user-stories/US-0001-add-to-cart.md)
- [US-0002 – Login](docs/user-stories/US-0002-login.md)
- [US-0003 – Coupons API](docs/user-stories/US-0003-coupons-api.md)
- [US-0004 – Product Catalog](docs/user-stories/US-0004-product-catalog.md)
- [US-0005 – My Account Dashboard](docs/user-stories/US-0005-my-account-dashboard.md)
- [US-0006 – My Orders](docs/user-stories/US-0006-my-orders.md)
- [US-0007 – Addresses](docs/user-stories/US-0007-addresses.md)
- [US-0008 – Account Details](docs/user-stories/US-0008-account-details.md)

### Test Cases
- [Coverage Summary](docs/test-cases/README.md)
- [US-0001 – Add Item to Cart](docs/test-cases/TC-US-0001-add-to-cart.md)
- [US-0002 – Login](docs/test-cases/TC-US-0002-login.md)
- [US-0003 – Coupons API](docs/test-cases/TC-US-0003-coupons-api.md)
- [US-0004 – Product Catalog](docs/test-cases/TC-US-0004-product-catalog.md)
- [US-0005 – My Account Dashboard](docs/test-cases/TC-US-0005-my-account-dashboard.md)
- [US-0006 – My Orders](docs/test-cases/TC-US-0006-my-orders.md)
- [US-0007 – Addresses](docs/test-cases/TC-US-0007-addresses.md)
- [US-0008 – Account Details](docs/test-cases/TC-US-0008-account-details.md)

### Bug Reports
- [BUG-001 – Quantity limit not enforced](docs/bugs/BUG-001-quantity-limit-not-enforced.md)
- [BUG-002 – Coupon not applied](docs/bugs/BUG-002-coupon-not-applied.md)
- [BUG-003 – Coupons API does not validate required fields](docs/bugs/BUG-003-coupon-required-fields-not-validated.md)

## Tech Stack
| Layer | Tools |
|---|---|
| UI | Playwright + TypeScript |
| API | Supertest + Jest |
| Mobile | WebdriverIO + Appium (Android) |
| Performance | k6 |
| CI | GitHub Actions |
| Reports | Allure |
| Environment | Docker |

## How to Run
### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Start the store locally
```bash
docker network create --attachable ebac-network
docker run -d --name wp_db -p 3306:3306 --network ebac-network ernestosbarbosa/lojaebacdb:latest
docker run -d --name wp -p 80:80 --network ebac-network ernestosbarbosa/lojaebac:latest
```
The store will be available at `http://localhost`.

> **Apple Silicon (M1/M2/M3):** add `--platform linux/amd64` to both `docker run` commands.

### 2. Run the UI tests
```bash
cd UI
npm install
npx playwright install
cp .env.example .env    # then fill in the credentials of a test account created in the store
npx playwright test
npx playwright show-report
```

> Values containing `#` must be wrapped in quotes in the `.env` file (e.g., `USER_PASSWORD="abc#123"`).

### 3. Run the API tests
```bash
cd API
npm install
cp .env.example .env    # then fill in the admin API credentials
npm test
open reports/api-report.html
```

**Useful commands**

| Command | Purpose |
|---|---|
| `npx playwright test --project=chromium` | Run in a single browser |
| `npx playwright test --ui` | Interactive mode with step-by-step debugging |
| `npx playwright test --repeat-each=5` | Repeat tests to detect flakiness |

## Key Engineering Decisions

- **Page Object Model:** each page is a class that holds its locators and actions, so UI changes are fixed in one place.
- **Resilient locators:** role- and text-based locators first; IDs only when labels are ambiguous (e.g., two "Password" fields on the same page); never dynamically generated IDs.
- **Session reuse:** login runs once (`storageState`) and is shared only by tests that need it. Logout and purchase tests use their own sessions to stay isolated.
- **Known bugs tracked in code:** tests for known defects are marked with `test.fail()` and linked to their bug reports, so the suite stays green without hiding them.
- **Flaky test prevention:** every action waits for the page to confirm its result (e.g., add-to-cart confirmation, filled values, selected variations) instead of using fixed timeouts. Stability was validated with `--repeat-each`.