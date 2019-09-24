import React from 'react';

export const benefitBreak = ({ maAvgYear }) => (
  return maAvgYear * 0.5;
);

export const benefitBreakWeek = ({ maAvgYear, weeksPerYear, lowBenefitFraction }) => {
    return (benefitBreak(maAvgYear) / weeksPerYear) * lowBenefitFraction;
};

export const maxBenefit = ({ maAvgYear, weeksPerYear, maxBenefitWeek, lowBenefitFraction}) => {
    return ((maxBenefitWeek - benefitBreakWeek(maAvgYear, weekly, lowBenefitFraction)) * weeksPerYear * 2) + benefitBreak;
}

export const estBenefit = ({ yearIncome, benefitBreak, lowBenefitFraction, highBenefitFraction, maxBenefit }) => {
    if( yearIncome <= benefitBreak) {
        const estimatedBenefit = yearIncome * lowBenefitFraction;
    } else {
        const addBenefit = yearIncome < maxBenefit ? ((yearIncome - benefitBreak) * highBenefitFraction) : ((maxBenefit - benefitBreak) * highBenefitFraction);
        const estimatedBenefit = addBenefit + (benefitBreak * lowBenefitFraction);
    }
}

  // The estimated weekly benefit you would receive.
  const estWeeklyBenefit = estBenefit / weeksPerYear;
  // The estimated total benefit you can receive based on the number of weeks you are covered.
  const totBenefit = estWeeklyBenefit * maxWeeks;

  // The percent of weekly income the benefit will cover
  const percentWeeklyIncome = estWeeklyBenefit / (yearIncome / weeksPerYear);

  const toCurrency = (number) => {
    const currency = numbro(number).formatCurrency({ thousandSeparated: true, mantissa: 2, spaceSeparated: false });
    return currency;
  };
  const toPercentage = (number, decimal) => {
    const mantissa = decimal || 0;
    const percent = numbro(number).format({ output: 'percent', mantissa, spaceSeparated: false });
    return percent;
  };