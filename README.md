# ly-application

This repository is a Selenium testing framework using TypeScript and Mocha. It is designed for easy setup and extension for UI automation.

## Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm (comes with Node.js)

## Setup
1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd ly-application
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```

## Running Tests
- Place your test files in the `src/` or `tests/` directory (use `.ts` extension).
- To run all tests:
  ```sh
  npm test
  ```

## Project Structure
- `src/`    — Main test code
- `pages/`  — Page Object Model classes
- `utils/`  — Utility functions/helpers
- `tests/`  — (Optional) Additional test files

## Notes
- Tests are written in TypeScript and executed using Mocha with ts-node.
- Selenium WebDriver is used for browser automation.

---
Feel free to extend the framework with your own page objects, utilities, and tests. 
