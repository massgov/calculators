import React, { Fragment } from 'react';
import numbro from 'numbro';
import { HelpTip, Paragraph } from '@massds/mayflower-react';

export const toCurrency = (number) => {
  const currency = numbro(number).formatCurrency({ thousandSeparated: true, mantissa: 2, spaceSeparated: false });
  return currency;
};

export const toPercentage = (number, decimal) => {
  const mantissa = decimal || 0;
  const percent = numbro(number).format({ output: 'percent', mantissa, spaceSeparated: false });
  return percent;
};

export const getHelpTip = ( question ) => {
    const text = (question.content).split(question.triggerText);
    return(
      <HelpTip
        textBefore={text[0]}
        triggerText={question.triggerText}
        textAfter={text[1]}
        id={`help-tip-${question.triggerText}`}
        labelID={`help-tip-${question.triggerText}-label`}
      ><Paragraph text={question.helpText} /></HelpTip>
    )
  }