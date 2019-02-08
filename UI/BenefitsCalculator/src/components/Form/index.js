import React, { Component, Fragment } from 'react';
import moment from 'moment';
import {
  InputCurrency, Button, FormProvider, Form
} from '@massds/mayflower-react';
import Output from './output';

import './index.css';


class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        quarter1: '',
        quarter2: '',
        quarter3: '',
        quarter4: ''
      },
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
    // eslint-disable-next-line react/destructuring-assignment
    const stateValue = this.state.value;
    const {
      quarter1, quarter2, quarter3, quarter4
    } = stateValue;
    const { applyAll, submitted } = this.state;
    const inputCurrencyProps = {
      placeholder: 'e.g. $100,000',
      format: {
        mantissa: 2,
        trimMantissa: false,
        thousandSeparated: true
      },
      required: true,
      inline: true,
      min: 0,
      step: 0.01
    };
    return(
      <FormProvider>
        <Form>
          {
          (formContext) => {
            console.log(formContext);
            return(
              <Fragment>
                <InputCurrency
                  {... inputCurrencyProps}
                  labelText={`${this.q1.qStart} – ${this.q1.qEnd} earnings:`}
                  id="quarter1"
                  name="quarter1"
                // defaultValue={quarter1}
                  onChange={(value, id) => {
                    formContext.setValue({ id, value });
                    if (applyAll) {
                      formContext.setValue({ id: 'quarter2', value });
                      formContext.setValue({ id: 'quarter3', value });
                      formContext.setValue({ id: 'quarter4', value });
                    }
                  }}
                />
                <div className="input_apply-all">
                  <input
                    type="checkbox"
                    id="apply-all"
                    onChange={(e) => {
                      this.setState({
                        applyAll: e.target.checked,
                        value: {
                          quarter1,
                          quarter2: quarter1,
                          quarter3: quarter1,
                          quarter4: quarter1
                        }
                      });
                    }}
                  />
                  <label htmlFor="apply-all">Apply this quarter's earnings to the all quarters.</label>
                </div>
                <InputCurrency
                  {... inputCurrencyProps}
                  labelText={`${this.q2.qStart} – ${this.q2.qEnd} earnings:`}
                  id="quarter2"
                  name="quarter2"
                // defaultValue={quarter2}
                  disabled={applyAll}
                  onChange={(e, value) => {
                    const newStateValue = { ...stateValue };
                    newStateValue.quarter2 = value;
                    this.setState({ value: newStateValue });
                  }}
                />
                <InputCurrency
                  {... inputCurrencyProps}
                  labelText={`${this.q3.qStart} – ${this.q3.qEnd} earnings:`}
                  id="quarter3"
                  name="quarter3"
                // defaultValue={quarter3}
                  disabled={applyAll}
                  onChange={(e, value) => {
                    const newStateValue = { ...stateValue };
                    newStateValue.quarter3 = value;
                    this.setState({ value: newStateValue });
                  }}
                />
                <InputCurrency
                  {... inputCurrencyProps}
                  labelText={`${this.q4.qStart} – ${this.q4.qEnd} earnings:`}
                  id="quarter4"
                  name="quarter4"
                // defaultValue={quarter4}
                  disabled={applyAll}
                  onChange={(e, value) => {
                    const newStateValue = { ...stateValue };
                    newStateValue.quarter4 = value;
                    this.setState({ value: newStateValue });
                  }}
                />
                <Button
                  text="See Benefits"
                  disabled={submitted}
                  onClick={() => this.setState({ submitted: true })}
                />
              </Fragment>
            );
          }
        }
        </Form>
        {
          submitted && (
            <Output {...stateValue} />
          )
        }
      </FormProvider>
    );
  }
}

export default Calculator;
