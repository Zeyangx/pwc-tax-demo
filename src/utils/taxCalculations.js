// src/utils/taxCalculations.js

export const calculateIIT = (salary, labor, author, royalty, otherIncome, taxPaid = 0) => {
  const s = Number(salary) || 0;
  const l = Number(labor) || 0;
  const a = Number(author) || 0;
  const r = Number(royalty) || 0;
  const o = Number(otherIncome) || 0;
  const paid = Number(taxPaid) || 0;

  const laborTaxable = l * 0.8;
  const authorTaxable = a * 0.8 * 0.7; 
  const royaltyTaxable = r * 0.8;
  
  const totalComprehensiveIncome = s + laborTaxable + authorTaxable + royaltyTaxable;
  const standardDeduction = 60000; 
  const estimatedSpecialDeductions = 30000; 
  
  let taxableIncome = totalComprehensiveIncome - standardDeduction - estimatedSpecialDeductions;
  if (taxableIncome < 0) taxableIncome = 0;

  let taxAmount = 0;
  if (taxableIncome <= 36000) taxAmount = taxableIncome * 0.03;
  else if (taxableIncome <= 144000) taxAmount = taxableIncome * 0.10 - 2520;
  else if (taxableIncome <= 300000) taxAmount = taxableIncome * 0.20 - 16920;
  else if (taxableIncome <= 420000) taxAmount = taxableIncome * 0.25 - 31920;
  else if (taxableIncome <= 660000) taxAmount = taxableIncome * 0.30 - 52920;
  else if (taxableIncome <= 960000) taxAmount = taxableIncome * 0.35 - 85920;
  else taxAmount = taxableIncome * 0.45 - 181920;

  const equityTax = o * 0.20;
  const totalTaxLiability = taxAmount + equityTax;
  const finalTaxDue = Math.max(0, totalTaxLiability - paid);

  return {
    taxableIncome,
    comprehensiveTax: taxAmount,
    equityTax: equityTax,
    totalTaxLiability: totalTaxLiability,
    taxPaid: paid,
    finalTaxDue: finalTaxDue
  };
};