# EA Line Yahoo Application Readme

This repository is a Selenium testing framework using TypeScript and Mocha. It is designed for easy setup and extension for UI automation.

## Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm (comes with Node.js)

## Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/AlbrightQA/ly-application.git
   cd ly-application
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Prepare your environment variables:**
   - The first time you run the tests, you can use the following command to automatically copy `.env.example` to `.env` if `.env` does not exist:
     ```sh
     npm run dev
     ```
   - Then, edit `.env` to fill in your local credentials and base URL as needed.

## Running Tests
- Or, if you already have a `.env` file:
  ```sh
  npm test
  ```

## Project Structure
- `src/`    — Main test code
- `pages/`  — Page Object Model classes
- `utils/`  — Utility functions/helpers
- `tests/`  — (Optional) Additional test files

## Environment Variables
- All required environment variables are listed in `.env.example`.
- For local development, copy `.env.example` to `.env` and fill in your values (or use `npm run dev` to do this automatically).
- In CI (GitHub Actions), set these as repository/environment secrets and variables.

## Notes
- Tests are written in TypeScript and executed using Mocha with ts-node.
- Selenium WebDriver is used for browser automation.

---
Feel free to extend the framework with your own page objects, utilities, and tests. 
