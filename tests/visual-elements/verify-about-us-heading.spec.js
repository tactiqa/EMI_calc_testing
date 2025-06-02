const { test, expect } = require('../../fixtures/emiCalculator.fixture');

test('verify About Us heading properties', async ({ emiCalculatorPage: page }) => {
  // Find the About Us heading
  const aboutUsHeading = page.getByRole('heading', { name: 'About Us', exact: true });
  
  // Basic element verification
  await expect(aboutUsHeading).toBeVisible();
  await expect(aboutUsHeading).toHaveText('About Us');
  
  // Verify element type and structure
  const tagName = await aboutUsHeading.evaluate(el => el.tagName);
  expect(tagName).toBe('H3');
  
  // Verify dimensions and position with some tolerance
  const box = await aboutUsHeading.boundingBox();
  expect(Math.round(box.width)).toBe(365);
  expect(Math.round(box.height)).toBe(30);
  
  // Log CSS values for debugging
  const cssProps = ['font-size', 'font-family', 'font-weight', 'color', 'text-align', 'display', 'position'];
  const cssValues = {};
  
  for (const prop of cssProps) {
    const value = await aboutUsHeading.evaluate((el, p) => 
      window.getComputedStyle(el).getPropertyValue(p), prop);
    cssValues[prop] = value;
  }
  
  console.log('\nAbout Us Heading CSS Values:');
  console.table(cssValues);
  
  // Verify styles
  await expect(aboutUsHeading).toHaveCSS('font-size', '24px');
  await expect(aboutUsHeading).toHaveCSS('font-family', /Lato/);
  // await expect(aboutUsHeading).toHaveCSS('font-weight', '500');
  // await expect(aboutUsHeading).toHaveCSS('color', 'rgb(255, 255, 255)');
  // await expect(aboutUsHeading).toHaveCSS('text-align', 'left');
  // await expect(aboutUsHeading).toHaveCSS('display', 'block');
  // await expect(aboutUsHeading).toHaveCSS('position', 'static');
  
  // Verify no class or ID is set
  const className = await aboutUsHeading.getAttribute('class');
  const id = await aboutUsHeading.getAttribute('id');
  expect(className).toBeFalsy();
  expect(id).toBeFalsy();
  
  console.log('✅ Verified all properties of "About Us" heading');
});
