import numbro from 'numbro';
import { sum } from '../../utils';

import BenefitsVariables from '../../data/BenefitsVariables.json';

const {
  maAvgWeek, maxBenefitWeek, lowBenefitFraction, highBenefitFraction, quartersSumThreshhold
} = BenefitsVariables.baseVariables;

export const buildQuartersArray = ({
  quarter1, quarter2, quarter3, quarter4
}) => {
  let quartersArray = [quarter1, quarter2, quarter3, quarter4];
  quartersArray = quartersArray.map((q) => ((typeof q === 'string') ? numbro.unformat(q) : q));
  return quartersArray;
};

export const paidQuarters = (quartersArray) => {
  const quartersHaveValue = quartersArray.filter((q) => typeof q === 'number' && q > 0);
  const quartersCount = quartersHaveValue.length;
  return{ quartersHaveValue, quartersCount };
};

export const calcWeeklyPay = ({ quartersHaveValue, quartersCount }) => {
  let topQuarters;
  let weeksInTopQuarters = 26;
  if (quartersCount > 2) {
    topQuarters = quartersHaveValue.sort((q1, q2) => q2 - q1).slice(0, 2);
  } else if (quartersCount > 0) {
    topQuarters = quartersHaveValue.sort((q1, q2) => q2 - q1).slice(0, 1);
    weeksInTopQuarters = 13;
  }
  const topQuartersSum = topQuarters && topQuarters.length > 0 && topQuarters.reduce(sum);
  // average weekly pay is rounded up to the nearest dollar
  const avgWeeklyPay = Math.ceil(topQuartersSum / weeksInTopQuarters);
  return avgWeeklyPay;
};

export const calcWeeklyBenefit = (avgWeeklyPay) => {
  const benefitBreakWeek = maAvgWeek * 0.5;
  // // The estimated weekly benefit you would receive.
  const weeklyBenefit = Math.min(maxBenefitWeek, (lowBenefitFraction * Math.min(avgWeeklyPay, benefitBreakWeek)) + (highBenefitFraction * Math.max(avgWeeklyPay - benefitBreakWeek, 0)));
  // // The estimated total benefit you can receive based on the number of weeks you are covered.
  // // const totBenefit = weeklyBenefit * maxWeeks;
  return weeklyBenefit;
};

export const calcEligibility = ({ weeklyBenefit, quartersHaveValue }) => {
  // qualifications
  const quartersSum = quartersHaveValue.length > 0 && quartersHaveValue.reduce(sum);
  // qualification 1: total wages is no less than the threshhold
  const qualification1 = !(quartersSum < quartersSumThreshhold);
  // qualification 2: total wages is no less than 30 times the PFML weeklyBenefitFinal
  const qualification2 = !(quartersSum < (30 * weeklyBenefit));
  const qualified = qualification1 && qualification2;
  return{ qualified, qualification1, qualification2 };
};


export const calcTotalBenefit = ({ benefitDuration, weeklyBenefit }) => {
  // the first week is unpaid
  const totalBenefit = (benefitDuration - 1) * weeklyBenefit;
  return totalBenefit;
};
