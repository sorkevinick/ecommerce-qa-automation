# [US-0008] Account Details

| Field | Value |
|---|---|
| **Project** | EBAC-SHOP |
| **Priority** | Medium |
| **Story Points** | 5 |

## User Story
**As** an EBAC-SHOP customer
**I want** to update my personal details and password
**So that** my account information stays accurate and secure

## Business Rules
> Rules inferred from exploratory testing of the current store (no formal specification available).

- Required fields: First name, Last name, Display name and Email address.
- The display name is shown in the account section and in product reviews.
- Password fields are optional; leaving them blank keeps the current password.
- Changing the password requires the current password.
- The new password and its confirmation must match.

## Acceptance Criteria

```gherkin
Feature: Account details
  As an EBAC-SHOP customer
  I want to update my personal details and password
  So that my account information stays accurate and secure

  Background:
    Given I am logged in
    And I am on the "Detalhes da conta" section

  Scenario: Update personal details successfully
    When I change my first name and last name
    And I click on "Save Changes"
    Then I should see a success message
    And the updated name should be displayed

  Scenario Outline: Required field left empty
    When I leave the "<field>" field empty
    And I click on "Save Changes"
    Then I should see an error message informing that "<field>" is required

    Examples:
      | field         |
      | First name    |
      | Last name     |
      | Display name  |
      | Email address |

  Scenario: Password is kept when password fields are left blank
    When I change my first name
    And I leave all password fields blank
    And I click on "Save Changes"
    Then I should still be able to log in with my current password

  Scenario: Change password successfully
    When I enter my current password
    And I enter a new password and its matching confirmation
    And I click on "Save Changes"
    Then I should see a success message
    And I should be able to log in with the new password

  Scenario: Password change fails with wrong current password
    When I enter an incorrect current password
    And I enter a new password and its matching confirmation
    And I click on "Save Changes"
    Then I should see an error message informing that the current password is incorrect

  Scenario: Password change fails when confirmation does not match
    When I enter my current password
    And I enter a new password and a different confirmation
    And I click on "Save Changes"
    Then I should see an error message informing that the passwords do not match
```

## Open Questions
- Is there a minimum password strength requirement?
- Should the customer receive an email notification after changing the password or email?

## Exploratory Testing Notes
- **Visual inconsistency:** the "Save Changes" button is blue, while all other buttons in the store are purple.
- **i18n inconsistency:** form labels are in English, while the menu and page title are in Portuguese.