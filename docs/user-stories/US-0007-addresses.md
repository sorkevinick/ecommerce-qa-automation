# [US-0007] Addresses

| Field | Value |
|---|---|
| **Project** | EBAC-SHOP |
| **Priority** | Medium |
| **Story Points** | 5 |

## User Story
**As** an EBAC-SHOP customer
**I want** to manage my billing and shipping addresses
**So that** my purchases are delivered and billed correctly

## Business Rules
> Rules inferred from exploratory testing of the current store (no formal specification available).

- Customers have one billing address and one shipping address.
- The billing address is saved automatically after the first checkout.
- When no shipping address exists, the message "You have not set up this type of address yet." is displayed.
- Required billing fields: first name, last name, country, street address, city, state, postcode, phone and email.
- Company name and apartment/suite are optional.
- The postcode is automatically formatted (e.g., `10000000` → `10000-000`).

## Acceptance Criteria

```gherkin
Feature: Addresses
  As an EBAC-SHOP customer
  I want to manage my billing and shipping addresses
  So that my purchases are delivered and billed correctly

  Background:
    Given I am logged in

  Scenario: Billing address is saved from the first checkout
    Given I have completed a checkout with a billing address
    When I access the "Endereços" section
    Then the billing address used in the checkout should be displayed

  Scenario: Shipping address not set up yet
    Given I have never saved a shipping address
    When I access the "Endereços" section
    Then I should see the message "You have not set up this type of address yet."

  Scenario: Add a shipping address
    Given I am on the "Endereços" section
    When I edit the shipping address with valid data
    And I save the address
    Then the shipping address should be displayed

  Scenario Outline: Required field left empty
    Given I am editing the billing address
    When I leave the "<field>" field empty
    And I save the address
    Then I should see an error message for "<field>"

    Examples:
      | field    |
      | Nome     |
      | Endereço |
      | Cidade   |
      | CEP      |
      | Telefone |

  Scenario Outline: Invalid data is rejected
    Given I am editing the billing address
    When I fill in "<field>" with "<value>"
    And I save the address
    Then I should see an error message for "<field>"

    Examples:
      | field              | value         |
      | Endereço de e-mail | invalid-email |
      | CEP                | 123           |
```

## Open Questions
- Should customers be able to save more than one shipping address?
- Which postcode formats are accepted (with or without the hyphen)?

## Exploratory Testing Notes
- **Automatic formatting:** a postcode entered as `10000000` is saved as `10000-000`.
- **i18n inconsistency:** section title in Portuguese ("ENDEREÇOS") but content in English ("My Addresses", "Billing Address", "Edit").
- The phone and email are shown in the order's billing address but not on the Addresses page.