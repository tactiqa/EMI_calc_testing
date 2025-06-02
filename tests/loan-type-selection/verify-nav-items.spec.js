const { test, expect } = require('../../fixtures/emiCalculator.fixture');

test('verify navigation items', async ({ emiCalculatorPage }) => {
  const nav = emiCalculatorPage.locator('.loanproduct-nav');
  const items = nav.locator('li');
  
  // Get and log all navigation items
  const itemTexts = await items.allTextContents();
  console.log('\nNavigation items:', itemTexts);
  
  // Verify items count and order
  expect(itemTexts).toEqual(['Home Loan', 'Personal Loan', 'Car Loan']);
  
  // Helper function to verify active tab
  async function verifyActiveTab(expectedText) {
    await expect(nav.locator('li.active')).toHaveText(expectedText);
    console.log(`✓ ${expectedText} is active`);
  }

  // Verify Home Loan is active by default
  await verifyActiveTab('Home Loan');
  
  // Test Personal Loan tab
  await nav.locator('li:has-text("Personal Loan")').click();
  await verifyActiveTab('Personal Loan');
  
  // Test Car Loan tab
  await nav.locator('li:has-text("Car Loan")').click();
  await verifyActiveTab('Car Loan');
  
  // Test switching back to Home Loan
  await nav.locator('li:has-text("Home Loan")').click();
  await verifyActiveTab('Home Loan');
});
