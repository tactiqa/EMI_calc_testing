const { test, expect } = require('../../fixtures/emiCalculator.fixture');

// Test cases array
const testCases = [
  {
    name: '5-year loan',
    loanAmount: 750000,
    interestRate: 11,
    loanTermYears: 5,
    startMonth: 'Jul',
  },
  // {
  //   name: '10-year loan',
  //   loanAmount: 1000000,
  //   interestRate: 8.5,
  //   loanTermYears: 10,
  //   startMonth: 'Apr',
  // },
  // Add more test cases as needed
];

test.describe('Yearly Rows Verification Tests', () => {
  testCases.forEach(testCase => {
    test(`verify yearly rows for ${testCase.name} (${testCase.loanTermYears} years)`, async ({ emiCalculatorPage }) => {
      const page = emiCalculatorPage;
      console.log(`\nTest: ${testCase.name} (${testCase.loanAmount} @ ${testCase.interestRate}%, ${testCase.loanTermYears}y)`);

      // Verify we're on the right page
      await expect(page).toHaveTitle(/emi calculator/i);

      // Fill in the loan parameters
      await page.getByRole('textbox', { name: 'Home Loan Amount' }).fill(testCase.loanAmount.toString());
      await page.getByRole('textbox', { name: 'Interest Rate' }).fill(testCase.interestRate.toString());
      await page.getByRole('textbox', { name: 'Loan Tenure' }).fill(testCase.loanTermYears.toString());
      await page.getByRole('textbox', { name: 'Loan Tenure' }).press('Enter');

      // Open schedule and select month
      await page.getByRole('textbox', { name: 'Schedule showing EMI payments' }).click();
      await page.waitForSelector('.datepicker-months');
      await page.locator('.datepicker-months .month', { hasText: testCase.startMonth }).first().click();
      
      // Wait for the payment schedule to load
      await page.waitForSelector('#emipaymenttable');
      
      // Verify table headers
      // Verify table headers
      const expectedHeaders = [
        'Year',
        'Principal\n(A)',
        'Interest\n(B)',
        'Total Payment\n(A + B)',
        'Balance',
        'Loan Paid To Date'
      ];

      // Get only visible header cells (exclude mobile-specific headers)
      const headerCells = page.locator('#emipaymenttable > table th:not(.d-sm-none)');
      
      // Verify each header text
      for (let i = 0; i < expectedHeaders.length; i++) {
        const headerText = await headerCells.nth(i).innerText();
        expect(headerText).toContain(expectedHeaders[i]);
      }
      
      // Get all yearly payment rows
      const yearlyRows = page.locator('.yearlypaymentdetails');
      await expect(yearlyRows).not.toHaveCount(0);
      
      // Get the count of yearly rows
      const yearlyRowsCount = await yearlyRows.count();
      console.log(`\nFound ${yearlyRowsCount} years in the payment schedule`);
      
      // Calculate expected number of yearly rows
      const startMonthNum = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(testCase.startMonth);
      const hasPartialFirstYear = startMonthNum > 0;
      if (hasPartialFirstYear) {
        console.log(`Note: Includes a partial first year (starting in ${testCase.startMonth})`);
      }
      const expectedMinYears = testCase.loanTermYears;
      const expectedMaxYears = hasPartialFirstYear ? testCase.loanTermYears + 1 : testCase.loanTermYears;
      
      // Verify the number of yearly rows is within expected range
      expect(yearlyRowsCount).toBeGreaterThanOrEqual(expectedMinYears);
      expect(yearlyRowsCount).toBeLessThanOrEqual(expectedMaxYears);
      
      // Find and log all toggle elements
      const toggleElements = page.locator('.paymentyear.toggle');
      const toggleCount = await toggleElements.count();
      console.log(`\nFound ${toggleCount} toggle elements in the table`);
      
      // Verify the number of toggle elements matches the yearly rows count
      expect(toggleCount).toBe(yearlyRowsCount);
      
      // Log details of each toggle
      // console.log('Toggle elements found:');
      // for (let i = 0; i < toggleCount; i++) {
      //   const toggle = toggleElements.nth(i);
      //   const toggleId = await toggle.getAttribute('id');
      //   const yearText = await toggle.innerText();
      //   console.log(`- Toggle ${i+1}: Year ${yearText} (ID: ${toggleId})`);
      // }
      
      // // Verify final balance is zero (or close to it)
      // if (yearlyRowsCount > 0) {
      //   const lastYearBalanceText = await yearlyRows.last().locator('.currency').nth(3).textContent();
      //   const lastYearBalance = parseFloat(lastYearBalanceText.replace(/[^0-9.-]+/g, ''));
      //   expect(lastYearBalance).toBeLessThanOrEqual(1);
      // }
    });
  });
});
