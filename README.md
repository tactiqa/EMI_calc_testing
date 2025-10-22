# EMI Calculator Test Suite / Playwright

This project contains automated tests for the EMI (Equated Monthly Installment) Calculator web application available at https://emicalculator.net/, along with API testing examples. The tests are implemented using Playwright, a modern end-to-end testing framework.

## Features

### 1. Home Loan EMI Calculator Tests
- Tests for home loan EMI calculations with various loan parameters
- Supports different loan amounts, interest rates, and loan tenures
- Validates EMI, total interest, and total payment calculations
- Includes randomized test cases for broader test coverage

### 2. Personal Loan EMI Chart Tests
- Validates the EMI bar chart visualization
- Tests tooltip values for different loan scenarios
- Supports testing with both direct input and sliders
- Verifies principal and interest components in the payment schedule

## Test Structure

- `tests/` - Contains all test files
  - `home-loan-with-saved-state.spec.js` - Tests for home loan EMI calculations
  - `emichart-read-bars.spec.js` - Tests for personal loan EMI chart visualization
  - `emichart-read-bars-with-sliders.spec.js` - Tests for personal loan chart with slider interactions
  - `api/verify-users-api.spec.js` - API test hitting https://reqres.in/api for users response verification
- `fixtures/` - Contains test fixtures, test data, and browser state files:
  - `emiCalculator.fixture.js` - Playwright test fixture for EMI Calculator tests:
    - Handles browser context setup and teardown
    - Manages cookie consent dialogs
    - Persists browser state between test runs for faster execution
    - Supports multiple browsers (Chromium, Firefox) with separate state files
  
  - `users-response.json` - Mock API response data for user-related API tests:
    - Contains sample user data for Reqres.in API testing
    - Used for verifying API response structures and data validation
    
  - `state-chromium.json` - Persistent browser state for Chromium:
    - chromium state with consent handled (consent button is clicked)

  - `state-firefox.json` - Persistent browser state for Firefox:
    - firefox state with consent handled (consent button is clicked)

- `helper/` - Contains helper functions and utilities:
  - `homeLoanEMICalculator.js` - A helper class for home loan EMI calculations - use for test results verification
    - `calculateEMI(principal, rate, tenure)` - Calculates EMI using standard formula
    - `calculateTotalInterest(emi, principal, tenure)` - Calculates total interest paid
    - `calculateEMIDetails(principal, annualRate, years)` - Returns comprehensive loan details

  - `personalLoanCalculatorHelper.js` - A helper class for personal loan payment calculations - use for test results verification:
    - `calculateLoanPayments(amount, rate, years, startYear, startMonth)` - Calculates payment schedule
    - Handles both numeric and named months (e.g., 'Jan', 'February')
    - Returns detailed payment breakdown including principal, interest, and remaining balance

  - `sliderHelper.js` - A helper class for interacting with slider UI elements:
    - `setSliderValue(page, selector, value, fieldName, min, max)` - Sets slider value with visual feedback
    - Handles slider drag interactions
    - Includes validation of the set value

## How to run tests localy?

- **Prerequisites**
  - Node.js 18.x or later.
  - npm (bundled with Node.js) for dependency management.

- **Install dependencies**
  - Run `npm install` from the repository root.

- **Install Playwright browsers**
  - Execute `npx playwright install` to download the browser binaries used by the tests.

- **Run the full test suite**
  - Use `npx playwright test` to execute all tests headlessly.

- **Useful variants**
  - `npx playwright test --ui` launches the Playwright Test Runner UI for debugging.
  - `npx playwright test tests/api/verify-users-api.spec.js` runs only the API test file.
  - `npx playwright test --headed` opens a visible browser for interactive debugging.
