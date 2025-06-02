const { test, expect } = require('../../fixtures/emiCalculator.fixture');

// Test cases array for different headings
const headingTestCases = [
  {
    name: 'EMI Calculator for Home Loan, Car Loan & Personal Loan in India',
    role: 'heading',
    level: 1, // h1
    expectedStyles: {
      'font-size': '36px',
      'font-family': /Lato/,
      // 'color': 'rgb(33, 37, 41)',
      // 'font-weight': '500',
      // 'text-align': 'center',
      // 'display': 'block',
      // 'position': 'static'
    }
  },
  {
    name: 'About Us',
    role: 'heading',
    level: 3, // h3
    expectedStyles: {
      'font-size': '24px',
      'font-family': /Lato/,
      // 'font-weight': '500',
      // 'color': 'rgb(255, 255, 255)',
      // 'text-align': 'left',
      // 'display': 'block',
      // 'position': 'static'
    }
  },
  // Add more test cases for other headings here
];

test.describe('Heading Verification Tests', () => {
  for (const testCase of headingTestCases) {
    test(`verify ${testCase.name} heading properties`, async ({ emiCalculatorPage: page }) => {
      // Find the heading
      const heading = page.getByRole(testCase.role, { name: testCase.name, exact: true });
      
      // Basic element verification
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText(testCase.name);
      
      // Verify element type and structure
      const tagName = await heading.evaluate(el => el.tagName);
      expect(tagName).toBe(`H${testCase.level}`);
      
      // Verify dimensions if specified
      if (testCase.dimensions) {
        const box = await heading.boundingBox();
        expect(Math.round(box.width)).toBe(testCase.dimensions.width);
        expect(Math.round(box.height)).toBe(testCase.dimensions.height);
      }
      
      // Log and verify styles
      const cssProps = Object.keys(testCase.expectedStyles);
      const cssValues = {};
      
      for (const prop of cssProps) {
        const value = await heading.evaluate((el, p) => 
          window.getComputedStyle(el).getPropertyValue(p), prop);
        cssValues[prop] = value;
      }
      
      console.log(`\n${testCase.name} Heading CSS Values:`);
      console.table(cssValues);
      
      // Verify expected styles
      for (const [prop, expected] of Object.entries(testCase.expectedStyles)) {
        await expect(heading).toHaveCSS(prop, expected);
      }
      
      // Verify no class or ID is set by default
      const className = await heading.getAttribute('class');
      const id = await heading.getAttribute('id');
      expect(className).toBeFalsy();
      expect(id).toBeFalsy();
      
      console.log(`✅ Verified all properties of "${testCase.name}" heading`);
    });
  }
});
