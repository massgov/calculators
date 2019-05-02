import React, { Component, Fragment } from 'react';
import moment from 'moment';
import {
  InputCurrency, Button, FormProvider, Form, FormContext, InputCheckBox
} from '@massds/mayflower-react';
import Output from './output';
import inputProps from '../../data/input.json';

import './index.css';


class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      applyAll: false
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
  }

  render() {
    const { applyAll, submitted } = this.state;
    const { inputLabel, applyAllLabel } = inputProps;
    const inputCurrencyProps = {
      placeholder: 'e.g. $10,000',
      format: {
        mantissa: 0,
        trimMantissa: false,
        thousandSeparated: true
      },
      required: true,
      inline: true,
      min: 0,
      step: 10,
      showButtons: false
    };
    return(
      <FormProvider>
        <Form>
          {
          (formContext) => (
            <Fragment>
              <InputCurrency
                {... inputCurrencyProps}
                labelText={`${this.q1.qStart} – ${this.q1.qEnd} ${inputLabel}`}
                id="quarter1"
                name="quarter1"
                onChange={(value, id) => {
                  if (!Number.isNaN(value)) {
                    formContext.setValue({ id, value });
                    if (applyAll) {
                      formContext.setValue({ id: 'quarter2', value });
                      formContext.setValue({ id: 'quarter3', value });
                      formContext.setValue({ id: 'quarter4', value });
                    }
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
                  const { quarter1 } = formContext.getValues();
                  formContext.setValue({ id: 'quarter2', value: quarter1 });
                  formContext.setValue({ id: 'quarter3', value: quarter1 });
                  formContext.setValue({ id: 'quarter4', value: quarter1 });
                }}
              />
              <InputCurrency
                {... inputCurrencyProps}
                labelText={`${this.q2.qStart} – ${this.q2.qEnd} ${inputLabel}`}
                id="quarter2"
                name="quarter2"
                disabled={applyAll}
                onChange={(value, id) => {
                  formContext.setValue({ id, value });
                }}
              />
              <InputCurrency
                {... inputCurrencyProps}
                labelText={`${this.q3.qStart} – ${this.q3.qEnd} ${inputLabel}`}
                id="quarter3"
                name="quarter3"
                disabled={applyAll}
                onChange={(value, id) => {
                  formContext.setValue({ id, value });
                }}
              />
              <InputCurrency
                {... inputCurrencyProps}
                labelText={`${this.q4.qStart} – ${this.q4.qEnd} ${inputLabel}`}
                id="quarter4"
                name="quarter4"
                disabled={applyAll}
                onChange={(value, id) => {
                  formContext.setValue({ id, value });
                }}
              />
              <Button
                type="submit"
                text={inputProps.buttonText}
                onClick={() => this.setState({ submitted: true })}
              />
            </Fragment>
          )
        }
        </Form>
        <FormContext.Consumer>
          {
          (formContext) => {
            const values = formContext.getValues();
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
