/**
 * Helper function to set slider values with visual feedback
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {string} sliderSelector - CSS selector for the slider element
 * @param {number|string} value - The target value to set
 * @param {string} fieldName - The name of the input field (for the role locator)
 * @param {number} minValue - Minimum possible value of the slider
 * @param {number} maxValue - Maximum possible value of the slider
 * @returns {Promise<void>}
 */
async function setSliderValue(page, sliderSelector, value, fieldName, minValue, maxValue) {
    // First set the input field value directly
    const input = await page.getByRole('textbox', { name: fieldName });
    await input.click();
    await input.fill(value.toString());
    await input.press('Enter');
    
    // Then adjust using the slider for any visual updates
    const slider = page.locator(sliderSelector);
    const sliderBoundingBox = await slider.boundingBox();
    
    if (!sliderBoundingBox) {
      throw new Error(`Slider ${sliderSelector} not found`);
    }
    
    // Get the current value to calculate the percentage
    const currentValue = parseFloat(await input.inputValue());
    const percentage = ((currentValue - minValue) / (maxValue - minValue)) * 100;
    
    // Calculate the target x position
    const targetX = (sliderBoundingBox.width * percentage) / 100;
    
    // Move the slider handle
    await page.mouse.move(
      sliderBoundingBox.x + 5,  // Start slightly inside the slider
      sliderBoundingBox.y + sliderBoundingBox.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(
      sliderBoundingBox.x + targetX,
      sliderBoundingBox.y + sliderBoundingBox.height / 2,
      { steps: 10 }
    );
    await page.mouse.up();
    
    // Verify the value was set correctly
    const actualValue = await input.inputValue();
    const expectedValue = value.toString();
    // Remove commas for comparison to handle number formatting
    const normalize = (val) => val.toString().replace(/,/g, '');
    if (normalize(actualValue) !== normalize(expectedValue)) {
      throw new Error(`Failed to set ${fieldName} to ${expectedValue}. Actual value: ${actualValue}`);
    }
    else {
        console.log(`\nSuccessfully set ${fieldName} to ${expectedValue}`);
    }
  }
  
  module.exports = {
    setSliderValue
  };
  