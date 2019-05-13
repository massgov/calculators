import React from 'react';
import {
  CalloutAlert, HelpTip, Input, InputContext
} from '@massds/mayflower-react';
import { toCurrency } from './util';

const helptipIframeProp = {};
if (process.env.REACT_APP_IFRAME === 'true') {
  helptipIframeProp.bypassMobileStyle = true;
}

const OutputOne = () => (
  <Input id="earnings-disregard" defaultValue={0}>
    <InputContext.Consumer>
      { (inputContext) => {
        const maxEarningsDisregard = Math.round(795 / 3);
        const earningsDisregard = inputContext.getValue() > maxEarningsDisregard ? maxEarningsDisregard : inputContext.getValue();
        const maxEarningsDisregardMessage = inputContext.getValue() > maxEarningsDisregard ? `Your weekly benefits is capped at ${toCurrency(795)}. ` : '';
        // This value is stored in formContext as well under id "earnings-disregard".
        // This input re-renders when earnings-disregard is updated with a new value.
        if (inputContext.getValue() > 0) {
          return(
            <CalloutAlert theme="c-primary" icon={null}>
              <HelpTip
                theme="c-white"
                triggerText={[toCurrency(earningsDisregard)]}
                text={`${maxEarningsDisregardMessage}Any earnings greater than ${toCurrency(earningsDisregard)} will be deducted dollar-for-dollar from your weekly benefit payment (this is your earnings exclusion).`}
                id="help-tip-weekly-benefits"
                labelID="help-tip-weekly-benefits-label"
                {...helptipIframeProp}
              >
                <div className="ma__help-text">Earnings exclusion is 1/3 of your weekly benefit amount.</div>
              </HelpTip>
            </CalloutAlert>
          );
        }
        return null;
      }}
    </InputContext.Consumer>
  </Input>
);

export default OutputOne;
