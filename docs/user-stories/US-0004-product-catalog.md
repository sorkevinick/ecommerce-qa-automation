# [US-0004] Product Catalog

| Field | Value |
|---|---|
| **Project** | EBAC-SHOP |
| **Priority** | High |
| **Story Points** | 8 |

## User Story
**As** an EBAC-SHOP customer
**I want** to browse, search and sort products
**So that** I can find the items I want to buy

## Business Rules
> Rules inferred from exploratory testing of the current store (no formal specification available).

- The product listing displays each product's name, image, rating and price.
- Customers can search products by keyword, optionally restricted to a category.
- Sorting options: default, popularity, average rating, latest, price (low to high) and price (high to low).
- Products can be displayed in grid or list view.
- Variable products require a size and a color to be selected before they can be added to the cart.

## Acceptance Criteria

```gherkin
Feature: Product catalog
  As an EBAC-SHOP customer
  I want to browse, search and sort products
  So that I can find the items I want to buy

  Background:
    Given I am on the products page

  Scenario: Products are displayed with basic information
    Then each product should display its name, image and price

  Scenario: Search for an existing product
    When I search for "Abominable Hoodie"
    Then the results should contain "Abominable Hoodie"

  Scenario: Search with no results
    When I search for "nonexistent product xyz"
    Then I should see a message informing that no products were found

  Scenario: Search within a category
    When I select the category "Hoodies & Sweatshirts"
    And I search for "Hoodie"
    Then all results should belong to the "Hoodies & Sweatshirts" category

  Scenario Outline: Sort products by price
    When I sort products by "<option>"
    Then the products should be ordered by price in <direction> order

    Examples:
      | option                          | direction  |
      | Ordenar por preço: menor para maior | ascending  |
      | Ordenar por preço: maior para menor | descending |

  Scenario: Add to cart is disabled until variations are selected
    Given I am on the "Abominable Hoodie" product page
    When I have not selected a size and a color
    Then the add to cart button should be disabled

  Scenario: Add to cart is enabled after selecting variations
    Given I am on the "Abominable Hoodie" product page
    When I select the size "XS" and the color "Blue"
    Then the add to cart button should be enabled
```

## Open Questions
- Should the search also match product descriptions, or only names?
- What should happen when a specific variation (size + color) is out of stock?

## Exploratory Testing Notes
- **i18n inconsistency:** the UI mixes Portuguese and English labels (e.g., "Carrinho" / "Update Cart", "Detalhes de faturamento" / "Your order", "Comprar" / "Search").
- **Pagination:** the catalog displays 9 products per page.
- **Single-result search:** when a search matches exactly one product, the customer is redirected straight to the product page.
- **Add to cart without variations:** the "Comprar" button only looks disabled; clicking it shows a native browser alert ("Selecione uma das opções do produto antes de adicioná-lo ao carrinho.").
- **i18n issue:** the sorting dropdown's accessible label is "Pedido da loja", a mistranslation of "Shop order".
- **Accessibility (WCAG 1.1.1):** product images in the catalog have no alternative text, so screen readers cannot describe them.