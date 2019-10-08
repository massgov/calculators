import React from 'react';
import PropTypes from 'prop-types';
import { InputCurrency } from '@massds/mayflower-react';
import variables from '../../data/variables.json';

const inputCurrencyProps = {
  inline: true,
  required: true,
  placeholder: 'e.g. $500',
  defaultValue: null,
  step: 1,
  min: 0,
  showButtons: false
};

const { weeklyBenefitMax } = variables;

export const QuestionOne = (props) => {
  const { handleChange } = props;
  return(
    <InputCurrency
      labelText="What is your weekly benefit amount?"
      id="weekly-benefits"
      name="weekly-benefits"
      max={weeklyBenefitMax}
      onChange={handleChange}
      format={{
        mantissa: 0,
        trimMantissa: false,
        thousandSeparated: true
      }}
      {...inputCurrencyProps}
    />
  );
};

export const QuestionTwo = (props) => {
  const { handleChange } = props;
  return(
    <InputCurrency
      labelText="How much do you earn weekly working part-time (before taxes)?"
      inline
      required
      id="weekly-earnings"
      name="weekly-earnings"
      format={{
        mantissa: 2,
        trimMantissa: false,
        thousandSeparated: true
      }}
      onChange={handleChange}
      {...inputCurrencyProps}
    />
  );
};

QuestionOne.propTypes = {
  handleChange: PropTypes.func
};

QuestionTwo.propTypes = {
  handleChange: PropTypes.func
};
