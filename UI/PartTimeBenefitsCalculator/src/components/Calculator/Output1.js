import React, { Fragment } from 'react';
import { toCurrency, displayCurrency, toNumber } from './util';
import {
  Form, FormProvider, InputCurrency, CalloutAlert, HelpTip, Input, InputContext, Paragraph
} from '@massds/mayflower-react';

const OutputOne = (props) => {
  return(
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
                    <div className="ma__help-text">Earnings disregard is 1/3 of your weekly benefit amount.</div>
                  </HelpTip>
                </CalloutAlert>
              );
            }
            return null;
          }}
        </InputContext.Consumer>
      </Input>
  );
};

export default OutputOne;