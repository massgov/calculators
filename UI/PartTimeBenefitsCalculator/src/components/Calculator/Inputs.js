import React, { Fragment } from 'react';
import { toCurrency, displayCurrency, toNumber } from './util';
import {
  Form, FormProvider, InputCurrency, CalloutAlert, HelpTip, Input, InputContext, Paragraph
} from '@massds/mayflower-react';

export const QuestionOne = (props) => {
  const { handleChange } = props;
  return(
    <Fragment>
      <InputCurrency
        labelText="How much do you receive weekly in UI benefits?"
        inline
        required
        id="weekly-benefits"
        name="weekly-benefits"
        placeholder="e.g. $500.00"
        defaultValue="0"
        step={1}
        min={0}
        onChange={handleChange}
      />
    </Fragment>
  );
};

export const QuestionTwo = (props) => {
  const { handleChange } = props;
  return(
    <InputCurrency
      labelText="How much you earn weekly working part-time (before taxes)?"
      inline
      required
      id="weekly-earnings"
      name="weekly-earnings"
      placeholder="e.g. $500.00"
      defaultValue="0"
      step={1}
      min={0}
      onChange={handleChange}
    />
  );
};