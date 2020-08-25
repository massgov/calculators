import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import { CalloutAlert, HelpTip, Paragraph } from '@massds/mayflower-react';
import { toCurrency, toPercentage } from '../../utils';
import variables from '../../data/variables.json';

const sum = (a, b) => a + b;

const Output = (props) => {
  const {
    maxBenefitDuration, quartersSumThreshhold, weeklyBenefitMax, maxBenefitRatio
  } = variables;
  const {
    quarter1, quarter2, quarter3, quarter4
  } = props;

  let quartersArray = [quarter1, quarter2, quarter3, quarter4];
  quartersArray = quartersArray.map((q) => ((typeof q === 'string') ? numbro.unformat(q) : q));

  const quartersHaveValue = quartersArray.filter((q) => typeof q === 'number' && q > 0);
  const quartersCount = quartersHaveValue.length;

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
  // average weekly pay is rounded up to the nearest dollar
  const avgWeeklyPay = Math.ceil(topQuartersSum / weeksInTopQuarters);
  // weekly benefit is rounded down to the nearest dollar amount
  const weeklyBenefit = Math.floor(1 / 2 * avgWeeklyPay);
  // WeeklyBenefitFinal is making sure that the weeklyBenefit never exceeds the maximum
  const weeklyBenefitFinal = Math.min(weeklyBenefit, weeklyBenefitMax);

  // qualifications
  const quartersSum = quartersHaveValue.length > 0 && quartersHaveValue.reduce(sum);
  // qualification 1: total wages is no less than the threshhold
  const qualification1 = !(quartersSum < quartersSumThreshhold);
  // qualification 2: total wages is no less than 30 times the weeklyBenefitFinal
  const qualification2 = !(quartersSum < (30 * weeklyBenefitFinal));
  const qualified = qualification1 && qualification2;

  // max benefit credit
  const maxBenefitOption1 = maxBenefitDuration * weeklyBenefitFinal;
  // quartersSum will have cents when wages input contains cents, maxBeneiftFinal is rounded down to the nearest dollar
  const maxBenefitOption2 = Math.floor(maxBenefitRatio * quartersSum);
  const maxBenefitFinal = Math.floor(Math.min(maxBenefitOption1, maxBenefitOption2));
  const maxBenefitOther = Math.max(maxBenefitOption1, maxBenefitOption2);

  // benefit duration
  const benefitDuration = maxBenefitFinal / weeklyBenefitFinal;

  const qualifyAddition = 'You may be eligible for an additional weekly dependency allowance if you have dependent children.';
  const helpTextBasePeriod2Q = 'Your weekly benefit amount is equal to half of the sum of total wages for the 2 highest-earning quarters divided by the number of weeks in the combined quarters:';
  const helpTextBasePeriod1Q = 'Your weekly benefit amount is equal to half of the highest-earning quarter divided by the number of weeks in the quarter:';
  const helpTextWeeks2Q = 'weeks in the combined quarters';
  const helpTextWeeks1Q = 'weeks in the quarter';
  const helpTextDisqualification1 = `You must have earned at least ${toCurrency(quartersSumThreshhold)} during the last 4 completed calendar quarters to be eligible.`;
  const helpTextDisqualification2 = `Your total base period wages of ${toCurrency(quartersSum)} must be equal to or greater than ${toCurrency(weeklyBenefitFinal * 30)} (your weekly benefit amount x 30) to be eligible.`;
  const maxBenefitDurationDisclaimer = 'The maximum number of weeks you can receive full unemployment benefits is 30 weeks (capped at 26 weeks during periods of extended benefits and low unemployment). However, many individuals qualify for less than 30 weeks of coverage.';
  const roundingDisclaimer = 'Note: Calculations are rounded to whole dollar amounts.';

  const getBenefitsHelpText = () => (
    <div className="ma__help-text">
      { weeklyBenefit > weeklyBenefitMax ? (
        <Paragraph text={`Your weekly benefit amount is capped at ${toCurrency(weeklyBenefitMax)}.`} />
      ) : (
        <Fragment>
          <Paragraph text={quartersCount > 2 ? helpTextBasePeriod2Q : helpTextBasePeriod1Q} />
          <div className="ma__output-calculation"><Paragraph text={`${toCurrency(weeklyBenefitFinal)} = ${toPercentage(1 / 2)} x  ${toCurrency(topQuartersSum)} / ${weeksInTopQuarters} ${quartersCount > 2 ? helpTextWeeks2Q : helpTextWeeks1Q}`} /></div>
          { !Number.isInteger(topQuartersSum) && (
            <div className="ma__disclaimer">
              {roundingDisclaimer}
            </div>
          )}
        </Fragment>
      )}
    </div>
  );

  const getDurationHelpText = () => (
    <div className="ma__help-text">
      <Fragment>
        <Paragraph text="Your duration of benefits is equal to your maximum benefit credit divided by your weekly benefit amount:" />
        <div className="ma__output-calculation"><Paragraph text={`${parseInt(benefitDuration, 10)} = ${toCurrency(maxBenefitFinal)} / ${toCurrency(weeklyBenefitFinal)}`} /></div>
        <div className="ma__disclaimer">
          <Paragraph text={maxBenefitDurationDisclaimer} />
        </div>
      </Fragment>
    </div>
  );

  const getTotalHelpText = () => (
    <div className="ma__help-text">
      <Fragment>
        <Paragraph text="Your maximum benefit credit is equal to the lesser of either:" />
        <ul>
          <li>
            {maxBenefitDuration}
            {' '}
            times your weekly benefit amount:
            <Paragraph text={`<strong>${toCurrency(maxBenefitOption1)}</strong> = ${maxBenefitDuration} x ${toCurrency(weeklyBenefitFinal)}`} />
          </li>
          <li>
            {toPercentage(maxBenefitRatio)}
            {' '}
            of the total wages in your base period:
            <Paragraph text={`<strong>${toCurrency(maxBenefitOption2)}</strong> = ${toPercentage(maxBenefitRatio)} x ${toCurrency(quartersSum)}`} />
          </li>
        </ul>
        <Paragraph text={`Since ${toCurrency(maxBenefitFinal)} is less than ${toCurrency(maxBenefitOther)}, your maximum benefit credit is <strong>${toCurrency(maxBenefitFinal)}</strong>.`} />
        { !Number.isInteger(quartersSum) && (
          <div className="ma__disclaimer">
            {roundingDisclaimer}
          </div>
        )}
      </Fragment>
    </div>
  );

  const helptipIframeProp = {};
  if (process.env.REACT_APP_IFRAME === 'true') {
    helptipIframeProp.bypassMobileStyle = true;
  }

  return(
    <Fragment>
      {
      qualified ? (
        <CalloutAlert theme="c-primary" icon={null}>
          <HelpTip
            theme="c-white"
            text={`Based on the information you provided, you may be eligible to receive
              <strong>${toCurrency(weeklyBenefitFinal)}</strong> for <strong>${parseInt(benefitDuration, 10)} weeks</strong>,
              based on your maximum benefit credit of <strong>${toCurrency(maxBenefitFinal)}</strong>.`}
            triggerText={[`<strong>${toCurrency(weeklyBenefitFinal)}</strong>`, `<strong>${parseInt(benefitDuration, 10)} weeks</strong>`, `<strong>${toCurrency(maxBenefitFinal)}</strong>`]}
            id="help-tip-benefits"
            labelID="help-tip-benefits-label"
            {...helptipIframeProp}
          >
            { getBenefitsHelpText() }
            { getDurationHelpText() }
            { getTotalHelpText() }
          </HelpTip>
          <Paragraph text={qualifyAddition} />
        </CalloutAlert>
      ) : (
        <CalloutAlert theme="c-error-red" icon={null}>
          <HelpTip
            theme="c-white"
            text="You are <span>not eligible</span> for unemployment benefits."
            triggerText={['<span>not eligible</span>']}
            id="help-tip-benefits"
            labelID="help-tip-benefits-label"
            {...helptipIframeProp}
          >
            <div className="ma__help-text">
              {
                !qualification1 ? (
                  <Paragraph text={helpTextDisqualification1} />
                ) : (
                  <Fragment>
                    <Paragraph text={helpTextDisqualification2} />
                    <Paragraph text={quartersCount > 2 ? helpTextBasePeriod2Q : helpTextBasePeriod1Q} />
                    <div className="ma__output-calculation"><Paragraph text={`${toCurrency(weeklyBenefitFinal)} = ${toPercentage(1 / 2)} x  ${toCurrency(topQuartersSum)} / ${weeksInTopQuarters} ${quartersCount > 2 ? helpTextWeeks2Q : helpTextWeeks1Q}`} /></div>
                  </Fragment>
                )
              }
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
  quarter4: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxBenefitDuration: PropTypes.string,
  quartersSumThreshhold: PropTypes.string,
  weeklyBenefitMax: PropTypes.string,
  maxBenefitRatio: PropTypes.string
};

export default Output;
