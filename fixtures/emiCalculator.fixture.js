const { test: baseTest, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const test = baseTest.extend({
  emiCalculatorPage: async ({ browser }, use, testInfo) => {
    const projectName = testInfo.project.name || 'default';
    const statePath = `fixtures/state-${projectName}.json`;
    
    // Check if state exists
    if (fs.existsSync(statePath)) {
      console.log(`Using existing state from ${statePath}`);
      const context = await browser.newContext({ storageState: statePath });
      const page = await context.newPage();
      await page.goto('https://emicalculator.net/');
      await use(page);
      await context.close();
      return;
    }
    
    // If no state exists, create new
    console.log('No existing state found, creating new...');
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://emicalculator.net/');
    
    // Handle consent if it appears
    try {
      const consentButton = page.getByRole('button', { name: 'Consent' });
      await expect(consentButton).toBeVisible({ timeout: 5000 });
      await consentButton.click();
      await page.waitForLoadState('networkidle');
      console.log('Consent given and browser state saved');
      await context.storageState({ path: statePath });
    } catch (error) {
      console.log('No consent screen found or not visible');
    }
    
    await use(page);
    await context.close();
  }
});

module.exports = { test, expect };
