import React, { Component, Fragment } from 'react';
import moment from 'moment';
import numbro from 'numbro';
import {
  InputCurrency, Button, FormProvider, Form, FormContext, InputCheckBox
} from '@massds/mayflower-react';
import Output from './output';
import { toCurrency, sum } from '../../utils';
import inputProps from '../../data/input.json';
import variables from '../../data/variables.json';
import BenefitsVariables from '../../data/BenefitsVariables.json';
import {
  buildQuartersArray, paidQuarters, calcWeeklyPay, calcWeeklyBenefit, calcEligibility
} from '../formula';


import './index.css';

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      applyAll: false,
      values: {
        quarter1: null,
        quarter2: null,
        quarter3: null,
        quarter4: null
      }
    };
    const format = 'MMM YYYY';
    const quarterCurrent = moment().quarter();
    const quarterDateRange = (quartersAgo) => {
      const quarter = quarterCurrent - quartersAgo;
      let qEnd = moment().quarter(quarter).endOf('quarter');
      let qStart = moment().quarter(quarter).startOf('quarter');
      qEnd = moment(qEnd).format(format);
      qStart = moment(qStart).format(format);
      return{ qEnd, qStart };
    };
    this.q1 = quarterDateRange(1);
    this.q2 = quarterDateRange(2);
    this.q3 = quarterDateRange(3);
    this.q4 = quarterDateRange(4);
    this.inputCurrencyProps = {
      placeholder: 'e.g. $10,000',
      format: {
        mantissa: 2,
        trimMantissa: false,
        thousandSeparated: true
      },
      inline: true,
      min: 0,
      step: 0.01,
      showButtons: false
    };

    this.setValueState = ({ id, value }) => {
      if (Object.prototype.hasOwnProperty.call(this.state.values, id)) {
        this.setState((state) => {
          return {
            values: {
              ...state.values,
              [id]: value
          }};
        });
      }
    };
  }

  render() {
    const {
      maxBenefitDuration, quartersSumThreshhold, weeklyBenefitMax, maxBenefitRatio
    } = variables;

    const {
      applyAll,
      submitted,
      values: {
        quarter1, quarter2, quarter3, quarter4
      }
    } = this.state;

    console.log(this.state.values)

    const { inputLabel, applyAllLabel } = inputProps;

    const quartersArray = buildQuartersArray({ quarter1, quarter2, quarter3, quarter4 });
    const { quartersHaveValue, quartersCount } = paidQuarters(quartersArray);

    const weeklyPay = calcWeeklyPay({ quartersHaveValue, quartersCount });
    const weeklyBenefit = calcWeeklyBenefit(weeklyPay);
    const { qualified } = calcEligibility({ weeklyBenefit, quartersHaveValue });

    return(
      <FormProvider>
        <Form>
          {
          (formContext) => (
            <Fragment>
              <InputCurrency
                {... this.inputCurrencyProps}
                labelText={`${this.q1.qStart} – ${this.q1.qEnd} ${inputLabel}`}
                id="quarter1"
                name="quarter1"
                onBlur={(val, { id }) => {
                  // convert val to currency then set it to context
                  const value = toCurrency(val);
                  this.setValueState({ id, value });
                  if (applyAll) {
                    this.setValueState({ id: 'quarter2', value });
                    this.setValueState({ id: 'quarter3', value });
                    this.setValueState({ id: 'quarter4', value });
                    formContext.setValue({ id: 'quarter2', value });
                    formContext.setValue({ id: 'quarter3', value });
                    formContext.setValue({ id: 'quarter4', value });
                  }
                }}
              />
              <InputCheckBox
                id="apply-all"
                label={applyAllLabel}
                icon={{ name: '', ariaHidden: true }}
                defaultValue={false}
                onChange={(e, value) => {
                  this.setState({
                    applyAll: value
                  });
                  this.setValueState({ id: 'quarter2', value: quarter1 });
                  this.setValueState({ id: 'quarter3', value: quarter1 });
                  this.setValueState({ id: 'quarter4', value: quarter1 });
                }}
              />
              <InputCurrency
                {... this.inputCurrencyProps}
                labelText={`${this.q2.qStart} – ${this.q2.qEnd} ${inputLabel}`}
                id="quarter2"
                name="quarter2"
                disabled={applyAll}
                onBlur={(val, { id }) => {
                  // convert val to currency then set it to context
                  const value = toCurrency(val);
                  this.setValueState({ id, value });
                }}
              />
              <InputCurrency
                {... this.inputCurrencyProps}
                labelText={`${this.q3.qStart} – ${this.q3.qEnd} ${inputLabel}`}
                id="quarter3"
                name="quarter3"
                disabled={applyAll}
                onBlur={(val, { id }) => {
                  // convert val to currency then set it to context
                  const value = toCurrency(val);
                  this.setValueState({ id, value });
                }}
              />
              <InputCurrency
                {... this.inputCurrencyProps}
                labelText={`${this.q4.qStart} – ${this.q4.qEnd} ${inputLabel}`}
                id="quarter4"
                name="quarter4"
                disabled={applyAll}
                onBlur={(val, { id }) => {
                  // convert val to currency then set it to context
                  const value = toCurrency(val);
                  this.setValueState({ id, value });
                }}
              />
              <Button
                type="submit"
                text={inputProps.buttonText}
                onClick={() => {
                  this.setState({ submitted: true })
                  this.props.onSubmit({ qualified, weeklyBenefit })
                }}
              />
            </Fragment>
          )
        }
        </Form>
        <FormContext.Consumer>
          {
          (formContext) => {
            const values = this.state.values;
            return(
              submitted && (
                <Output {...values} />
              )
            );
          }
        }
        </FormContext.Consumer>
      </FormProvider>
    );
  }
}

export default Calculator;
