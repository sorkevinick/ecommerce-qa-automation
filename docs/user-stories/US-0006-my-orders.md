# [US-0006] My Orders

| Field | Value |
|---|---|
| **Project** | EBAC-SHOP |
| **Priority** | Medium |
| **Story Points** | 5 |

## User Story
**As** an EBAC-SHOP customer
**I want** to view my order history
**So that** I can track my purchases

## Business Rules
> Rules inferred from exploratory testing of the current store (no formal specification available).

- The order list displays: order number, date, status, total (with item count) and a "Visualizar" action.
- New orders paid on delivery start with the status "Processando".
- The order details display the products, subtotal, payment method, total, order notes and billing address.
- Customers can only view their own orders.

## Acceptance Criteria

```gherkin
Feature: My orders
  As an EBAC-SHOP customer
  I want to view my order history
  So that I can track my purchases

  Background:
    Given I am logged in

  Scenario: New order is displayed in the order history
    Given I have just placed an order with "Pagamento na entrega"
    When I access the "Pedidos" section
    Then I should see the order with its number, date, total and item count
    And the order status should be "Processando"

  Scenario: View order details
    Given I have placed at least one order
    When I click on "Visualizar" for that order
    Then I should see the products, subtotal, payment method and total
    And I should see the billing address used in the order

  Scenario: Customer without orders
    Given I have never placed an order
    When I access the "Pedidos" section
    Then I should see a message informing that no orders have been made yet

  Scenario: Customer cannot view another customer's order
    Given an order belongs to another customer
    When I try to access that order directly by its URL
    Then the order details should not be displayed
```

## Open Questions
- Should customers be able to cancel an order from this page? If so, in which statuses?