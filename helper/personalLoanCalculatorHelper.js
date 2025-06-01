/**
 * Helper class for EMI calculation
 */
class LoanCalculatorHelper {
    /**
     * Calculate loan payments
     * @param {number} loanAmount - Loan amount in currency
     * @param {number} interestRate - Annual interest rate (e.g., 12 for 12%)
     * @param {number} loanTenureYears - Loan tenure in years
     * @param {number} [startYear] - Start year of the loan (defaults to current year)
     * @param {number} [startMonth] - Start month (1-12, defaults to current month)
     * @returns {Object} Object containing payment details
     */
    static calculateLoanPayments(
        loanAmount,
        interestRate,
        loanTenureYears,
        startYear = new Date().getFullYear(),
        startMonth = new Date().getMonth() + 1
    ) {
        // Convert month to number if it's a string
        let monthNumber = startMonth;
        if (typeof startMonth === 'string') {
            const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            const monthIndex = monthNames.indexOf(startMonth.toLowerCase().substring(0, 3));
            if (monthIndex !== -1) {
                monthNumber = monthIndex + 1;
            } else {
                // If month name is invalid, default to current month
                console.warn(`Invalid month name: ${startMonth}. Using current month.`);
                monthNumber = new Date().getMonth() + 1;
            }
        }
        // Convert annual interest rate to monthly
        const monthlyInterestRate = interestRate / 1200;
        
        // Calculate loan tenure in months
        const loanTenureMonths = loanTenureYears * 12;
        
        // Calculate monthly EMI
        const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTenureMonths)) / 
                   (Math.pow(1 + monthlyInterestRate, loanTenureMonths) - 1);
        
        // Initialize variables for tracking payments
        let remainingBalance = loanAmount;
        const yearlyPayments = [];
        let currentYear = startYear;
        let currentMonth = monthNumber - 1; // Convert to 0-based month
        let yearlyPrincipal = 0;
        let yearlyInterest = 0;
        let totalPayment = 0;

        // Loop through each month to calculate payments
        for (let i = 0; i < loanTenureMonths; i++) {
            // Calculate monthly payments
            const monthlyInterestPayment = remainingBalance * monthlyInterestRate;
            const monthlyPrincipalPayment = emi - monthlyInterestPayment;
            remainingBalance = Math.max(0, remainingBalance - monthlyPrincipalPayment);

            // Update yearly totals
            yearlyPrincipal += monthlyPrincipalPayment;
            yearlyInterest += monthlyInterestPayment;
            totalPayment += emi;

            // Check if the year has ended or it's the last payment
            if ((currentMonth + 1) % 12 === 0 || i === loanTenureMonths - 1) {
                yearlyPayments.push({
                    year: currentYear,
                    principal: Math.round(yearlyPrincipal),
                    interest: Math.round(yearlyInterest),
                    total: Math.round(totalPayment),
                    remaining: Math.round(remainingBalance)
                });

                // Reset yearly totals for the next year
                currentYear++;
                currentMonth = 0; // Reset to January
                yearlyPrincipal = 0;
                yearlyInterest = 0;
                totalPayment = 0;
            } else {
                currentMonth++;
            }
        }

        return {
            emi: Math.round(emi),
            totalInterest: yearlyPayments.reduce((sum, year) => sum + year.interest, 0),
            totalPayment: yearlyPayments.reduce((sum, year) => sum + year.total, 0),
            yearlyPayments
        };
    }
}

// Export the class for use in other modules
module.exports = { LoanCalculatorHelper };
