import React, { Fragment } from 'react';
import {
  Form, FormProvider, InputCurrency, CalloutAlert, HelpTip, Input, InputContext, Paragraph
} from '@massds/mayflower-react';
import { toCurrency, displayCurrency, toNumber } from './util';
import { QuestionOne, QuestionTwo } from './Inputs';
import OutputOne from './Output1';
import { ScenarioOne, ScenarioTwo } from './Output2';
import './style.css';

// Anything within the form component is only rendered a single time.
// To make content update when formContext updates, you can make new components
// with Input and InputContext. When the new Input's value is updated
// with formContext.setValue, the component will re-render without re-rendering the entire form.
// See the Scenario components and QuestionOne for examples.
const Calculator = () => (
  <FormProvider>
    <Form>
      {
          (formContext) => {
            const handleChange = (newVal, id) => {
              if (id === 'weekly-benefits') {
                if (formContext.hasId('weekly-benefits')) {
                  const weeklyBenefits = toNumber(formContext.getValue('weekly-benefits'));
                  if (!Number.isNaN(weeklyBenefits)) {
                    const earningsDisregard = (weeklyBenefits * (1 / 3));
                    formContext.setValue({ id: 'earnings-disregard', value: earningsDisregard });
                  } else {
                    formContext.setValue({ id: 'earnings-disregard', value: 0 });
                  }
                }
              }
              if (formContext.hasId('scenario-one') && formContext.hasId('weekly-benefits') && formContext.hasId('weekly-earnings')) {
                const weeklyBenefits = toNumber(formContext.getValue('weekly-benefits'));
                const weeklyEarnings = toNumber(formContext.getValue('weekly-earnings'));
                const earningsDisregard = toNumber(formContext.getValue('earnings-disregard'));
                if (!Number.isNaN(weeklyBenefits) && !Number.isNaN(weeklyEarnings)) {
                  if (weeklyEarnings <= earningsDisregard) {
                    formContext.setValue({ id: 'scenario-one', value: { showScenario: true } });
                  } else {
                    formContext.setValue({ id: 'scenario-one', value: { showScenario: false } });
                  }
                } else {
                  formContext.setValue({ id: 'scenario-one', value: { showScenario: false } });
                }
              }
              if (formContext.hasId('scenario-two') && formContext.hasId('earnings-disregard') && formContext.hasId('weekly-earnings')) {
                const weeklyBenefits = toNumber(formContext.getValue('weekly-benefits'));
                const weeklyEarnings = toNumber(formContext.getValue('weekly-earnings'));
                const earningsDisregard = toNumber(formContext.getValue('earnings-disregard'));
                const reducedBenefit = weeklyBenefits - (weeklyEarnings - earningsDisregard);
                const earningsOverDis = weeklyBenefits - earningsDisregard;
                if (!Number.isNaN(weeklyBenefits) && !Number.isNaN(weeklyEarnings) && !Number.isNaN(earningsDisregard)) {
                  if (weeklyEarnings > earningsDisregard) {
                    formContext.setValue({ id: 'scenario-two', value: { showScenario: true, reducedBenefit, earningsOverDis } });
                  } else {
                    formContext.setValue({ id: 'scenario-two', value: { showScenario: false, reducedBenefit, earningsOverDis } });
                  }
                } else {
                  formContext.setValue({ id: 'scenario-two', value: { showScenario: false, reducedBenefit, earningsOverDis } });
                }
              }
            };
            return(
              <Fragment>
                <div className="form-item">
                  <QuestionOne handleChange={handleChange} />
                  <OutputOne />
                </div>
                
                <div className="form-item">
                  <QuestionTwo handleChange={handleChange} />
                </div>
                <div className="form-item">
                  <ScenarioOne formContext={formContext} />
                </div>
                <div className="form-item">
                  <ScenarioTwo formContext={formContext} />
                </div>
              </Fragment>
            );
          }
        }
    </Form>
  </FormProvider>
);

export default Calculator;
