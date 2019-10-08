import React, { Fragment, useContext } from 'react';
import {
  CalloutAlert, HelpTip, Paragraph, Input, InputContext, FormContext
} from '@massds/mayflower-react';
import { toCurrency, displayCurrency, toNumber } from './util';

const helptipIframeProp = {};
if (process.env.REACT_APP_IFRAME === 'true') {
  helptipIframeProp.bypassMobileStyle = true;
}

export const ScenarioOne = () => {
  // Do not make a copy of formContext with object destructuring.
  // eslint-disable-next-line react/destructuring-assignment
  const formContext = useContext(FormContext);
  // These are default values only.
  const scenarioDefaults = {
    showScenario: false,
    weeklyBenefits: formContext.hasId('weekly-benefits') ? formContext.getValue('weekly-benefits') : null,
    weeklyEarnings: formContext.hasId('weekly-earnings') ? formContext.getValue('weekly-earnings') : null
  };
  return(
    <Input id="scenario-one" defaultValue={scenarioDefaults}>
      <InputContext.Consumer>
        { (inputContext) => {
          // Updated by handleChange.
          const { showScenario } = inputContext.getValue();
          const values = formContext.getValues();
          const weeklyBenefits = toNumber(values['weekly-benefits']);
          const weeklyEarnings = toNumber(values['weekly-earnings']);
          if (
            showScenario
            && !Number.isNaN(weeklyBenefits) && weeklyEarnings !== 0
            && !Number.isNaN(weeklyEarnings)) {
            return(
              <Fragment>
                <hr />
                <CalloutAlert theme="c-primary" icon={null}>
                  <HelpTip
                    theme="c-white"
                    triggerText={['<strong>not affected</strong>']}
                    text="Your weekly benefits are <strong>not affected</strong>."
                    id="help-tip-scenario-one"
                    labelID="help-tip-scenario-one-label"
                    {...helptipIframeProp}
                  >
                    <div className="ma__help-text">As you make no more than 1/3 of your weekly benefits through your part time employment, your weekly benefit stays the same.</div>
                  </HelpTip>
                  <Paragraph text={`You will take home ${displayCurrency(weeklyBenefits)} from UI benefits and ${displayCurrency(weeklyEarnings)} from your income, a gross total of ${displayCurrency(toNumber(weeklyBenefits) + toNumber(weeklyEarnings))} weekly (before taxes, deductions, and other adjustments).`} />
                </CalloutAlert>
              </Fragment>
            );
          }
          return null;
        }}
      </InputContext.Consumer>
    </Input>
  );
};


