# Testing conventions for this repository

## UI tests (Playwright + TypeScript, in /UI)
- Use the Page Object Model: locators and actions live in /UI/pages, never in spec files.
- Reuse existing page objects (e.g., CatalogPage, ProductPage) before creating new ones.
- Locator priority: getByRole > getByLabel > getByText > stable IDs. Never use generated IDs or list positions.
- Never use waitForTimeout. Wait for real states (a message, a value, a network response).
- Every action that changes state must be followed by an assertion that confirms it.
- Test names start with the test case ID, e.g. "TC-004-04 – should ...".
- Test data lives in /UI/data. Credentials come from utils/env.ts, never hardcoded.
- Known defects are marked with test.fail() and linked to a bug report in /docs/bugs.

## Store-specific notes
- The category dropdown next to the search field is a styled component that hides the native <select>.
- The store UI mixes Portuguese and English labels; use the exact visible text.

## API tests (Supertest + Jest, in /API)
- Validate status, body and contract (Joi schema) in every test.
- Create the data each test needs and delete it in afterAll.