const { test, expect } = require('../../../fixtures/emiCalculator.fixture');

// Function to get computed styles for an element
async function getElementStyles(page, selector, index) {
  return page.evaluate(([sel, idx]) => {
    const element = document.querySelectorAll(sel)[idx];
    if (!element) return null;
    
    const styles = window.getComputedStyle(element);
    return {
      id: `heading-${idx + 1}`,
      tagName: element.tagName,
      text: element.textContent.trim(),
      styles: {
        'color': styles.color,
        'font-size': styles.fontSize,
        'font-family': styles.fontFamily,
        'font-weight': styles.fontWeight,
        'line-height': styles.lineHeight,
        'text-align': styles.textAlign,
        'margin': styles.margin,
        'padding': styles.padding,
        'display': styles.display,
        'position': styles.position
      },
      boundingBox: element.getBoundingClientRect().toJSON()
    };
  }, [selector, index]);
}

test('analyze all headings on page', async ({ emiCalculatorPage: page }) => {
  const selector = 'h1, h2, h3, h4, h5, h6';
  
  // Count heading elements
  const headingCount = await page.$$eval(selector, elements => elements.length);
  console.log(`\n📊 Found ${headingCount} heading(s) on the page`);
  
  // Analyze each heading
  for (let i = 0; i < headingCount; i++) {
    const headingInfo = await getElementStyles(page, selector, i);
    if (!headingInfo) {
      console.log(`\n⚠️ Could not analyze heading #${i + 1}`);
      continue;
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`🔹 ${headingInfo.tagName.toUpperCase()}: "${headingInfo.text}"`);
    console.log('='.repeat(80));
    
    // Log styles in a table format
    console.log('\n📋 Styles:');
    console.table(headingInfo.styles);
    
    // Log position and dimensions
    console.log('\n📏 Dimensions & Position:');
    console.table({
      'Width (px)': Math.round(headingInfo.boundingBox.width),
      'Height (px)': Math.round(headingInfo.boundingBox.height),
      'X (px)': Math.round(headingInfo.boundingBox.x),
      'Y (px)': Math.round(headingInfo.boundingBox.y)
    });
    
    try {
      // Take a screenshot of the heading
      const screenshotPath = `test-results/heading-${headingInfo.id}.png`;
      // Use page.locator with nth index to take screenshot of the specific heading
      await page.locator(selector).nth(i).screenshot({ path: screenshotPath });
      console.log(` Screenshot saved to: ${screenshotPath}`);
    } catch (error) {
      console.error(' Could not take screenshot:', error.message);
    }
  }
});

test('display About Us heading parameters', async ({ emiCalculatorPage: page }) => {
  // Find the About Us heading
  const aboutUsHeading = page.getByRole('heading', { name: 'About Us', exact: true });
  
  // Get all computed styles and element properties
  const headingInfo = await aboutUsHeading.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const styleObj = {};

    
    // Convert CSSStyleDeclaration to a plain object
    for (let i = 0; i < styles.length; i++) {
      const prop = styles[i];
      styleObj[prop] = styles.getPropertyValue(prop);
    }
    
    return {
      tagName: el.tagName,
      className: el.className,
      id: el.id || 'none',
      text: el.textContent.trim(),
      attributes: Array.from(el.attributes).map(attr => ({
        name: attr.name,
        value: attr.value
      })),
      boundingBox: {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        x: Math.round(rect.x),
        y: Math.round(rect.y)
      },
      styles: styleObj
    };
  });


  
  console.log('\n🔍 About Us Heading Details:');
  console.log('='.repeat(40));
  console.log(`Tag: ${headingInfo.tagName}`);
  console.log(`Class: ${headingInfo.className || 'none'}`);
  console.log(`ID: ${headingInfo.id}`);
  console.log(`Text: "${headingInfo.text}"`);
  
  console.log('\n📋 Attributes:');
  headingInfo.attributes.forEach(attr => {
    console.log(`- ${attr.name}: ${attr.value}`);
  });
  
  console.log('\n📏 Dimensions & Position:');
  console.table(headingInfo.boundingBox);
  
  console.log('\n🎨 Important Styles:');
  const importantStyles = {
    'font-size': headingInfo.styles['font-size'],
    'font-family': headingInfo.styles['font-family'],
    'font-weight': headingInfo.styles['font-weight'],
    'color': headingInfo.styles['color'],
    'text-align': headingInfo.styles['text-align'],
    'display': headingInfo.styles['display'],
    'position': headingInfo.styles['position']
  };
  console.table(importantStyles);
  
  console.log('\n✅ Displayed all parameters for "About Us" heading');
});

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
  
  // Verify styles
  await expect(aboutUsHeading).toHaveCSS('font-size', '24px');
  await expect(aboutUsHeading).toHaveCSS('font-family', /Lato/);
  await expect(aboutUsHeading).toHaveCSS('font-weight', '500');
  await expect(aboutUsHeading).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(aboutUsHeading).toHaveCSS('text-align', 'left');
  await expect(aboutUsHeading).toHaveCSS('display', 'block');
  await expect(aboutUsHeading).toHaveCSS('position', 'static');
  
  // Verify no class or ID is set
  const className = await aboutUsHeading.getAttribute('class');
  const id = await aboutUsHeading.getAttribute('id');
  expect(className).toBeFalsy();
  expect(id).toBeFalsy();
  
  console.log('✅ Verified all properties of "About Us" heading');
});
