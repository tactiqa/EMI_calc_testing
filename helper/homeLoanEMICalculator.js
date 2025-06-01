// EMI Calculation Formula
const calculateEMI = (P, r, n) => {
    return (P * r * (Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
};

// Calculate Total Interest Paid
const calculateTotalInterest = (EMI, P, n) => {
    return (EMI * n) - P;
};

// Calculate EMI and related values
const calculateEMIDetails = (principal, annualInterestRate, tenureYears) => {
    // Convert tenure to months and annual interest rate to monthly
    const tenureMonths = tenureYears * 12;
    const monthlyInterestRate = annualInterestRate / 100 / 12; // Convert percentage to decimal and yearly to monthly

    // Calculate EMI
    const emi = calculateEMI(principal, monthlyInterestRate, tenureMonths);

    // Calculate Total Interest
    const totalInterest = calculateTotalInterest(emi, principal, tenureMonths);

    // Calculate Total Amount Paid (Principal + Total Interest)
    const totalAmountPaid = principal + totalInterest;

    // Calculate percentages
    const principalPercentage = (principal / totalAmountPaid) * 100;
    const interestPercentage = (totalInterest / totalAmountPaid) * 100;

    return {
        emi: parseFloat(emi.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        totalAmountPaid: parseFloat(totalAmountPaid.toFixed(2)),
        principalPercentage: parseFloat(principalPercentage.toFixed(1)),
        interestPercentage: parseFloat(interestPercentage.toFixed(1))
    };
};

// For CommonJS (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateEMI,
        calculateTotalInterest,
        calculateEMIDetails
    };
}