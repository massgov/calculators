import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const getHelpTip = (question, theme, key) => (
  <HelpTip
    text={question.content}
    triggerText={question.triggerText}
    id={`help-tip-${question.triggerText}`}
    labelID={`help-tip-${question.triggerText}-label`}
    theme={theme || 'c-primary'}
    helpText={question.helpText}
    key={key}
    hasMarkup
    bypassMobileStyle={false}
  />
);

export const benefitBreak = ({ maAvgYear }) => (
  return maAvgYear * 0.5;
);

export const benefitBreakWeek = ({ maAvgYear, weeksPerYear, lowBenefitFraction }) => {
    return (benefitBreak(maAvgYear) / weeksPerYear) * lowBenefitFraction;
};

export const maxBenefit = ({ maAvgYear, weeksPerYear, maxBenefitWeek, lowBenefitFraction}) => {
    return ((maxBenefitWeek - benefitBreakWeek(maAvgYear, weekly, lowBenefitFraction)) * weeksPerYear * 2) + benefitBreak;
}

const maxBenefit = ((maxBenefitWeek - benefitBreakWeek) * weeksPerYear * 2) + benefitBreak;

  let estBenefit;
  if (yearIncome <= benefitBreak) {
    // If the yearly income is less than half the state wide avg income.
    estBenefit = yearIncome * lowBenefitFraction;
  } else {
    // If yearly income is greater than half the state wide avg income.
    const addBenefit = yearIncome < maxBenefit ? ((yearIncome - benefitBreak) * highBenefitFraction) : ((maxBenefit - benefitBreak) * highBenefitFraction);
    estBenefit = addBenefit + (benefitBreak * lowBenefitFraction);
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