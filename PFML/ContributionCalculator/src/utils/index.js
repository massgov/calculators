import React from 'react';
import numbro from 'numbro';
import PropTypes from 'prop-types';
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

export const getHelpTip = ({
  text, triggerText, helpText
}, theme, key) => (
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

getHelpTip.propTypes = {
  text: PropTypes.string,
  triggerText: PropTypes.arrayOf(PropTypes.string),
  helpText: PropTypes.arrayOf(PropTypes.string)
};
