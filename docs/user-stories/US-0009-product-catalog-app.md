# [US-0009] Product Catalog – Store Manager App (Android)

| Field | Value |
|---|---|
| **Project** | EBAC-SHOP |
| **Platform** | Android (WooCommerce app) |
| **Priority** | Medium |
| **Story Points** | 5 |

## User Story
**As** an EBAC-SHOP store manager
**I want** to browse and search the product catalog in the mobile app
**So that** I can check and manage products from anywhere

## Context
The Android app is the WooCommerce store management app, connected to the online
EBAC store (`lojaebac.ebaconline.art.br`). Unlike the web catalog (US-0004), its
user is the **store manager**, not the customer.

## Business Rules
> Rules inferred from exploratory testing of the app (no formal specification available).

- The product list shows each product's name and stock status.
- Search results are updated while the manager types.
- A message is displayed when the search finds no products.
- Tapping a product opens its details.

## Acceptance Criteria

```gherkin
Feature: Product catalog in the store manager app
  As an EBAC-SHOP store manager
  I want to browse and search the product catalog in the mobile app
  So that I can check and manage products from anywhere

  Background:
    Given I am logged in to the app as a store manager
    And I am on the Products tab

  Scenario: Product list is displayed
    Then I should see products with their stock status

  Scenario: Search for an existing product
    When I search for "Abominable Hoodie"
    Then the results should contain "Abominable Hoodie"

  Scenario: Search with no results
    When I search for "xyz123"
    Then I should see a message informing that no results were found

  Scenario: Open product details
    When I search for "Abominable Hoodie"
    And I open the product
    Then the product details should show the name "Abominable Hoodie"
```

## Exploratory Testing Notes
- **Search scope:** searching for "Hoodie" also returns products without "Hoodie" in their name (e.g., "Ajax Full-Zip Sweatshirt"), so the search also matches other fields such as description or category.
- **Shared test environment:** the online store is shared by all course students. Products are created and changed by other users at any time (e.g., "[66665692] Produto Lgc2" appearing at the top of the list), so tests must never rely on list position, product count or stock levels.