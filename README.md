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
_In progress_