# UI Automation – Tool Comparison

To choose the UI automation framework for this project, three widely used
tools were compared: **Selenium WebDriver**, **Cypress** and **Playwright**.

## Comparison

| Criteria | Selenium WebDriver | Cypress | Playwright |
|---|---|---|---|
| **Languages** | Java, Python, C#, JavaScript, Ruby | JavaScript / TypeScript | TypeScript / JavaScript, Python, Java, .NET |
| **Browsers** | Chrome, Firefox, Edge, Safari | Chromium-based, Firefox, WebKit (experimental) | Chromium, Firefox, WebKit |
| **Architecture** | Communicates with browsers through drivers (W3C WebDriver) | Runs inside the browser | Communicates directly with browsers through their protocols |
| **Waiting strategy** | Explicit waits written manually | Automatic waiting | Automatic waiting |
| **Multiple tabs / origins** | Supported | Limited | Native support |
| **Parallel execution** | Via Selenium Grid (extra infrastructure) | Via paid Cypress Cloud or third-party tools | Built-in and free |
| **Debugging** | Logs and screenshots (manual setup) | Excellent interactive runner (time travel) | Trace Viewer, UI Mode, Codegen |
| **Reporting** | Requires external libraries | Requires plugins | Built-in HTML report |
| **API testing** | Not supported | Supported (`cy.request`) | Supported (`request` fixture) |
| **Learning curve** | Higher | Low | Low to medium |
| **Maturity** | Very mature (since 2004), huge community | Mature, large community | Newer (2020), fast-growing adoption |

## Decision: Playwright + TypeScript

1. **Consistent stack:** TypeScript is shared with the API tests (Supertest), mobile tests (WebdriverIO) and performance tests (k6), keeping the project cohesive.
2. **Real cross-browser coverage:** WebKit support allows validating Safari-like behavior, relevant for Apple users.
3. **Free parallelism:** built-in parallel execution speeds up the CI pipeline at no extra cost.
4. **Debugging and reporting:** the Trace Viewer and the HTML report make failure analysis faster, both locally and in CI.
5. **Reliability:** automatic waiting reduces flaky tests.

## Trade-offs Considered
- **Selenium** would be a good choice for teams using Java or Python, or that need legacy browser support, but it requires more setup for waits, reports and parallelism.
- **Cypress** offers an excellent developer experience, but its limitations with multiple tabs and its paid parallelism were decisive against it.