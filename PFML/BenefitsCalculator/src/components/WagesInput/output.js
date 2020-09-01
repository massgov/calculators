import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { CalloutAlert, HelpTip, Paragraph } from '@massds/mayflower-react';
import { toCurrency, toPercentage, sum } from '../../utils';
import BenefitsVariables from '../../data/BenefitsVariables.json';
import wagesInputData from '../../data/WagesInput.json';
import {
  buildQuartersArray, paidQuarters, calcWeeklyPay, calcWeeklyBenefit, calcEligibility
} from '../formula';

const Output = (props) => {
  const {
    maAvgWeek, maxBenefitWeek, lowBenefitFraction, highBenefitFraction, quartersSumThreshhold
  } = BenefitsVariables.baseVariables;

  const {
    quarter1, quarter2, quarter3, quarter4
  } = props;

  const quartersArray = buildQuartersArray({
    quarter1, quarter2, quarter3, quarter4
  });
  const { quartersHaveValue, quartersCount } = paidQuarters(quartersArray);

  const weeklyPay = calcWeeklyPay({ quartersHaveValue, quartersCount });
  const weeklyBenefit = calcWeeklyBenefit(weeklyPay);
  const { qualified, qualification1 } = calcEligibility({ weeklyBenefit, quartersHaveValue });

  const helpTextBasePeriod2Q = '*Your <b>average weekly income</b> equals to the sum of total wages for the 2 highest-earning quarters divided by the number of weeks in the combined quarters:';
  const helpTextBasePeriod1Q = '*Your <b>average weekly income</b> equals to the highest-earning quarter divided by the number of weeks in the quarter:';
  const helpTextWeeks2Q = 'weeks in the combined quarters';
  const helpTextWeeks1Q = 'weeks in the quarter';

  // weekly benefit
  let topQuarters;
  let weeksInTopQuarters = 26;
  let helpTextWeeklyPay = helpTextBasePeriod2Q;
  let helpTextWeeks = helpTextWeeks2Q;
  if (quartersCount > 2) {
    topQuarters = quartersHaveValue.sort((q1, q2) => q2 - q1).slice(0, 2);
  } else if (quartersCount > 0) {
    topQuarters = quartersHaveValue.sort((q1, q2) => q2 - q1).slice(0, 1);
    weeksInTopQuarters = 13;
    helpTextWeeklyPay = helpTextBasePeriod1Q;
    helpTextWeeks = helpTextWeeks1Q;
  }
  const topQuartersSum = topQuarters && topQuarters.length > 0 && topQuarters.reduce(sum);

  // qualifications
  const quartersSum = quartersHaveValue.length > 0 && quartersHaveValue.reduce(sum);

  const qualifyAddition = 'Choose a reason of leave to determine if you will be eligible and estimate for the duration of your benefit.';
  const helpTextDisqualification1 = `You must have earned at least ${toCurrency(quartersSumThreshhold)} during the last 4 completed calendar quarters to be eligible.`;
  const helpTextDisqualification2 = `Your total base period wages of ${toCurrency(quartersSum)} must be equal to or greater than ${toCurrency(weeklyBenefit * 30)} (your weekly benefit amount x 30) to be eligible.`;


  const benefitBreakWeek = maAvgWeek * 0.5;

  const getWeeklyPayDisclaimer = () => (
    <div className="ma__disclaimer">
      <Paragraph>{helpTextWeeklyPay}</Paragraph>
      <div className="ma__output-calculation">
        <Paragraph text={`${toCurrency(weeklyPay)} = ${toCurrency(topQuartersSum)} / ${weeksInTopQuarters} ${helpTextWeeks}`} />
      </div>
    </div>
  );

  const {
    paragraphThree
  } = wagesInputData;
  const { more, less, max } = paragraphThree;

  const getBenefitsHelpText = () => (
    <div className="ma__help-text">
      {
        // less than or equal to benefitBreakWeek
        weeklyPay <= benefitBreakWeek ? (
          <Fragment>
            <Paragraph text={`${less.partOne} ${toCurrency(benefitBreakWeek)} ${less.partTwo} ${toPercentage(lowBenefitFraction)} ${less.partThree}.`} />
            <div className="ma__output-calculation">
              <Paragraph text={`${toCurrency(weeklyBenefit)} = (${toCurrency(weeklyPay)} x ${toPercentage(lowBenefitFraction)})`} />
            </div>
            {getWeeklyPayDisclaimer()}
          </Fragment>
        ) : (
          <Fragment>
            {
              // more than benefitBreakWeek but less than maxBenefitWeek
              weeklyPay < maxBenefitWeek ? (
                <Fragment>
                  <Paragraph text={`${more.partOne} ${toCurrency(benefitBreakWeek)} ${more.partTwo} ${toPercentage(lowBenefitFraction)} of ${toCurrency(benefitBreakWeek)} ${more.partThree} ${toPercentage(highBenefitFraction)} ${more.partFour} ${toCurrency(benefitBreakWeek)} ${more.partFive}.`} />
                  <div className="ma__output-calculation">
                    <Paragraph text={`${toCurrency(weeklyBenefit)} = ${toCurrency(benefitBreakWeek)} x ${toPercentage(lowBenefitFraction)} + [ ${toPercentage(highBenefitFraction)} x (${toCurrency(weeklyPay)} - ${toCurrency(benefitBreakWeek)})]`} />
                  </div>
                  {getWeeklyPayDisclaimer()}
                </Fragment>
              ) : (
                // over max
                <Fragment>
                  <Paragraph text={`${max.partOne} ${toCurrency(maxBenefitWeek)}.`} />
                </Fragment>
              )}
          </Fragment>
        )
      }
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
              <strong>${toCurrency(weeklyBenefit)}</strong> weekly from the PFML benefits.`}
            triggerText={[`<strong>${toCurrency(weeklyBenefit)}</strong>`]}
            id="help-tip-benefits"
            labelID="help-tip-benefits-label"
            {...helptipIframeProp}
          >

            { getBenefitsHelpText() }
          </HelpTip>
          <div className="ma__disclaimer">
            <Paragraph text={qualifyAddition} />
          </div>
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
                    <div className="ma__output-calculation"><Paragraph text={`${toCurrency(weeklyBenefit)} = ${toPercentage(1 / 2)} x  ${toCurrency(topQuartersSum)} / ${weeksInTopQuarters} ${quartersCount > 2 ? helpTextWeeks2Q : helpTextWeeks1Q}`} /></div>
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
