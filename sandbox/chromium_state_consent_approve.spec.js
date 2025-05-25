import { test, expect } from '@playwright/test';

// Increase test timeout to 2 minutes
test('take screenshot of EMI calculator', async ({ page, context }, testInfo) => {
  // Set test timeout to 2 minutes
  testInfo.setTimeout(120000);
  // Navigate to the EMI Calculator page
  await page.goto('https://emicalculator.net/');
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');

  await page.waitForLoadState('networkidle');
  
  // Handle the consent screen if it appears
  let handledConsent = false;
  const consentButton = page.getByRole('button', { name: 'Consent' });
  
  try {
    console.log('Clicking the consent button...');
    await consentButton.click();
    await page.waitForLoadState('networkidle');
    console.log('Consent given, page should be fully loaded now');
    handledConsent = true;
  } catch (error) {
    console.log('No consent screen found or error clicking it:', error.message);
  }

  //explicit wait for consent button to be visible
  // try {
  //   await consentButton.waitFor({ state: 'visible', timeout: 10000 });
  //   console.log('Consent button is visible.');
  //   await consentButton.click();
  // } catch (error) {
  //   console.log('Consent button did not appear within the timeout.');
  // }
  
  // Save the browser state if we handled the consent

  if (handledConsent) {
    console.log('Saving browser state to test-results/state.json');
    await page.context().storageState({ path: 'browser_statest/state.json' });
  }
  
  // Take a screenshot and save it to the test-results directory
  await page.screenshot({ path: 'browser_statest/emi-calculator-screenshot.png', fullPage: false });
  
  // Verify we're on the right page by checking the title
  await expect(page).toHaveTitle(/EMI Calculator/);
  console.log('Screenshot saved to browser_statest/emi-calculator-screenshot.png');
  
  // Keep the browser open for 30 seconds before closing
  // console.log('Waiting for 30 seconds before closing the browser...');
  // await page.waitForTimeout(30000);
  console.log('Test completed, closing browser...');
});
