import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Paragraph, CalloutAlert, HelpTip, Button
} from '@massds/mayflower-react';
import numbro from 'numbro';
import BenefitsVariables from '../../data/BenefitsVariables.json';
import PartThreeProps from '../../data/PartThree.json';

import './index.css';


const Part3 = (props) => {
  // Base variables provided in the base variable json.
  const {
    maAvgYear, weeksPerYear, maxBenefitWeek, lowBenefitFraction, highBenefitFraction
  } = BenefitsVariables.baseVariables;
  // Inputs from question 1 and 2.
  const { yearIncome, maxWeeks } = props;
  const {
    paragraphOne, paragraphTwo, paragraphThree, buttonLink
  } = PartThreeProps;
  const { more, less, max } = paragraphThree;

  const benefitBreak = maAvgYear * 0.5;
  const benefitBreakWeek = (benefitBreak / weeksPerYear) * lowBenefitFraction;
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

  const getHelpText = () => (
    <div className="ma__help-text">
      { yearIncome <= benefitBreak ? (
        <Fragment>
          <Paragraph text={`${less.partOne} ${toCurrency(benefitBreak)} ${less.partTwo} ${toPercentage(lowBenefitFraction)} ${less.partThree} ${toCurrency(benefitBreakWeek)} ${less.partFour}`} />
          <div className="ma__output-calculation"><Paragraph text={`${toCurrency(estWeeklyBenefit)} = (${toCurrency(yearIncome)} x ${toPercentage(lowBenefitFraction)}) / ${weeksPerYear} weeks per year`} /></div>
        </Fragment>

      ) : (
        <Fragment>
          {yearIncome < maxBenefit ? (
            <Fragment>
              <Paragraph text={`${more.partOne} ${toCurrency(benefitBreak)} ${more.partTwo} ${toCurrency(benefitBreakWeek)} ${more.partThree} ${toPercentage(highBenefitFraction)} ${more.partFour} ${toCurrency(benefitBreak)} ${more.partFive} ${toCurrency(maxBenefit)}${more.partSix} ${toCurrency(maxBenefitWeek)} ${more.partSeven}`} />
              <div className="ma__output-calculation"><Paragraph text={`${toCurrency(estWeeklyBenefit)} = ${toCurrency(benefitBreakWeek)} + [ ${toPercentage(highBenefitFraction)} x (${toCurrency(yearIncome)} - ${toCurrency(benefitBreak)}) / ${weeksPerYear} weeks per year ]`} /></div>
            </Fragment>
          ) : (
            <Fragment>
              <Paragraph text={`${max.partOne} ${toCurrency(maxBenefit)} ${max.partTwo} ${toCurrency(maxBenefitWeek)} ${max.partThree}`} />
              <div className="ma__output-calculation"><Paragraph text={`${toCurrency(estWeeklyBenefit)} = ${toCurrency(benefitBreakWeek)} + [ ${toPercentage(highBenefitFraction)} x (${toCurrency(maxBenefit)} - ${toCurrency(benefitBreak)}) / ${weeksPerYear} weeks per year ]`} /></div>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
  return(
    <Fragment>
      <CalloutAlert theme="c-primary" icon={null}>
        <HelpTip
          theme="c-white"
          text={`${paragraphOne.partOne} <strong>${toCurrency(estWeeklyBenefit)}</strong>${paragraphOne.partTwo} <strong>${toPercentage(percentWeeklyIncome)}</strong> ${paragraphOne.partThree}`}
          triggerText={[`<strong>${toCurrency(estWeeklyBenefit)}</strong>`]}
          id="help-tip-benefits"
          labelID="help-tip-benefits-label"
          bypassMobileStyle={process.env.REACT_APP_IFRAME !== 'false'}
        >
          {getHelpText()}
        </HelpTip>
        <Paragraph text={`${paragraphTwo.partOne} <strong>${toCurrency(totBenefit)}</strong>.`} className="ma__help-text--p" />
      </CalloutAlert>
      <Button type="submit" size="small" info={buttonLink.text} text={buttonLink.text} href={buttonLink.link} />
    </Fragment>
  );
};

Part3.propTypes = {
  yearIncome: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxWeeks: PropTypes.func
};


export default Part3;
