import React, { Fragment } from 'react';
import { toCurrency, displayCurrency, toNumber } from './util';
import {
  Form, FormProvider, InputCurrency, CalloutAlert, HelpTip, Input, InputContext, Paragraph
} from '@massds/mayflower-react';

export const QuestionOne = (props) => {
  const { handleChange } = props;
  return(
    <Fragment>
      <InputCurrency
        labelText="How much do you receive weekly in UI benefits?"
        inline
        required
        id="weekly-benefits"
        name="weekly-benefits"
        placeholder="e.g. $500.00"
        defaultValue="0"
        min={0}
        onChange={handleChange}
      />
      <Input id="earnings-disregard" defaultValue={0}>
        <InputContext.Consumer>
          { (inputContext) => {
            // This value is stored in formContext as well under id "earnings-disregard".
            // This input re-renders when earnings-disregard is updated with a new value.
            if (inputContext.getValue() > 0) {
              return(
                <CalloutAlert theme="c-primary" icon={null}>
                  <HelpTip
                    theme="c-white"
                    triggerText={[toCurrency(inputContext.getValue())]}
                    text={`Any earnings greater than ${toCurrency(inputContext.getValue())} will be deducted dollar-for-dollar from your weekly benefit payment.`}
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

export const QuestionTwo = (props) => {
  const { handleChange } = props;
  return(
    <InputCurrency
      labelText="How much you earn weekly working part-time (before taxes)?"
      inline
      required
      id="weekly-earnings"
      name="weekly-earnings"
      placeholder="e.g. $500.00"
      defaultValue="0"
      min={0}
      onChange={handleChange}
    />
  );
};