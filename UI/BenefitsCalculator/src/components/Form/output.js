import React, { Component } from 'react';
import { CalloutAlert, HelpTip } from '@massds/mayflower-react';
import { toCurrency } from '../../util';

const Output = (props) => {
  const { quarter1, quarter2, quarter3, quarter4 } = props;
  const quartersHaveValue = [quarter1, quarter2, quarter3, quarter4].filter((q) => typeof q === 'number' && q > 0);
  let topQuarters;
  if (quartersHaveValue.length > 2) {
    topQuarters = quartersHaveValue.sort((q1, q2) => q1 - q2).slice(0,2);
  } else if (quartersHaveValue.length > 0) {
    topQuarters = quartersHaveValue.sort((q1, q2) => q1 - q2).slice(0,1);
  }
  //console.log(quartersHaveValue)
  console.log(topQuarters)
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
