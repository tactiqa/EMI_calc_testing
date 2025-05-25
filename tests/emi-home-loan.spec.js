import { test, expect } from '@playwright/test';

test('test with saved state', async ({ browser }, testInfo) => {
  // Set test timeout to 2 minutes
  testInfo.setTimeout(120000);
  
  // Create a new context with the saved state
  const context = await browser.newContext({
    storageState: 'browser_statest/state.json'
  });
  
  // Create a new page
  const page = await context.newPage();
  
  // Navigate to the EMI Calculator page
  await page.goto('https://emicalculator.net/');
  
  // The consent should already be handled by the saved state
  console.log('Using saved browser state - consent should be handled');
  
  await page.getByRole('textbox', { name: 'Home Loan Amount' }).click();
  await page.getByRole('textbox', { name: 'Home Loan Amount' }).fill('25,00,000');
  await page.getByRole('textbox', { name: 'Interest Rate' }).click();
  await page.getByRole('textbox', { name: 'Interest Rate' }).fill('10');
  await page.getByRole('textbox', { name: 'Loan Tenure' }).click();
  await page.getByRole('textbox', { name: 'Loan Tenure' }).fill('10');

  // Wait for the chart container to be present and visible
  const chart = page.locator('#emipiechart .highcharts-container');
  await expect(chart).toBeVisible({ timeout: 15000 });


  const dataLabel0 = page.locator('#emipiechart .highcharts-data-label-color-0');
  const percentageText0 = await dataLabel0.locator('tspan').textContent();
  const percentage0 = parseFloat(percentageText0.replace('%', ''));

  const dataLabel1 = page.locator('#emipiechart .highcharts-data-label-color-1');
  const percentageText1 = await dataLabel1.locator('tspan').textContent();
  const percentage1 = parseFloat(percentageText1.replace('%', ''));

  console.log(`----->>>> Percentage 0: ${percentage0}%`);
  console.log(`----->>>> Percentage 1: ${percentage1}%`);

  const percentageTexts00 = await page.locator('#emipiechart').getByText(/%/).allTextContents();
  console.log(`GET BY--------> Percentage texts: ${percentageTexts00}`);


  console.log('Test completed, closing browser...');
  // Close the context
  await context.close();
});
