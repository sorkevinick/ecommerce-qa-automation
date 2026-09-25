# [US-0002] Login

| Field | Value |
|---|---|
| **Project** | EBAC-SHOP |
| **Priority** | Medium |
| **Story Points** | 8 |

## User Story
**As** an EBAC-SHOP customer
**I want** to log in to the platform
**So that** I can view my orders

## Business Rules
- Only active users can log in.
- An error message must be displayed when the username or password is incorrect.
- After 3 failed password attempts, login must be locked for 15 minutes.

## Acceptance Criteria

```gherkin
Feature: Login
  As an EBAC-SHOP customer
  I want to log in to the platform
  So that I can view my orders

  Background:
    Given I am on the login page

  Scenario: Successful login with an active user
    Given I have an active account
    When I log in with valid credentials
    Then I should be redirected to the My Account dashboard

  Scenario: Inactive user cannot log in
    Given my account is inactive
    When I log in with valid credentials
    Then I should see a message informing that the account is inactive

  Scenario Outline: Login with invalid credentials
    When I log in with username "<username>" and password "<password>"
    Then I should see an error message
    And I should remain on the login page

    Examples:
      | username      | password       |
      | invalid_user  | valid_password |
      | valid_user    | wrong_password |
      |               |                |

  Scenario: Account is locked after 3 failed attempts
    When I enter a wrong password 3 times in a row
    Then my login should be locked for 15 minutes
    And I should see a message informing about the lock

  Scenario: Login is unlocked after 15 minutes
    Given my login was locked 15 minutes ago
    When I log in with valid credentials
    Then I should be redirected to the My Account dashboard
```

## Open Questions
- Does the failed-attempt counter reset after a successful login?
- Is the lock applied per account or per IP address?
- During the lock period, is a login with the correct password also rejected?
- Should the error message be generic (e.g., "Invalid username or password") to avoid revealing which field is wrong? *Recommended for security.*