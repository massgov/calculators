import React, { Component } from 'react';
import { InputCurrency, Paragraph, CalloutAlert } from '@massds/mayflower-react';
import numbro from 'numbro';
import CalculatorThreeVariables from '../../data/CalculatorThreeVariables.json';
import OutputProps from '../../data/Output.json';
import EmpSpan from '../EmpSpan';

import './index.css';



const Output = (props) => {
  const { maAvgYear, weeksPerYear, maxBenefit, lowBenefitFraction, highBenefitFraction } = CalculatorThreeVariables.baseVariables;
  const benefitBreak = maAvgYear * 0.5;
  const benefitBreakWeek = benefitBreak/weeksPerYear * lowBenefitFraction;
  const maxBenefitDelta = maxBenefit - benefitBreak;
  const maxBenefitWeek = benefitBreakWeek + (maxBenefitDelta * highBenefitFraction)/weeksPerYear
  const { yearIncome, maxWeeks } = props;
	
  let estBenefit;
	if(yearIncome <= benefitBreak) {
		estBenefit = yearIncome * lowBenefitFraction;
	} else {
		const addBenefit = ( yearIncome - benefitBreak ) > maxBenefitDelta ? ( maxBenefitDelta * highBenefitFraction ) : (( yearIncome - benefitBreak) * highBenefitFraction );
		estBenefit = (benefitBreak * lowBenefitFraction) + addBenefit;
	}
	
  const estWeeklyBenefit = estBenefit / weeksPerYear;
	const percentWeeklyIncome = estWeeklyBenefit / ( yearIncome / weeksPerYear );
	const totBenefit = estWeeklyBenefit * maxWeeks;
	const percentIncome = totBenefit / yearIncome;

	const toCurrency = (number) => {
		const currency = numbro(number).formatCurrency({thousandSeparated: true, mantissa: 2, spaceSeparated: false})
		return currency;
	}
	const toPercentage = (number, decimal) => {
		const mantissa = decimal || 0;
		const percent = numbro(number).format({output: "percent", mantissa: mantissa, spaceSeparated: false});
		return percent;
	}
	
  const { paragraphOne, paragraphTwo, paragraphThree } = OutputProps;
  const { more, less } = paragraphThree;

  return (
  	<div>
    	  <p>{paragraphOne.partOne} {<EmpSpan text={toCurrency(estWeeklyBenefit)}/>} {paragraphOne.partTwo} {<EmpSpan text={toPercentage(percentWeeklyIncome)}/>} {paragraphOne.partThree}</p>
        <p>{paragraphTwo.partOne} {<EmpSpan text={toCurrency(totBenefit)}/>}{paragraphTwo.partTwo} {<EmpSpan text={toPercentage(percentIncome)}/>} {paragraphTwo.partThree}</p>
        <CalloutAlert theme="c-primary" icon={{name: "", ariaHidden: true}}>
          { yearIncome > benefitBreak ? (
            <React.Fragment>
              <Paragraph text={`${more.partOne} ${toCurrency(benefitBreak)} ${more.partTwo} ${toCurrency(benefitBreakWeek)} ${more.partThree} ${toPercentage(highBenefitFraction)} ${more.partFour} ${toCurrency(benefitBreak)} ${more.partFive} ${toCurrency(maxBenefit)}${more.partSix} ${toCurrency(maxBenefitWeek)} ${more.partSeven}`} />
              <div className="ma__output-calculation"><Paragraph text={`${toCurrency(estWeeklyBenefit)} = ${toCurrency(benefitBreakWeek)} + [${toPercentage(highBenefitFraction)} x (${toCurrency(yearIncome)} - ${toCurrency(benefitBreak)})] / ${weeksPerYear} weeks per year`} /></div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Paragraph text={`${less.partOne} ${toCurrency(benefitBreak)} ${less.partTwo} ${toPercentage(lowBenefitFraction)} ${less.partThree} ${toCurrency(benefitBreakWeek)} ${less.partFour}`} />
              <div className="ma__output-calculation"><Paragraph text={`${toCurrency(estWeeklyBenefit)} = (${toCurrency(yearIncome)} x ${toPercentage(lowBenefitFraction)}) / ${weeksPerYear} weeks per year`} /></div>
            </React.Fragment>
          )
            
          }
        </CalloutAlert>
      </div>
  );
}


export default Output;
