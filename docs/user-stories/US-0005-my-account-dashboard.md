# [US-0005] My Account Dashboard

| Field | Value |
|---|---|
| **Project** | EBAC-SHOP |
| **Priority** | Medium |
| **Story Points** | 3 |

## User Story
**As** an EBAC-SHOP customer
**I want** to access my account dashboard
**So that** I can manage my orders and personal information

## Business Rules
> Rules inferred from exploratory testing of the current store (no formal specification available).

- Only logged-in customers can access the dashboard.
- When logged in, the header displays a welcome message with the username and a Logout link.
- The account menu contains: Painel, Pedidos, Downloads, Endereços, Detalhes da conta and Sair.
- Unauthenticated users see the Login and Register forms on the My Account page.
- Registration requires only an email address and a password.

## Acceptance Criteria

```gherkin
Feature: My Account dashboard
  As an EBAC-SHOP customer
  I want to access my account dashboard
  So that I can manage my orders and personal information

  Scenario: Dashboard is displayed after login
    Given I am on the My Account page
    When I log in with valid credentials
    Then I should see the account menu
    And the header should display a welcome message with my username

  Scenario Outline: Navigate through the account sections
    Given I am logged in
    When I click on "<menu>" in the account menu
    Then I should see the "<title>" page

    Examples:
      | menu              | title             |
      | Pedidos           | PEDIDOS           |
      | Endereços         | ENDEREÇOS         |
      | Detalhes da conta | DETALHES DA CONTA |

  Scenario: Logout ends the session
    Given I am logged in
    When I click on "Sair" in the account menu
    Then I should be logged out
    And I should see the Login and Register forms

  Scenario: Unauthenticated user sees the login and register forms
    Given I am not logged in
    When I access the My Account page
    Then I should see the Login and Register forms
    And the account menu should not be displayed

  Scenario: Register a new account
    Given I am not logged in
    When I register with a new email address and a valid password
    Then I should be logged in
    And I should see the account menu
```

## Open Questions
- Should the session expire after a period of inactivity? If so, how long?
- Is the Downloads section in scope, since the store does not sell digital products?