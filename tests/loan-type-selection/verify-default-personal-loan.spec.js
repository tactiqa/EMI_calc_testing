const { test, expect } = require('../../fixtures/emiCalculator.fixture');

test('verify personal loan default values', async ({ emiCalculatorPage }) => {
  const page = emiCalculatorPage;
  
  // Click on Personal Loan tab
  await page.getByRole('link', { name: 'Personal Loan' }).click();
  
  // Verify the Personal Loan Amount field is visible
  const loanAmountField = page.getByRole('textbox', { name: 'Loan Amount' });
  await expect(loanAmountField).toBeVisible();
  
  // Verify the Interest Rate field is visible
  const interestRateField = page.getByRole('textbox', { name: 'Interest Rate' });
  await expect(interestRateField).toBeVisible();

  // Verify the Loan Tenure field is visible
  const loanTenureField = page.getByRole('textbox', { name: 'Loan Tenure' });
  await expect(loanTenureField).toBeVisible();

  // Verify the Indian Rupee symbol (₹) is visible on the page
  await expect(page.getByText('₹', { exact: true }).first()).toBeVisible();
  
  // Verify the percentage symbol is visible on the page
  await expect(page.getByText('%', { exact: true }).first()).toBeVisible();

  // Verify the year and month options are visible
  await expect(page.getByText('Yr', { exact: true })).toBeVisible();
  await expect(page.getByText('Mo', { exact: true })).toBeVisible();

  // Verify the default Personal Loan Amount value
  const loanAmountValue = await loanAmountField.inputValue();
  console.log('Personal Loan Amount value:', loanAmountValue);
  expect(loanAmountValue).toBe('7,50,000');

  // Verify the default Interest Rate value
  const interestRateValue = await interestRateField.inputValue();
  console.log('Interest Rate value:', interestRateValue);
  expect(interestRateValue).toBe('11');

  // Verify the default Loan Tenure value
  const loanTenureValue = await loanTenureField.inputValue();
  console.log('Loan Tenure value:', loanTenureValue);
  expect(loanTenureValue).toBe('3');

  console.log('\n✓ All values match the expected defaults for Personal Loan');
  console.log('✓ Personal Loan test completed successfully!');
});
