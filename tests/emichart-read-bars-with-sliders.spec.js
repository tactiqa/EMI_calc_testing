const { test, expect } = require('../fixtures/emiCalculator.fixture');
const { LoanCalculatorHelper } = require('../helper/personalLoanCalculatorHelper');
const { setSliderValue } = require('../helper/sliderHelper');

// Test cases array
const testCases = [
  {
    name: 'Personal Loan 1',
    loanAmount: '1000000',
    interestRate: '12',
    loanTenure: '5',
    startMonth: 'Aug',
    toolTipNumber: 2
  },
  // {
  //   name: 'Personal Loan 2',
  //   loanAmount: '2000000',
  //   interestRate: '9.5',
  //   loanTenure: '4',
  //   startMonth: 'Jul',
  //   toolTipNumber: 5
  // }
];

test.describe('EMI Chart Tooltip Test with Sliders', () => {
  testCases.forEach(testCase => {
    test(`verify tooltip values for ${testCase.name}`, async ({ emiCalculatorPage }) => {
      const page = emiCalculatorPage;
      console.log('\nUsing emiCalculatorPage fixture - consent is already handled');
      console.log(`\nRunning test case: ${testCase.name}`);
      
      const { loanAmount, interestRate, loanTenure, startMonth } = testCase;
      let { toolTipNumber } = testCase;
      
      // Verify we're on the right page
      await expect(page).toHaveTitle(/emi calculator/i);
      // await page.waitForLoadState('networkidle');

      console.log('\nClicking on Personal Loan link...');
      await page.getByRole('link', { name: 'Personal Loan' }).click();

      // Initial check of the chart state
      const initialEmiBarChart = page.locator('#emibarchart');
      console.log('Found initial emibarchart div on the page');
      
      // Capture series group state before pressing Enter
      const initialSeriesGroupHTML = await page.evaluate(() => {
        const seriesGroup = document.querySelector('#emibarchart .highcharts-series-group');
        return seriesGroup ? seriesGroup.outerHTML : 'No series group found';
      });
      
      console.log('\nSetting loan details:');
      console.log(`- Loan Amount: ₹${parseInt(loanAmount).toLocaleString('en-IN')}`);
      console.log(`- Interest Rate: ${interestRate}%`);
      console.log(`- Loan Tenure: ${loanTenure} years`);
      console.log(`- Start Month: ${startMonth}`);

      // Set loan amount using slider (0 to 30,00,000)
      await setSliderValue(page, '#loanamountslider', loanAmount, 'Personal Loan Amount', 0, 3000000);
      
      // Set interest rate using slider (5% to 25%)
      await setSliderValue(page, '#loaninterestslider', interestRate, 'Interest Rate', 5, 25);

      // Set loan tenure using slider (0 to 5 years)
      await setSliderValue(page, '#loantermslider', loanTenure, 'Loan Tenure', 0, 5);

      // await page.getByRole('textbox', { name: 'Loan Tenure' }).press('Enter');
    
      // Select schedule and month
      await page.getByRole('textbox', { name: 'Schedule showing EMI payments' }).click();
      await page.locator('span').filter({ hasText: new RegExp(`^${startMonth}$`) }).click();

      // Capture series group state after pressing Enter
      const updatedSeriesGroupHTML = await page.evaluate(() => {
        const seriesGroup = document.querySelector('#emibarchart .highcharts-series-group');
        return seriesGroup ? seriesGroup.outerHTML : 'No series group found';
      });
    
      // Compare the states and log sizes
      const initialSize = Buffer.byteLength(initialSeriesGroupHTML, 'utf8');
      const updatedSize = Buffer.byteLength(updatedSeriesGroupHTML, 'utf8');
    
      console.log('\nInitial series group HTML size:', initialSize, 'bytes');
      console.log('Updated series group HTML size:', updatedSize, 'bytes');
    
      const seriesGroupChanged = initialSeriesGroupHTML !== updatedSeriesGroupHTML;
      console.log('\nSeries group content changed after update:', seriesGroupChanged);

      // Count x-axis grid lines  - Number of bars
      const xAxisGridCount = await page.evaluate(() => {
        const grid = document.querySelector('#emibarchart .highcharts-xaxis-grid');
        return grid ? grid.children.length : 0;
      });
      console.log(`\nNumber of bars: ${xAxisGridCount}\n`);
    
      // Count child elements in highcharts-series-1
      const series1ChildrenCount = await page.evaluate(() => {
        const series1 = document.querySelector('#emibarchart .highcharts-series-1');
        return series1 ? series1.children.length : 0;
      });
      // console.log(`Number of elements in highcharts-series-1: ${series1ChildrenCount}`);

      const elementIndex = Math.min(toolTipNumber - 1, series1ChildrenCount - 1);
      toolTipNumber = elementIndex + 1; // Update to reflect actual element being hovered
    
      // Hover over the specified element
      const element = page.locator('#emibarchart .highcharts-series-1 > *').nth(elementIndex);
      await element.hover({ force: true });
      console.log(`Hovered over chart element ${toolTipNumber} of ${series1ChildrenCount}`);
    
      // Wait for tooltip to be visible
      const tooltip = page.locator('#emibarchart .highcharts-tooltip');
      await tooltip.waitFor({ state: 'visible' });
    
      // Extract and log tooltip text content
      const tooltipTexts = await tooltip.evaluate(el => {
        const tspans = Array.from(el.querySelectorAll('tspan'));
        return tspans.map(t => t.textContent.trim()).filter(Boolean);
      });
    
      console.log('\nTooltip content:');
      tooltipTexts.forEach(text => console.log(`- ${text}`));

      // Calculate loan details using helper
      const loanDetails = LoanCalculatorHelper.calculateLoanPayments(
        parseInt(loanAmount),
        parseFloat(interestRate),
        parseInt(loanTenure),
        new Date().getFullYear(), // current year
        startMonth // month name or number
      );
          
      console.log('\nYearly Breakdown from helper class loanCalculatorHelper:');
      loanDetails.yearlyPayments.forEach(payment => {
        console.log(`  ${payment.year}: Principal ₹${payment.principal} | ` +
          `Interest ₹${payment.interest} | ` +
          `Total ₹${payment.total}`);
      });

      // Extract numeric value from tooltip text
      const principalText = tooltipTexts.find(text => text.includes('Principal : ₹'));
      const principalTooltipValue = principalText ? parseInt(principalText.replace(/[^0-9]/g, '')) : 0;

      // Extract numeric value from tooltip text
      const totalPaymentText = tooltipTexts.find(text => text.includes('Total Payment : ₹'));
      const totalPaymentTooltipValue = totalPaymentText ? parseInt(totalPaymentText.replace(/[^0-9]/g, '')) : 0;
    
      // Parse year from tooltip (format: 'Year : 2030')
      const yearMatch = tooltipTexts.find(text => text.startsWith('Year : '));
      const tooltipYear = yearMatch ? parseInt(yearMatch.split(':')[1].trim()) : null;
    
      if (tooltipYear) {
        // Find the corresponding year in our calculations
        const calculatedYearData = loanDetails.yearlyPayments.find(entry => entry.year === tooltipYear);
        expect(calculatedYearData).toBeDefined();

        // Compare tooltip values with calculated values
        expect(principalTooltipValue).toEqual(calculatedYearData.principal);
        expect(totalPaymentTooltipValue).toEqual(calculatedYearData.total);

        console.log('\n✅ All values matched successfully!');
      }
    });
  });
});