export const ScenarioTwo = () => {
  // Do not make a copy of formContext with object destructuring.
  // eslint-disable-next-line react/destructuring-assignment
  const formContext = useContext(FormContext);
  // These are default values only.
  const scenarioDefaults = {
    showScenario: false,
    weeklyBenefits: formContext.hasId('weekly-benefits') ? formContext.getValue('weekly-benefits') : null,
    weeklyEarnings: formContext.hasId('weekly-earnings') ? formContext.getValue('weekly-earnings') : null,
    earningsDisregard: formContext.hasId('earnings-disregard') ? formContext.getValue('earnings-disregard') : null,
    reducedBenefit: null,
    earningsOverDis: null
  };
  return(
    <Input id="scenario-two" defaultValue={scenarioDefaults}>
      <InputContext.Consumer>
        { (inputContext) => {
          // Updated by handleChange.
          const { reducedBenefit, earningsOverDis, showScenario } = inputContext.getValue();
          const values = formContext.getValues();
          const weeklyBenefits = toNumber(values['weekly-benefits']);
          const weeklyEarnings = toNumber(values['weekly-earnings']);
          const earningsDisregard = toNumber(values['earnings-disregard']);
          console.log( earningsDisregard)
          const earningsOverDisDisclaimer = '*The earnings over earnings exclusion is always rounded up to the nearest dollar amount.';
          if (
            showScenario
            && !Number.isNaN(weeklyBenefits)
            && !Number.isNaN(weeklyEarnings)
            && !Number.isNaN(reducedBenefit)
            && !Number.isNaN(earningsOverDis)
            && !Number.isNaN(earningsDisregard)) {
            return(
              <Fragment>
                <hr />
                <CalloutAlert theme="c-primary" icon={null}>
                  <HelpTip
                    theme="c-white"
                    triggerText={[toCurrency(reducedBenefit)]}
                    text={`Your reduced weekly benefit amount is ${toCurrency(reducedBenefit)}.`}
                    id="help-tip-scenario-two"
                    labelID="help-tip-scenario-two-label"
                    {...helptipIframeProp}
                  >
                    <div className="ma__help-text">
                      <Paragraph text={`Earnings over earnings exclusion*: ${toCurrency(earningsOverDis)} = ${toCurrency(weeklyEarnings)} - ${toCurrency(earningsDisregard)}`} />
                      <span className="ma__disclaimer">
                        <Paragraph text={earningsOverDisDisclaimer} />
                      </span>
                      <Paragraph text={`Reduced weekly benefit: <strong>${toCurrency(reducedBenefit)}</strong> = ${toCurrency(weeklyBenefits)} - ${toCurrency(earningsOverDis)}`} />
                    </div>
                  </HelpTip>
                  <Paragraph text={`You will take home ${displayCurrency(reducedBenefit)} from UI benefits and ${displayCurrency(weeklyEarnings)} from your income, a gross total of ${displayCurrency(toNumber(reducedBenefit) + toNumber(weeklyEarnings))} weekly (before taxes, deductions, and other adjustments). `} />
                </CalloutAlert>
              </Fragment>
            );
          }
          return null;
        }}
      </InputContext.Consumer>
    </Input>
  );
};

export const ScenarioThree = () => {
  // Do not make a copy of formContext with object destructuring.
  // eslint-disable-next-line react/destructuring-assignment
  const formContext = useContext(FormContext);
  // These are default values only.
  const scenarioDefaults = {
    showScenario: false,
    weeklyBenefits: formContext.hasId('weekly-benefits') ? formContext.getValue('weekly-benefits') : null,
    weeklyEarnings: formContext.hasId('weekly-earnings') ? formContext.getValue('weekly-earnings') : null,
    earningsDisregard: formContext.hasId('earnings-disregard') ? formContext.getValue('earnings-disregard') : null,
    reducedBenefit: null,
    earningsOverDis: null
  };
  return(
    <Input id="scenario-three" defaultValue={scenarioDefaults}>
      <InputContext.Consumer>
        { (inputContext) => {
          // Updated by handleChange.
          const { reducedBenefit, earningsOverDis, showScenario } = inputContext.getValue();
          const values = formContext.getValues();
          const weeklyBenefits = toNumber(values['weekly-benefits']);
          const weeklyEarnings = toNumber(values['weekly-earnings']);
          const earningsDisregard = toNumber(values['earnings-disregard']);
          if (
            showScenario
            && !Number.isNaN(weeklyBenefits)
            && !Number.isNaN(weeklyEarnings)
            && !Number.isNaN(reducedBenefit)
            && !Number.isNaN(earningsOverDis)
            && !Number.isNaN(earningsDisregard)) {
            return(
              <Fragment>
                <hr />
                <CalloutAlert theme="c-error-red" icon={null}>
                  <Paragraph text="Because your weekly part-time earnings is over the UI benefits plus the earnings disregard (1/3 of the UI benefits), you are no longer eligible for the benefits. " />
                  <Paragraph text={`You will take home ${displayCurrency(0)} from UI benefits and ${displayCurrency(weeklyEarnings)} from your income, a total amount of ${displayCurrency(weeklyEarnings)} weekly (before taxes, deductions, and other adjustments).`} />
                </CalloutAlert>
              </Fragment>
            );
          }
          return null;
        }}
      </InputContext.Consumer>
    </Input>
  );
};
