# [US-0003] Coupons API

| Field | Value |
|---|---|
| **Project** | EBAC-SHOP |
| **Priority** | Medium |
| **Story Points** | 13 |

## User Story
**As** an EBAC-SHOP admin
**I want** a coupon service
**So that** I can list and create coupons

## Business Rules
**GET `/wc/v3/coupons`**
- Must list all coupons or retrieve a coupon by ID.

**POST `/wc/v3/coupons`**
- Required fields: `code`, `amount`, `discount_type` and `description`.
- The coupon code cannot be duplicated.
- All other fields are optional.

**Authentication:** Basic Auth (admin credentials, stored as environment variables, never in the code).

## Acceptance Criteria

```gherkin
Feature: Coupons API
  As an EBAC-SHOP admin
  I want a coupon service
  So that I can list and create coupons

  Background:
    Given I am authenticated as an admin

  Scenario: List all coupons
    When I send a GET request to "/wc/v3/coupons"
    Then the response status should be 200
    And the response should contain a list of coupons

  Scenario: Retrieve a coupon by ID
    Given a coupon exists
    When I send a GET request to "/wc/v3/coupons/{id}"
    Then the response status should be 200
    And the response should contain the coupon with the requested ID

  Scenario: Create a coupon with all required fields
    When I send a POST request to "/wc/v3/coupons" with:
      | code          | amount | discount_type | description        |
      | UniqueCode123 | 10.00  | fixed_product | Test coupon        |
    Then the response status should be 201
    And the response should contain the created coupon

  Scenario: Duplicated coupon code is rejected
    Given a coupon with code "Ganhe10" already exists
    When I send a POST request to create a coupon with code "Ganhe10"
    Then the response status should be 400
    And the response should contain an error message

  Scenario Outline: Coupon creation fails without a required field
    When I send a POST request to "/wc/v3/coupons" without the "<field>" field
    Then the response status should be 400

    Examples:
      | field         |
      | code          |
      | amount        |
      | discount_type |
      | description   |

  Scenario: Request without authentication is rejected
    Given I am not authenticated
    When I send a GET request to "/wc/v3/coupons"
    Then the response status should be 401
```

## Open Questions
- Which status code is expected for a non-existent coupon ID? *Answered by exploration: the API returns `404`.*

## Exploratory Testing Notes
- **Required fields not enforced:** only `code` is validated; `amount`, `discount_type` and `description` are accepted when missing (see BUG-003).
- **Code normalization:** coupon codes are stored in lowercase (e.g., `Ganhe10` is saved as `ganhe10`).
- **Error contract:** every error response follows the same structure: `code`, `message` and `data.status`.