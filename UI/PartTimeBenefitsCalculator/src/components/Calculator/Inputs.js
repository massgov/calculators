import React from 'react';
import PropTypes from 'prop-types';
import { InputCurrency } from '@massds/mayflower-react';

export const QuestionOne = (props) => {
  const { handleChange } = props;
  return(
    <InputCurrency
      labelText="What is your weekly benefit amount?"
      inline
      required
      id="weekly-benefits"
      name="weekly-benefits"
      placeholder="e.g. $500.00"
      defaultValue={null}
      step={1}
      min={0}
      max={795}
      onChange={handleChange}
      onBlur={(val) => handleChange(val, 'weekly-benefits')}
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
      placeholder="e.g. $500.00"
      defaultValue={null}
      step={1}
      min={0}
      onChange={handleChange}
    />
  );
};

QuestionOne.propTypes = {
  handleChange: PropTypes.func
};

QuestionTwo.propTypes = {
  handleChange: PropTypes.func
};
