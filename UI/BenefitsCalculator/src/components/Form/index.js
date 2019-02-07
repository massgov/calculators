import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { InputCurrency, Button } from '@massds/mayflower-react';
import Output from './output';

import './index.css';


class Form extends Component {
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
    const quarter1 = moment().quarter() + 1;
    this.q1End = moment().subtract({ months: quarter1 }).endOf('month');
    this.q1Start = this.q1End.clone().subtract({ months: 3 }).startOf('month');
    this.q1End = moment(this.q1End).format(format);
    this.q1Start = moment(this.q1Start).format(format);
    const quarter2 = moment().quarter() + 4;
    this.q2End = moment().subtract({ months: quarter2 }).endOf('month');
    this.q2Start = this.q2End.clone().subtract({ months: 3 }).startOf('month');
    this.q2End = moment(this.q2End).format(format);
    this.q2Start = moment(this.q2Start).format(format);
    const quarter3 = moment().quarter() + 7;
    this.q3End = moment().subtract({ months: quarter3 }).endOf('month');
    this.q3Start = this.q3End.clone().subtract({ months: 3 }).startOf('month');
    this.q3End = moment(this.q3End).format(format);
    this.q3Start = moment(this.q3Start).format(format);
    const quarter4 = moment().quarter() + 10;
    this.q4End = moment().subtract({ months: quarter4 }).endOf('month');
    this.q4Start = this.q4End.clone().subtract({ months: 3 }).startOf('month');
    this.q4End = moment(this.q4End).format(format);
    this.q4Start = moment(this.q4Start).format(format);
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
      <Fragment>
        <form className="ma__form-page" action="#">
          <InputCurrency
            {... inputCurrencyProps}
            labelText={`${this.q1Start} – ${this.q1End} earnings:`}
            id="quarter1"
            name="quarter1"
            defaultValue={quarter1}
            onChange={(e, value) => {
              const newStateValue = { ...stateValue };
              if (applyAll) {
                newStateValue.quarter1 = value;
                newStateValue.quarter2 = value;
                newStateValue.quarter3 = value;
                newStateValue.quarter4 = value;
              }
              newStateValue.quarter1 = value;
              this.setState({ value: newStateValue });
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
            labelText={`${this.q2Start} – ${this.q2End} earnings:`}
            id="quarter2"
            name="quarter2"
            defaultValue={quarter2}
            disabled={applyAll}
            onChange={(e, value) => {
              const newStateValue = { ...stateValue };
              newStateValue.quarter2 = value;
              this.setState({ value: newStateValue });
            }}
          />
          <InputCurrency
            {... inputCurrencyProps}
            labelText={`${this.q3Start} – ${this.q3End} earnings:`}
            id="quarter3"
            name="quarter3"
            defaultValue={quarter3}
            disabled={applyAll}
            onChange={(e, value) => {
              const newStateValue = { ...stateValue };
              newStateValue.quarter3 = value;
              this.setState({ value: newStateValue });
            }}
          />
          <InputCurrency
            {... inputCurrencyProps}
            labelText={`${this.q4Start} – ${this.q4End} earnings:`}
            id="quarter4"
            name="quarter4"
            defaultValue={quarter4}
            disabled={applyAll}
            onChange={(e, value) => {
              const newStateValue = { ...stateValue };
              newStateValue.quarter4 = value;
              this.setState({ value: newStateValue });
            }}
          />
          <Button
            text="See Benefits"
            onClick={() => this.setState({ submitted: true })}
          />
        </form>
        {
          submitted && (
            <Output {...stateValue} />
          )
        }
      </Fragment>
    );
  }
}

export default Form;
