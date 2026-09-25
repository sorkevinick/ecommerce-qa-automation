# [US-0001] Add Item to Cart

| Field | Value |
|---|---|
| **Project** | EBAC-SHOP |
| **Priority** | Medium |
| **Story Points** | 13 |

## User Story
**As** an EBAC-SHOP customer
**I want** to add products to the cart
**So that** I can purchase the items

## Business Rules
- A maximum of 10 units of the same product can be added to the cart.
- The cart total cannot exceed R$ 990.00.
- Cart totals between R$ 200.00 and R$ 600.00 receive a 10% coupon.
- Cart totals above R$ 600.00 receive a 15% coupon.

## Acceptance Criteria

```gherkin
Feature: Add item to cart
  As an EBAC-SHOP customer
  I want to add products to the cart
  So that I can purchase the items

  Background:
    Given I am on a product page

  Scenario: Add a product to the cart successfully
    When I select a size and a color
    And I add 1 unit to the cart
    Then the product should be displayed in the cart
    And the cart total should be updated

  Scenario Outline: Quantity limit per product
    When I add <quantity> units of the same product to the cart
    Then the operation should be <result>

    Examples:
      | quantity | result  |
      | 1        | allowed |
      | 10       | allowed |
      | 11       | blocked |

  Scenario Outline: Cart total limit
    Given my cart total is R$ <total>
    When I try to proceed with the purchase
    Then the operation should be <result>

    Examples:
      | total  | result  |
      | 989.99 | allowed |
      | 990.00 | allowed |
      | 990.01 | blocked |

  Scenario Outline: Automatic coupon based on cart total
    Given my cart total is R$ <total>
    When I view the cart
    Then I should receive <discount>

    Examples:
      | total  | discount       |
      | 199.99 | no coupon      |
      | 200.00 | a 10% coupon   |
      | 600.00 | a 10% coupon   |
      | 600.01 | a 15% coupon   |
```

## Open Questions
- Does a total of exactly R$ 600.00 receive 10% or 15%? *Assumed 10% ("between 200 and 600" is inclusive).*
- Is the R$ 990.00 limit applied before or after the discount?
- Does the 10-unit limit apply per product or per variation (size/color)?