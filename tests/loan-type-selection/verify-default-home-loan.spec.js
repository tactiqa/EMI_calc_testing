const { test, expect } = require('../../fixtures/emiCalculator.fixture');

test('verify home loan amount field visibility and value', async ({ emiCalculatorPage }) => {
  const page = emiCalculatorPage;

  await expect(page.getByRole('link', { name: 'Home Loan', exact: true })).toBeVisible();
  
  // Verify the Home Loan Amount field is visible
  const loanAmountField = page.getByRole('textbox', { name: 'Home Loan Amount' });
  await expect(loanAmountField).toBeVisible();
  
  // Verify the percentage symbol is visible on the page
  const interestRateField = page.getByRole('textbox', { name: 'Interest Rate' });
  await expect(interestRateField).toBeVisible();

  const loanTenureField = page.getByRole('textbox', { name: 'Loan Tenure' });
  await expect(loanTenureField).toBeVisible();

  // Verify the Indian Rupee symbol (₹) is visible on the page
  await expect(page.getByText('₹', { exact: true })).toBeVisible();
  
  // Verify the Indian Rupee symbol (%) is visible on the page
  await expect(page.getByText('%', { exact: true })).toBeVisible();

  // Verify the Indian Rupee symbol (Yr) is visible on the page
  await expect(page.getByText('Yr', { exact: true })).toBeVisible();

  // Verify the Indian Rupee symbol (Mo) is visible on the page
  await expect(page.getByText('Mo', { exact: true })).toBeVisible();

  // Get the value of the Home Loan Amount field and verify it matches the expected value
  const loanAmountValue = await loanAmountField.inputValue();
  console.log('Home Loan Amount value:', loanAmountValue);
  expect(loanAmountValue).toBe('50,00,000');

  // Get the value of the Interest Rate field and verify it matches the expected value
  const interestRateValue = await interestRateField.inputValue();
  console.log('Interest Rate value:', interestRateValue);
  expect(interestRateValue).toBe('9');

  // Get the value of the Loan Tenure field and verify it matches the expected value
  const loanTenureValue = await loanTenureField.inputValue();
  console.log('Loan Tenure value:', loanTenureValue);
  expect(loanTenureValue).toBe('20');

  console.log('\n✓ All values match the expected defaults for Home Loan');
  console.log('✓ Home Loan test completed successfully!');
});
