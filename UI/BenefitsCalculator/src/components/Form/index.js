import React, { Component, Fragment } from 'react';
import moment from 'moment';
import {
  InputCurrency, Button, FormProvider, Form, FormContext, InputCheckBox
} from '@massds/mayflower-react';
import Output from './output';

import './index.css';


class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      applyAll: false
    };
    const format = 'MMM YYYY';
    const quarter = moment().quarter() + 1;
    const quarterDateRange = (quartersAgo, startOffset) => {
      let qEnd = moment().subtract({ months: quarter + (quartersAgo - 1) * 3 }).endOf('month');
      let qStart = qEnd.clone().subtract({ months: startOffset }).startOf('month');
      qEnd = moment(qEnd).format(format);
      qStart = moment(qStart).format(format);
      return{ qEnd, qStart };
    };
    this.q1 = quarterDateRange(1, 3);
    this.q2 = quarterDateRange(2, 2);
    this.q3 = quarterDateRange(3, 2);
    this.q4 = quarterDateRange(4, 2);
  }

  render() {
    const { applyAll, submitted } = this.state;
    const inputCurrencyProps = {
      placeholder: 'e.g. $10,000',
      format: {
        mantissa: 2,
        trimMantissa: false,
        thousandSeparated: true
      },
      required: true,
      inline: true,
      min: 0,
      step: 1
    };
    return(
      <FormProvider>
        <Form>
          {
          (formContext) => (
            <Fragment>
              <InputCurrency
                {... inputCurrencyProps}
                labelText={`${this.q1.qStart} – ${this.q1.qEnd} total wages:`}
                id="quarter1"
                name="quarter1"
                onChange={(value, id) => {
                  formContext.setValue({ id, value });
                  if (applyAll) {
                    formContext.setValue({ id: 'quarter2', value });
                    formContext.setValue({ id: 'quarter3', value });
                    formContext.setValue({ id: 'quarter4', value });
                  }
                }}
              />
              <InputCheckBox
                id="apply-all"
                label="Apply this quarter's wages to the all quarters."
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
                errorMsg="You are required to check this box."
              />
              <InputCurrency
                {... inputCurrencyProps}
                labelText={`${this.q2.qStart} – ${this.q2.qEnd} total wages:`}
                id="quarter2"
                name="quarter2"
                disabled={applyAll}
                onChange={(value, id) => {
                  formContext.setValue({ id, value });
                }}
              />
              <InputCurrency
                {... inputCurrencyProps}
                labelText={`${this.q3.qStart} – ${this.q3.qEnd} total wages:`}
                id="quarter3"
                name="quarter3"
                disabled={applyAll}
                onChange={(value, id) => {
                  formContext.setValue({ id, value });
                }}
              />
              <InputCurrency
                {... inputCurrencyProps}
                labelText={`${this.q4.qStart} – ${this.q4.qEnd} total wages:`}
                id="quarter4"
                name="quarter4"
                disabled={applyAll}
                onChange={(value, id) => {
                  formContext.setValue({ id, value });
                }}
              />
              <Button
                text="See Benefits"
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
