import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { CalloutAlert, HelpTip, Paragraph } from '@massds/mayflower-react';
import { toCurrency, toPercentage } from '../../util';

const sum = (a, b) => a + b;

const Output = (props) => {
  const {
    quarter1, quarter2, quarter3, quarter4
  } = props;

  const quartersHaveValue = [quarter1, quarter2, quarter3, quarter4].filter((q) => typeof q === 'number' && q > 0);
  const quartersCount = quartersHaveValue.length;

  // qualification
  const quartersSumThreshhold = 4700;
  const quartersSum = quartersHaveValue.length > 0 && quartersHaveValue.reduce(sum);
  const qualified = !(quartersSum < quartersSumThreshhold);

  // weekly benefit
  let topQuarters;
  let weeksInTopQuarters = 26;
  if (quartersCount > 2) {
    topQuarters = quartersHaveValue.sort((q1, q2) => q2 - q1).slice(0, 2);
  } else if (quartersCount > 0) {
    topQuarters = quartersHaveValue.sort((q1, q2) => q2 - q1).slice(0, 1);
    weeksInTopQuarters = 13;
  }
  const topQuartersSum = topQuarters && topQuarters.length > 0 && topQuarters.reduce(sum);
  const weeklyBenefit = 1 / 2 * topQuartersSum / weeksInTopQuarters;
  const weeklyBenefitMax = 795;
  const weeklyBenefitFinal = weeklyBenefit > weeklyBenefitMax ? weeklyBenefitMax : weeklyBenefit;

  // max benefit credit
  const maxBenefitOption1 = 30 * weeklyBenefitFinal;
  const maxBenefitOption2 = quartersSum * 0.36;
  const maxBenefitFinal = maxBenefitOption1 > maxBenefitOption2 ? maxBenefitOption2 : maxBenefitOption1;

  // benefit duration
  const benefitDuration = maxBenefitFinal / weeklyBenefitFinal;

  const getHelpText = () => (
    <div className="ma__help-text">
      { weeklyBenefit > weeklyBenefitMax ? (
        <Paragraph text={`Your weekly benefit is capped at ${toCurrency(weeklyBenefitMax)}.`} />
      ) : (
        <Fragment>
          <Paragraph text="Your weekly benefit is half of the sum of the highest quarters divided by the number of weeks in the combined quarters:" />
          <div className="ma__output-calculation"><Paragraph text={`${toCurrency(weeklyBenefit)} = ${toPercentage(1 / 2)} x  ${toCurrency(topQuartersSum)}/ ${weeksInTopQuarters} weeks in the combined quarters`} /></div>
        </Fragment>
      )}
    </div>
  );

  return(
    <Fragment>
      {
      qualified ? (
        <CalloutAlert theme="c-primary" icon={null}>
          <HelpTip
            theme="c-white"
            textBefore="You would be eligible to receive "
            triggerText={`<span>${toCurrency(weeklyBenefitFinal)} for ${parseInt(benefitDuration, 10)} weeks</span>`}
            textAfter={`, based on your maximum benefit credit of ${toCurrency(maxBenefitFinal)}.`}
            id="help-tip-benefits"
            labelID="help-tip-benefits-label"
          >
            { getHelpText() }
          </HelpTip>
        </CalloutAlert>
      ) : (
        <CalloutAlert theme="c-error-red" icon={null}>
          <HelpTip
            theme="c-white"
            textBefore="You are "
            triggerText={'<span>not eligible</span>'}
            textAfter="for unemployment benefits."
            id="help-tip-benefits"
            labelID="help-tip-benefits-label"
          >
          <div className="ma__help-text">
            <Paragraph text={`You must have earned at least ${toCurrency(quartersSumThreshhold)} during the last 4 completed calendar quarters to be eligible`} />
          </div>
          </HelpTip>
        </CalloutAlert>
      )
    }
    </Fragment>
  );
};

Output.propTypes = {
  quarter1: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  quarter2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  quarter3: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  quarter4: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Output;
