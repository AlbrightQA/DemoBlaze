# DemoBlaze Testing Framework

A comprehensive testing framework for the DemoBlaze e-commerce application using TypeScript, Mocha, and Selenium WebDriver. Supports both API testing and end-to-end browser automation.

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
   git clone https://github.com/AlbrightQA/ly-application.git
   cd ly-application
   npm install
   ```

2. **Setup environment:**
   ```sh
   npm run dev
   ```
   This creates `.env` with default values from `.env.example`.

3. **Add your credentials:**
   Edit `.env` with your DemoBlaze credentials (see [Setup](#setup) below).

### Retrieving the User Cookie

To get your `DEMO_BLAZE_USER_COOKIE` value:

1. **Open browser Developer Tools** (F12) and go to Network tab
2. **Enable "Preserve log"** and navigate to https://demoblaze.com
3. **Log in** with your credentials
4. **Find the POST request to `/login`** in Network tab
5. **Copy the cookie value** from the request payload

**Note:** The cookie is required for API calls to work properly.

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
npm run e2e -- --grep "test name"
```

## Project Structure

```
├── config/
│   └── test.config.ts   # Test configuration and browser settings
├── tests/
│   ├── smoke/           # API-only tests
│   │   └── add-to-cart-and-delete-smoke.test.ts
│   └── e2e/            # Browser automation tests
│       ├── verify-cart-total.test.ts
│       └── add-to-cart-and-delete-e2e.test.ts
├── utils/
│   ├── apiClient.ts     # API client for DemoBlaze
│   ├── cartCalculator.ts # Cart total calculation utilities
│   ├── cartCleanup.ts   # Bulk delete operations
│   ├── cartOperations.ts # Bulk add operations
│   ├── uuidGenerator.ts # UUID generation utilities
│   └── index.ts         # Barrel exports
├── pages/               # Page Object Model classes
└── dist/                # Compiled JavaScript (generated)
```

## Test Types

### Smoke Tests (`tests/smoke/`)
- **Purpose**: Quick API validation
- **Scope**: API calls only, no browser automation
- **Use Case**: Fast feedback on API functionality
- **Command**: `npm run smoke`

### E2E Tests (`tests/e2e/`)
- **Purpose**: Full user journey validation
- **Scope**: Browser automation with API setup
- **Use Case**: Complete feature verification
- **Command**: `npm run e2e`

## Key Utilities

### API Client (`utils/apiClient.ts`)
```typescript
const apiClient = new ApiClient();
await apiClient.addProductToCart(productId, uuid);
await apiClient.deleteCartItem(uuid);
```

### Bulk Operations (`utils/cartOperations.ts`, `utils/cartCleanup.ts`)
```typescript
// Add multiple products
const addResults = await addMultipleProductsToCart(apiClient, [3, 15, 14]);

// Delete multiple items
const deleteResults = await deleteAllCartItems(apiClient, uuids);
```

### Cart Calculator (`utils/cartCalculator.ts`)
```typescript
const cartResult = await calculateCartTotal(driver);
// Returns: { calculatedTotal, displayedTotal, productPrices, isMatch }
```

### UUID Generator (`utils/uuidGenerator.ts`)
```typescript
const uuid = generateUUID(); // Generates RFC 4122 v4 UUID
```

## Example Test Flow

1. **Setup**: Initialize API client and generate UUIDs
2. **Add Products**: Bulk add products to cart via API
3. **Verify**: Navigate to cart page and verify total calculation
4. **Cleanup**: Bulk delete all items from cart

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
3. **API Connectivity**: Verify DemoBlaze API is accessible
4. **Compilation**: Run `npm run build` if TypeScript compilation fails

### Debug Mode
Add `--inspect` flag for detailed logging:
```sh
npm run e2e -- --inspect
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

---