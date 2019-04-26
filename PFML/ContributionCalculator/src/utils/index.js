import React from 'react';
import numbro from 'numbro';
import PropTypes from 'prop-types';
import { HelpTip } from '@massds/mayflower-react';

export const toCurrency = (number) => {
  return numbro(number).formatCurrency({ thousandSeparated: true, mantissa: 2, spaceSeparated: false });
};

export const toPercentage = (number, decimal) => {
  const mantissa = decimal || 0;
  return numbro(number).format({ output: 'percent', mantissa, spaceSeparated: false });
};

export const getHelpTip = ({
  text, triggerText, helpText
}, theme, key) => (
  <HelpTip
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
