import React from 'react';
import { CalloutAlert, HelpTip } from '@massds/mayflower-react';
import { toCurrency } from '../../util';

const Output = (props) => {
  const {
    quarter1, quarter2, quarter3, quarter4
  } = props;
  const quartersHaveValue = [quarter1, quarter2, quarter3, quarter4].filter((q) => typeof q === 'number' && q > 0);
  const quartersCount = quartersHaveValue.length;
  let topQuarters;
  let weeksInTopQuarters = 26;
  if (quartersCount > 2) {
    topQuarters = quartersHaveValue.sort((q1, q2) => q2 - q1).slice(0, 2);
  } else if (quartersCount > 0) {
    topQuarters = quartersHaveValue.sort((q1, q2) => q2 - q1).slice(0, 1);
    weeksInTopQuarters = 13;
  }
  const sum = (a, b) => a + b;
  const topQuartersSum = topQuarters && topQuarters.length > 0 && topQuarters.reduce(sum);
  const weeklyBenefit = 1 / 2 * topQuartersSum / weeksInTopQuarters;
  const weeklyBenefitMax = 795;
  const weeklyBenefitFinal = weeklyBenefit > weeklyBenefitMax ? weeklyBenefitMax : weeklyBenefit;
  return(
    <CalloutAlert theme="c-primary" icon={null}>
      <HelpTip
        theme="c-white"
        textBefore="You would be eligible to receive "
        triggerText={`<span>${toCurrency(weeklyBenefitFinal)} for 30 weeks</span>`}
        textAfter=", based on your maximum benefit credit."
        id="help-tip-benefits"
        labelID="help-tip-benefits-label"
      />
    </CalloutAlert>
  );
};

export default Output;
