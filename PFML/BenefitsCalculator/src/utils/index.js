import React from 'react';
import numbro from 'numbro';
import { HelpTip } from '@massds/mayflower-react';

// eslint-disable-next-line import/prefer-default-export
export const getHelpTip = (question, theme, key) => (
  <HelpTip
    text={question.content}
    triggerText={question.triggerText}
    id={`help-tip-${question.triggerText}`}
    labelID={`help-tip-${question.triggerText}-label`}
    theme={theme || 'c-primary'}
    helpText={question.helpText}
    key={key}
    hasMarkup
    bypassMobileStyle={process.env.REACT_APP_IFRAME !== 'false'}
  />
);

export const getIframeProps = () => {
  const helptipIframeProp = {};
  if (process.env.REACT_APP_IFRAME === 'true') {
    helptipIframeProp.bypassMobileStyle = true;
  }
  return helptipIframeProp;
};


export const toCurrency = (number) => {
  const currency = number && numbro(number).formatCurrency({ thousandSeparated: true, mantissa: 2, spaceSeparated: false });
  return currency;
};

export const toPercentage = (number, decimal) => {
  const mantissa = decimal || 0;
  const percent = number && numbro(number).format({ output: 'percent', mantissa, spaceSeparated: false });
  return percent;
};

export const sum = (a, b) => a + b;

export const toBoolean = (string) => {
  if (typeof string === 'string') {
    return(string === 'true');
  }
  return string;
};
