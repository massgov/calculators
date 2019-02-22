import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import { CalloutAlert, HelpTip, Paragraph } from '@massds/mayflower-react';
import { toCurrency, toPercentage } from '../../utils';

const sum = (a, b) => a + b;

const Output = (props) => {
  const {
    quarter1, quarter2, quarter3, quarter4
  } = props;

  let quartersArray = [quarter1, quarter2, quarter3, quarter4];
  quartersArray = quartersArray.map((q) => ((typeof q === 'string') ? numbro.unformat(q) : q));

  const quartersHaveValue = quartersArray.filter((q) => typeof q === 'number' && q > 0);
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
  const maxBenefitOption2 = 0.36 * quartersSum;
  const maxBenefitFinal = maxBenefitOption1 > maxBenefitOption2 ? maxBenefitOption2 : maxBenefitOption1;
  const maxBenefitOther = maxBenefitOption1 > maxBenefitOption2 ? maxBenefitOption1 : maxBenefitOption2;

  // benefit duration
  const benefitDuration = maxBenefitFinal / weeklyBenefitFinal;


  const helpTextBasePeriod2Q = 'Your weekly benefit is equal to half of the sum of total wages for the 2 highest-earning quarters divided by the number of weeks in the combined quarters:';
  const helpTextBasePeriod1Q = 'Your weekly benefit is equal to half of the highest-earning quarter divided by the number of weeks in the quarter:';

  const getBenefitsHelpText = () => (
    <div className="ma__help-text">
      { weeklyBenefit > weeklyBenefitMax ? (
        <Paragraph text={`Your weekly benefit is capped at ${toCurrency(weeklyBenefitMax)}.`} />
      ) : (
        <Fragment>
          <Paragraph text={quartersCount > 2 ? helpTextBasePeriod2Q : helpTextBasePeriod1Q} />
          <div className="ma__output-calculation"><Paragraph text={`${toCurrency(weeklyBenefit)} = ${toPercentage(1 / 2)} x  ${toCurrency(topQuartersSum)} / ${weeksInTopQuarters} weeks in the combined quarters`} /></div>
        </Fragment>
      )}
    </div>
  );

  const getDurationHelpText = () => (
    <div className="ma__help-text">
      <Fragment>
        <Paragraph text="Your duration of benefits is equal to your maximum benefit credit divided by your weekly benefit amount:" />
        <div className="ma__output-calculation"><Paragraph text={`${parseInt(benefitDuration, 10)} = ${toCurrency(maxBenefitFinal)} / ${toCurrency(weeklyBenefitFinal)}`} /></div>
      </Fragment>
    </div>
  );

  const getTotalHelpText = () => (
    <div className="ma__help-text">
      <Fragment>
        <Paragraph text="Your maximum benefit credit is calculated as the lesser of either:" />
        <ul>
          <li>
30 times your weekly benefit amount:
            <Paragraph text={`<strong>${toCurrency(maxBenefitOption1)}</strong> = 30 x ${toCurrency(weeklyBenefitFinal)}`} />
          </li>
          <li>
36% of the total wages in your base period:
            <Paragraph text={`<strong>${toCurrency(maxBenefitOption2)}</strong> = 36% x ${toCurrency(quartersSum)}`} />
          </li>
        </ul>
        <Paragraph text={`Since ${toCurrency(maxBenefitFinal)} is less than ${toCurrency(maxBenefitOther)}, your maximum benefit credit is <strong>${toCurrency(maxBenefitFinal)}</strong>.`} />
      </Fragment>
    </div>
  );

  return(
    <Fragment>
      {
      qualified ? (
        <CalloutAlert theme="c-primary" icon={null}>
          <HelpTip
            theme="c-white"
            text={`You would be eligible to receive
              <strong>${toCurrency(weeklyBenefitFinal)}</strong> for <strong>${parseInt(benefitDuration, 10)} weeks</strong>,
              based on your maximum benefit credit of <strong>${toCurrency(maxBenefitFinal)}</strong>.`}
            triggerText={[`<strong>${toCurrency(weeklyBenefitFinal)}</strong>`, `<strong>${parseInt(benefitDuration, 10)} weeks</strong>`, `<strong>${toCurrency(maxBenefitFinal)}</strong>`]}
            id="help-tip-benefits"
            labelID="help-tip-benefits-label"
          >
            { getBenefitsHelpText() }
            { getDurationHelpText() }
            { getTotalHelpText() }
          </HelpTip>
        </CalloutAlert>
      ) : (
        <CalloutAlert theme="c-error-red" icon={null}>
          <HelpTip
            theme="c-white"
            text="You are <span>not eligible</span> for unemployment benefits."
            triggerText={['<span>not eligible</span>']}
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
