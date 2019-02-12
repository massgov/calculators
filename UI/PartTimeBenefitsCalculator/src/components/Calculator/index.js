import React, { Fragment } from 'react';
import { Form, FormProvider, InputCurrency, CalloutAlert, HelpTip, Input, InputContext } from '@massds/mayflower-react';
import numbro from 'numbro';

const toCurrency = (val) => {
  if (typeof val === 'string' && val.length === 0) {
    return NaN;
  }
  return numbro(val).formatCurrency({ mantissa: 2 });
};
const toNumber = (val) => {
  if (typeof val === 'string' && val.length === 0) {
    return NaN;
  }
  return Number(numbro(val).format({
    trimMantissa: true,
    mantissa: 2
  }));
};

const Calculator = () => {
  // Anything within the form component is only rendered a single time.
  // To make content update when formContext updates, you can make new components
  // with Input and InputContext. When the new Input's value is updated
  // with formContext.setValue, the component will re-render without re-rendering the entire form.
  // See the Scenario components and QuestionOne for examples.
  return(
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
                    formContext.setValue({ id: 'scenario-one', value: {showScenario: false } });
                  }
                } else {
                  formContext.setValue({ id: 'scenario-one', value: {showScenario: false } });
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
                  }
                  else {
                    formContext.setValue({ id: 'scenario-two', value: { showScenario: false, reducedBenefit, earningsOverDis } });
                  }
                } else {
                  formContext.setValue({ id: 'scenario-two', value: { showScenario: false, reducedBenefit, earningsOverDis } });
                }
              }
            };
            return(
              <Fragment>
                <div>
                  <QuestionOne handleChange={handleChange} />
                </div>
                <div>
                  <QuestionTwo handleChange={handleChange} />
                </div>
                <div>
                  <ScenarioOne formContext={formContext} />
                </div>
                <div>
                  <ScenarioTwo formContext={formContext} />
                </div>
              </Fragment>
            );
          }
        }
      </Form>
    </FormProvider>
  );
};
const QuestionOne = (props) => {
  const { handleChange } = props;
  return(
    <Fragment>
      <InputCurrency
        labelText="How much do you receive weekly in UI benefits?"
        inline={true}
        required={true}
        id="weekly-benefits"
        name="weekly-benefits"
        placeholder="e.g. $500.00"
        defaultValue={'0'}
        min={0}
        onChange={handleChange}
      />
      <Input id="earnings-disregard" defaultValue={0}>
        <InputContext.Consumer>
          { (inputContext) => {
            // This value is stored in formContext as well under id "earnings-disregard".
            // This input re-renders when earnings-disregard is updated with a new value.
            if (inputContext.getValue() > 0) {
              return (
                <CalloutAlert theme="c-primary" icon={null}>
                  <HelpTip
                    theme="c-white"
                    triggerText={toCurrency(inputContext.getValue())}
                    textAfter={`Any earnings greater than ${toCurrency(inputContext.getValue())} will be deducted dollar-for-dollar from your weekly benefit payment.`}
                    id="help-tip-weekly-benefits"
                    labelID="help-tip-weekly-benefits-label"
                  >
                    Earnings disregard is 1/3 of your weekly benefit amount.
                  </HelpTip>
                </CalloutAlert>
              );
            }
            return null;
          }}
        </InputContext.Consumer>
      </Input>
    </Fragment>
  );
};
const QuestionTwo = (props) => {
  const { handleChange } = props;
  return (
    <InputCurrency
      labelText="How much you earn weekly working part-time (before taxes)?"
      inline={true}
      required={true}
      id="weekly-earnings"
      name="weekly-earnings"
      placeholder="e.g. $500.00"
      defaultValue={'0'}
      min={0}
      onChange={handleChange}
    />
  );
};
const ScenarioOne = (props) => {
  // Do not make a copy of formContext with object destructuring.
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
            && !Number.isNaN(weeklyBenefits)
            && !Number.isNaN(weeklyEarnings)) {
            return (
              <CalloutAlert theme="c-primary" icon={null}>
                <HelpTip
                  theme="c-white"
                  triggerText="not affected"
                  textBefore="Your weekly benefits are "
                  textAfter="."
                  id="help-tip-scenario-one"
                  labelID="help-tip-scenario-one-label"
                >As you make less than a third of your weekly benefits through your part time employment, your weekly benefit stays the same.</HelpTip>
                <p>{`You take home ${toCurrency(weeklyBenefits)} from UI benefits and ${toCurrency(weeklyEarnings)} from your income, a total amount of ${toCurrency(toNumber(weeklyBenefits)+ toNumber(weeklyEarnings))} weekly.`}</p>
              </CalloutAlert>
            );
          }
          return null;
        }}
      </InputContext.Consumer>
    </Input>
  );
};
const ScenarioTwo = (props) => {
  // Do not make a copy of formContext with object destructuring.
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
            return (
              <CalloutAlert theme="c-primary" icon={null}>
                <HelpTip
                  theme="c-white"
                  triggerText={toCurrency(reducedBenefit)}
                  textBefore="Your reduced weekly benefit amount is "
                  textAfter="."
                  id="help-tip-scenario-two"
                  labelID="help-tip-scenario-two-label"
                >{`Earnings over earnings disregard: ${toCurrency(earningsOverDis)} = ${toCurrency(weeklyBenefits)} - ${toCurrency(earningsDisregard)}`}</HelpTip>
                <p>{`You will take home ${toCurrency(reducedBenefit)} from UI benefits and ${toCurrency(weeklyBenefits)} from your income, a total amount of ${toCurrency(toNumber(reducedBenefit) + toNumber(weeklyBenefits))} weekly. `}</p>
              </CalloutAlert>
            );
          }
          return null;
        }}
      </InputContext.Consumer>
    </Input>
  );
};

export default Calculator;
