import React from 'react';
import PropTypes from 'prop-types';
import { InputCurrency } from '@massds/mayflower-react';

const inputCurrencyProps = {
  inline: true,
  required: true,
  placeholder: 'e.g. $500',
  defaultValue: null,
  step: 1,
  min: 0,
  showButtons: false,
  format: {
    mantissa: 0,
    trimMantissa: false,
    thousandSeparated: true
  }
};

export const QuestionOne = (props) => {
  const { handleBlur } = props;
  return(
    <InputCurrency
      labelText="What is your weekly benefit amount?"
      id="weekly-benefits"
      name="weekly-benefits"
      max={795}
      onBlur={handleBlur}
      {...inputCurrencyProps}
    />
  );
};

export const QuestionTwo = (props) => {
  const { handleBlur } = props;
  return(
    <InputCurrency
      labelText="How much do you earn weekly working part-time (before taxes)?"
      inline
      required
      id="weekly-earnings"
      name="weekly-earnings"
      onBlur={handleBlur}
      {...inputCurrencyProps}
    />
  );
};

QuestionOne.propTypes = {
  handleBlur: PropTypes.func
};

QuestionTwo.propTypes = {
  handleBlur: PropTypes.func
};
