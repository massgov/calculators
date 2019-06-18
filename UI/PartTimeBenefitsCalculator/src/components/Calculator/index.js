import React, { Fragment } from 'react';
import { Form, FormProvider } from '@massds/mayflower-react';
import { toNumber } from './util';
import { QuestionOne, QuestionTwo } from './Inputs';
import OutputOne from './Output1';
import { ScenarioOne, ScenarioTwo, ScenarioThree } from './Output2';
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
              const weeklyBenefits = toNumber(formContext.getValue('weekly-benefits'));
              const weeklyEarnings = toNumber(formContext.getValue('weekly-earnings'));
              const earningsDisregard = toNumber(formContext.getValue('earnings-disregard'));
              const earningsOverDis = weeklyEarnings - earningsDisregard;
              const reducedBenefit = weeklyBenefits - earningsOverDis;

              if (id === 'weekly-benefits') {
                if (formContext.hasId('weekly-benefits')) {
                  if (!Number.isNaN(weeklyBenefits)) {
                    const earningsDisregardCalc = (weeklyBenefits * (1 / 3));
                    formContext.setValue({ id: 'earnings-disregard', value: earningsDisregardCalc });
                  } else {
                    formContext.setValue({ id: 'earnings-disregard', value: 0 });
                  }
                }
              }
              if (formContext.hasId('scenario-one') && formContext.hasId('weekly-benefits') && formContext.hasId('weekly-earnings')) {
                if (!Number.isNaN(weeklyBenefits) && !Number.isNaN(weeklyEarnings)) {
                  if (earningsOverDis <= 0) {
                    formContext.setValue({ id: 'scenario-one', value: { showScenario: true } });
                  } else {
                    formContext.setValue({ id: 'scenario-one', value: { showScenario: false } });
                  }
                } else {
                  formContext.setValue({ id: 'scenario-one', value: { showScenario: false } });
                }
              }
              if (formContext.hasId('scenario-two') && formContext.hasId('earnings-disregard') && formContext.hasId('weekly-earnings')) {
                if (!Number.isNaN(weeklyBenefits) && !Number.isNaN(weeklyEarnings) && !Number.isNaN(earningsDisregard)) {
                  if (earningsOverDis > 0 && reducedBenefit > 0) {
                    formContext.setValue({ id: 'scenario-two', value: { showScenario: true, reducedBenefit, earningsOverDis } });
                  } else {
                    formContext.setValue({ id: 'scenario-two', value: { showScenario: false, reducedBenefit, earningsOverDis } });
                  }
                } else {
                  formContext.setValue({ id: 'scenario-two', value: { showScenario: false, reducedBenefit, earningsOverDis } });
                }
              }
              if (formContext.hasId('scenario-three') && formContext.hasId('earnings-disregard') && formContext.hasId('weekly-earnings')) {
                if (!Number.isNaN(weeklyBenefits) && !Number.isNaN(weeklyEarnings) && !Number.isNaN(earningsDisregard)) {
                  if (reducedBenefit <= 0) {
                    formContext.setValue({ id: 'scenario-three', value: { showScenario: true, reducedBenefit, earningsOverDis } });
                  } else {
                    formContext.setValue({ id: 'scenario-three', value: { showScenario: false, reducedBenefit, earningsOverDis } });
                  }
                } else {
                  formContext.setValue({ id: 'scenario-three', value: { showScenario: false, reducedBenefit, earningsOverDis } });
                }
              }
            };
            return(
              <Fragment>
                <QuestionOne handleChange={handleChange} />
                <OutputOne />
                <QuestionTwo handleChange={handleChange} />
                {
                    // Output2: benefits not impacted
                  }
                <ScenarioOne />
                {
                    // Output2: benefits reduced
                  }
                <ScenarioTwo />
                {
                    // Output2: benefits void
                  }
                <ScenarioThree />
              </Fragment>
            );
          }
        }
    </Form>
  </FormProvider>
);

export default Calculator;
