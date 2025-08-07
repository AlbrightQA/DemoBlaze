# DemoBlaze Testing Framework

A comprehensive testing framework for the DemoBlaze e-commerce application using TypeScript, Mocha, and Selenium WebDriver. Supports both API testing and end-to-end browser automation.

The **Line Yahoo Application** project is a Playwright repository designed to test the frontend and API of the DemoBlaze application, and to demonstrate what benefits Evan Albright can bring to the team.

## Intentions Moving Forward

When hired, I plan to focus on the following key areas to enhance the quality assurance process:

- **Work with stakeholders** to identify critical test flows and automate those first.
- **Collaborate with development** to implement data-testid's on existing elements and all elements going forward for better test targeting.
- **Train QA team** on how to effectively use the Selenium project to maximize its benefits.
- **Advocate for inline testing** to ensure that tests are closely integrated with the codebase, allowing for immediate feedback on changes and reducing the likelihood of incidents.

## Features

- **API Testing**: Direct API calls for cart operations
- **E2E Testing**: Browser automation with Selenium WebDriver
- **Bulk Operations**: Utilities for adding/deleting multiple cart items
- **Cart Total Verification**: Automated calculation and verification of cart totals
- **Cross-platform**: Works on Windows, macOS, and Linux

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm (comes with Node.js)
- Chrome browser (for E2E tests)

## Getting Started

1. **Clone and install:**

   ```sh
   git clone https://github.com/AlbrightQA/line-yahoo-application.git
   cd ly-application
   npm install
   ```

2. **Setup environment:**

   ```sh
   npm run dev
   ```

   This creates `.env` with default values from `.env.example`.

3. **Add your credentials:**
   Edit `.env` with your DemoBlaze username and password.

## Running Tests

### All Tests

```sh
npm run all-tests
```

### E2E Tests Only

```sh
npm run e2e     # Cleans previously compiled scripts, recompiles, and runs tests
```

### API Smoke Tests Only

```sh
npm run smoke   # Cleans previously compiled scripts, recompiles, and runs tests
```

### Specific Test File

```sh
npm run e2e -- --grep "test name" # Not file name. It will match partial text of your 'describe' or 'it' statements.
```

## CI/CD Workflows

### GitHub Actions

The repository includes two separate GitHub workflows:

#### E2E Tests Workflow (`.github/workflows/e2e-tests.yml`)

- **Triggers**: Push to main/develop, pull requests, manual dispatch
- **Purpose**: Full browser automation testing
- **Environment**: Ubuntu with Chrome browser
- **Artifacts**: Test results and screenshots (7-day retention)

#### Smoke Tests Workflow (`.github/workflows/smoke-tests.yml`)

- **Triggers**: Push to main/develop, pull requests, manual dispatch
- **Purpose**: API-only testing (faster execution)
- **Environment**: Ubuntu (no browser required)
- **Artifacts**: Test results (7-day retention)

### Browser Visibility

Tests run headless by default for faster execution. To see the browser:

**Windows (PowerShell):**

```powershell
$env:HEADED="true"; npm run e2e
```

**Unix/Linux/macOS:**

```sh
HEADED=true npm run e2e
```

## Nice to have's

- **Pretty**: `npm run format` will make your code pretty according to `.prettierrc.json`
- **Retries**: Failures will retry 2 more times (for a total of 3 runs)
- **Screenshots**: Auto-screenshots on failure will save locally to `/.screenshots` or artifacts during CI E2E

## Notes

- **TypeScript**: All tests written in TypeScript with strict type checking
- **Mocha**: Test framework with built-in assertions
- **Selenium WebDriver**: Browser automation for E2E tests
- **Cross-platform**: Compatible with Windows, macOS, and Linux
- **Modular Design**: Reusable utilities for common operations
- **Centralized Configuration**: Browser and test settings managed in `config/test.config.ts`

## Troubleshooting

### Common Issues

1. **Environment Variables**: Ensure all required variables are set
2. **Chrome Driver**: E2E tests require Chrome browser
3. **Compilation**: Run `npm run build` if TypeScript compilation fails

### Debug Mode

Add `--inspect` flag for detailed logging:

```sh
npm run e2e -- --inspect
```

---
