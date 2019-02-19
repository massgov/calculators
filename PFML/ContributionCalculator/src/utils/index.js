import React from 'react';
import numbro from 'numbro';
import { HelpTip } from '@massds/mayflower-react';

export const toCurrency = (number) => {
  const currency = numbro(number).formatCurrency({ thousandSeparated: true, mantissa: 2, spaceSeparated: false });
  return currency;
};

export const toPercentage = (number, decimal) => {
  const mantissa = decimal || 0;
  const percent = numbro(number).format({ output: 'percent', mantissa, spaceSeparated: false });
  return percent;
};

export const getHelpTip = ({ text, triggerText, helpText, id }, theme, key) => {
  return(
    <HelpTip
      key={key}
      text={text}
      triggerText={triggerText}
      helpText={helpText}
      id={key}
      hasMarkup
      bypassMobileStyle={false}
      theme={theme || 'c-primary'}
    />
  );
};
