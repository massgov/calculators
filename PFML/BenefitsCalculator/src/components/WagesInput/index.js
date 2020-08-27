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
    console.log(quarter1, quarter2, quarter3, quarter4)

    const { inputLabel, applyAllLabel } = inputProps;

    let quartersArray = [quarter1, quarter2, quarter3, quarter4];
    quartersArray = quartersArray.map((q) => ((typeof q === 'string') ? numbro.unformat(q) : q));

    const quartersHaveValue = quartersArray.filter((q) => typeof q === 'number' && q > 0);
    const quartersCount = quartersHaveValue.length;

    // weekly benefit
    let topQuarters;
    let weeksInTopQuarters = 26;
    if (quartersCount > 2) {
      topQuarters = quartersHaveValue.sort((q1, q2) => q2 - q1).slice(0, 2);
    } else if (quartersCount > 0) {
      topQuarters = quartersHaveValue.sort((q1, q2) => q2 - q1).slice(0, 1);
      weeksInTopQuarters = 13;
    }
    const topQuartersSum = topQuarters && topQuarters.length > 0 && topQuarters.reduce(sum);
    // average weekly pay is rounded up to the nearest dollar
    const avgWeeklyPay = Math.ceil(topQuartersSum / weeksInTopQuarters);
    // weekly benefit is rounded down to the nearest dollar amount
    const weeklyBenefit = Math.floor(1 / 2 * avgWeeklyPay);
    // WeeklyBenefitFinal is making sure that the weeklyBenefit never exceeds the maximum
    const weeklyBenefitFinal = Math.min(weeklyBenefit, weeklyBenefitMax);

    // qualifications
    const quartersSum = quartersHaveValue.length > 0 && quartersHaveValue.reduce(sum);
    // qualification 1: total wages is no less than the threshhold
    const qualification1 = !(quartersSum < quartersSumThreshhold);
    // qualification 2: total wages is no less than 30 times the weeklyBenefitFinal
    const qualification2 = !(quartersSum < (30 * weeklyBenefitFinal));
    const qualified = qualification1 && qualification2;
    console.log(quarter1)


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

                  this.setValueState({ id: 'quarter2', value })
                  if (applyAll) {
                    this.setValueState({ id: 'quarter2', value });
                    this.setValueState({ id: 'quarter3', value });
                    this.setValueState({ id: 'quarter4', value });
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
                  const { quarter1 } = this.state.values;
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
                  this.props.onSubmit(this.state.submitted)
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
