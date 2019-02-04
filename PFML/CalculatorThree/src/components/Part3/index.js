import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Paragraph, CalloutAlert, HelpTip, Button
} from '@massds/mayflower-react';
import numbro from 'numbro';
import CalculatorThreeVariables from '../../data/CalculatorThreeVariables.json';
import PartThreeProps from '../../data/PartThree.json';
import EmpSpan from '../EmpSpan';

import './index.css';


const Part3 = (props) => {
  // Base variables provided in the base variable json.
  const {
    maAvgYear, weeksPerYear, maxBenefitWeek, lowBenefitFraction, highBenefitFraction
  } = CalculatorThreeVariables.baseVariables;
  // Inputs from question 1 and 2.
  const { yearIncome, maxWeeks } = props;
  const {
    paragraphOne, paragraphTwo, paragraphThree, buttonLink
  } = PartThreeProps;
  const { more, less, max } = paragraphThree;

  const benefitBreak = maAvgYear * 0.5;
  const benefitBreakWeek = (benefitBreak / weeksPerYear) * lowBenefitFraction;
  const maxBenefit = ((maxBenefitWeek - benefitBreakWeek) * weeksPerYear * 2) + benefitBreak;
  const maxBenefitDelta = maxBenefit - benefitBreak;

  let estBenefit;
  if (yearIncome <= benefitBreak) {
    // If the yearly income is less than half the state wide avg income.
    estBenefit = yearIncome * lowBenefitFraction;
  } else {
    // If yearly income is greater than half the state wide avg income.
    const addBenefit = (yearIncome - benefitBreak) > maxBenefitDelta ? (maxBenefitDelta * highBenefitFraction) : ((yearIncome - benefitBreak) * highBenefitFraction);
    estBenefit = (benefitBreak * lowBenefitFraction) + addBenefit;
  }

  // The estimated weekly benefit you would receive.
  const estWeeklyBenefit = estBenefit / weeksPerYear;
  // The estimated total benefit you can receive based on the number of weeks you are covered.
  const totBenefit = estWeeklyBenefit * maxWeeks;

  // The percent of weekly income the benefit will cover
  const percentWeeklyIncome = estWeeklyBenefit / (yearIncome / weeksPerYear);
  // The percent of your annual income that, based on the max number of week, you can receive.
  const percentIncome = totBenefit / yearIncome;

  const toCurrency = (number) => {
    const currency = numbro(number).formatCurrency({ thousandSeparated: true, mantissa: 2, spaceSeparated: false });
    return currency;
  };
  const toPercentage = (number, decimal) => {
    const mantissa = decimal || 0;
    const percent = numbro(number).format({ output: 'percent', mantissa, spaceSeparated: false });
    return percent;
  };
  const empClass = 'ma__output-emphasized';
  const getHelpText = () => (
    <CalloutAlert theme="c-primary" icon={{ name: '', ariaHidden: true }}>
      { yearIncome < benefitBreak ? (
        <Fragment>
          <Paragraph text={`${less.partOne} ${toCurrency(benefitBreak)} ${less.partTwo} ${toPercentage(lowBenefitFraction)} ${less.partThree} ${toCurrency(benefitBreakWeek)} ${less.partFour}`} />
          <div className="ma__output-calculation"><Paragraph text={`${toCurrency(estWeeklyBenefit)} = (${toCurrency(yearIncome)} x ${toPercentage(lowBenefitFraction)}) / ${weeksPerYear} weeks per year`} /></div>
        </Fragment>

      ) : (
        <Fragment>
          {yearIncome < maxBenefit ? (
            <Fragment>
              <Paragraph text={`${more.partOne} ${toCurrency(benefitBreak)} ${more.partTwo} ${toCurrency(benefitBreakWeek)} ${more.partThree} ${toPercentage(highBenefitFraction)} ${more.partFour} ${toCurrency(benefitBreak)} ${more.partFive} ${toCurrency(maxBenefit)}${more.partSix} ${toCurrency(maxBenefitWeek)} ${more.partSeven}`} />
              <div className="ma__output-calculation"><Paragraph text={`${toCurrency(estWeeklyBenefit)} = ${toCurrency(benefitBreakWeek)} + [ ${toPercentage(highBenefitFraction)} x (${yearIncome > maxBenefit ? toCurrency(maxBenefit) : toCurrency(yearIncome)} - ${toCurrency(benefitBreak)}) / ${weeksPerYear} weeks per year ]`} /></div>
            </Fragment>
          ) : (
            <Fragment>
              <Paragraph text={`${max.partOne} ${toCurrency(maxBenefit)} ${max.partTwo} ${toCurrency(maxBenefitWeek)} ${max.partThree}`} />
              <div className="ma__output-calculation"><Paragraph text={`${toCurrency(estWeeklyBenefit)} = ${toCurrency(benefitBreakWeek)} + [ ${toPercentage(highBenefitFraction)} x (${yearIncome > maxBenefit ? toCurrency(maxBenefit) : toCurrency(yearIncome)} - ${toCurrency(benefitBreak)}) / ${weeksPerYear} weeks per year ]`} /></div>
            </Fragment>
          )}
        </Fragment>
      )}
    </CalloutAlert>
  );
  return(
    <Fragment>
      <div className="ma__output">
        <HelpTip textBefore={`${paragraphOne.partOne} `} triggerText={`<span class=${empClass} >${toCurrency(estWeeklyBenefit)}</span>`} textAfter={`${paragraphOne.partTwo} <span class=${empClass} >${toPercentage(percentWeeklyIncome)}</span> ${paragraphOne.partThree}`} id="help-tip-benefits" labelID="help-tip-benefits-label">{getHelpText()}</HelpTip>
        <p>
          {paragraphTwo.partOne}
          {' '}
          {<EmpSpan text={toCurrency(totBenefit)} />}
          {paragraphTwo.partTwo}
          {' '}
          {<EmpSpan text={toPercentage(percentIncome)} />}
          {' '}
          {paragraphTwo.partThree}
        </p>
      </div>
      <Button type="submit" size="small" info={buttonLink.text} text={buttonLink.text} href={buttonLink.link} />
    </Fragment>
  );
};

Part3.propTypes = {
  yearIncome: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxWeeks: PropTypes.func
};


export default Part3;
