import React, { Fragment, useContext } from 'react';
import {
  CalloutAlert, HelpTip, Paragraph, Input, InputContext, FormContext
} from '@massds/mayflower-react';
import PropTypes from 'prop-types';
import { toCurrency, displayCurrency, toNumber } from './util';

export const ScenarioOne = (props) => {
  // Do not make a copy of formContext with object destructuring.
  // eslint-disable-next-line react/destructuring-assignment
  const formContext = props.formContext;
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
                  >
                    <div className="ma__help-text">As you make less than 1/3 of your weekly benefits through your part time employment, your weekly benefit stays the same.</div>
                  </HelpTip>
                  <Paragraph text={`You take home ${displayCurrency(weeklyBenefits)} from UI benefits and ${displayCurrency(weeklyEarnings)} from your income, a total amount of ${displayCurrency(toNumber(weeklyBenefits) + toNumber(weeklyEarnings))} weekly.`} />
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


export const ScenarioTwo = (props) => {
  // Do not make a copy of formContext with object destructuring.
  // eslint-disable-next-line react/destructuring-assignment
  const formContext = props.formContext;
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
                  >
                    <div className="ma__help-text">
                      <Paragraph text={`Earnings over earnings disregard: ${toCurrency(earningsOverDis)} = ${toCurrency(weeklyEarnings)} - ${toCurrency(earningsDisregard)}`} />
                      <Paragraph text={`Reduced weekly benefit: <strong>${toCurrency(reducedBenefit)}</strong> = ${toCurrency(weeklyBenefits)} - ${toCurrency(earningsOverDis)}`} />
                    </div>
                  </HelpTip>
                  <Paragraph text={`You will take home ${displayCurrency(reducedBenefit)} from UI benefits and ${displayCurrency(weeklyEarnings)} from your income, a total amount of ${displayCurrency(toNumber(reducedBenefit) + toNumber(weeklyEarnings))} weekly. `} />
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

export const ScenarioThree = (props) => {
  // Do not make a copy of formContext with object destructuring.
  // eslint-disable-next-line react/destructuring-assignment
  const formContext = props.formContext;
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
                  <Paragraph text="Because your weekly part-time earnings is over the UI benefits plus the earnings disregard (1/3 of the UI benefits). You are no longer eligible for the benefits. " />
                  <Paragraph text={`You will take home ${displayCurrency(0)} from UI benefits and ${displayCurrency(weeklyEarnings)} from your income, a total amount of ${displayCurrency(weeklyEarnings)} weekly. `} />
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

ScenarioOne.propTypes = {
  formContext: PropTypes.object
};

ScenarioTwo.propTypes = {
  formContext: PropTypes.object
};

ScenarioThree.propTypes = {
  formContext: PropTypes.object
};
