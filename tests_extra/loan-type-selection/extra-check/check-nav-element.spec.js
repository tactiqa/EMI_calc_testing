const { test, expect } = require('../../../fixtures/emiCalculator.fixture');

test('verify loan navigation element', async ({ emiCalculatorPage }) => {
  const page = emiCalculatorPage;
  
  // Wait for the navigation element to be present in the DOM
  const nav = page.locator('.loanproduct-nav');
  await expect(nav).toBeAttached();
  
  // 1. Check CSS properties of the navigation element
  console.log('\n=== Checking CSS Properties ===');
  const navStyles = await nav.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      display: styles.display,
      visibility: styles.visibility,
      opacity: styles.opacity,
      position: styles.position,
      zIndex: styles.zIndex,
      width: styles.width,
      height: styles.height,
      overflow: styles.overflow
    };
  });
  console.log('Navigation element styles:', navStyles);
  
  // 2. Check parent elements for visibility issues
  console.log('\n=== Checking Parent Elements ===');
  const parentElements = await nav.evaluateHandle(el => {
    const parents = [];
    let current = el.parentElement;
    while (current && current !== document.body) {
      const styles = window.getComputedStyle(current);
      parents.push({
        tag: current.tagName,
        id: current.id || 'none',
        class: current.className || 'none',
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        position: styles.position,
        zIndex: styles.zIndex,
        overflow: styles.overflow,
        width: styles.width,
        height: styles.height
      });
      current = current.parentElement;
    }
    return parents;
  });
  
  const parentArray = await parentElements.jsonValue();
  console.log('Parent elements (closest to nav first):');
  parentArray.forEach((parent, index) => {
    console.log(`\nParent ${index + 1}:`);
    console.log(`  Tag: ${parent.tag}, ID: ${parent.id}, Class: ${parent.class}`);
    console.log('  Styles:', {
      display: parent.display,
      visibility: parent.visibility,
      opacity: parent.opacity,
      position: parent.position,
      zIndex: parent.zIndex
    });
  });
  
  // 3. Check if element is in viewport
  console.log('\n=== Viewport Check ===');
  const isInViewport = await nav.evaluate(el => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  });
  console.log('Is navigation element in viewport?', isInViewport);
  
  // 4. Get element dimensions and position
  const box = await nav.boundingBox();
  console.log('\nElement dimensions and position:', {
    x: box?.x,
    y: box?.y,
    width: box?.width,
    height: box?.height
  });
  
  // 5. Check list items inside the navigation
  console.log('\n=== Checking List Items ===');
  const listItems = await nav.locator('li').all();
  console.log(`Found ${listItems.length} list items`);
  
  for (const [index, item] of listItems.entries()) {
    const text = await item.textContent();
    const styles = await item.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        position: styles.position,
        float: styles.float,
        width: styles.width,
        height: styles.height,
        margin: styles.margin,
        padding: styles.padding,
        lineHeight: styles.lineHeight,
        fontSize: styles.fontSize
      };
    });
    
    const itemBox = await item.boundingBox();
    console.log(`\nList Item ${index + 1}: "${text.trim()}"`);
    console.log('  Styles:', styles);
    console.log('  Bounding Box:', {
      x: itemBox?.x,
      y: itemBox?.y,
      width: itemBox?.width,
      height: itemBox?.height
    });
  }
  
  // 6. Check computed styles of the UL element
  console.log('\n=== Checking UL Styles ===');
  const ulStyles = await nav.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      listStyle: styles.listStyle,
      margin: styles.margin,
      padding: styles.padding,
      border: styles.border,
      lineHeight: styles.lineHeight,
      fontSize: styles.fontSize,
      display: styles.display,
      flexDirection: styles.flexDirection,
      flexWrap: styles.flexWrap,
      alignItems: styles.alignItems,
      justifyContent: styles.justifyContent
    };
  });
  console.log('UL Styles:', ulStyles);
  
  // 7. Check for any content that might be affecting layout
  const hasVisibleContent = await nav.evaluate(el => {
    return el.offsetHeight > 0 || 
           el.scrollHeight > 0 || 
           el.getClientRects().length > 0;
  });
  console.log('Has visible content according to DOM:', hasVisibleContent);
  
  // 8. Take a screenshot for visual verification
  await page.screenshot({ path: 'nav-element.png' });
  console.log('\nScreenshot saved as nav-element.png');
});
