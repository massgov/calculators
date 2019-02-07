import React, { Component } from 'react';
import { CalloutAlert, HelpTip } from '@massds/mayflower-react';
import { toCurrency } from '../../util';

const Output = () => {
  return(
    <CalloutAlert theme="c-primary" icon={null}>
      <HelpTip
        theme="c-white"
        textBefore="You would be eligible to receive "
        triggerText={`<span>${toCurrency(30)} for 30 weeks</span>`}
        textAfter=", based on your maximum benefit credit."
        id="help-tip-benefits"
        labelID="help-tip-benefits-label"
      >
      </HelpTip>
    </CalloutAlert>
  )
}

export default Output;
