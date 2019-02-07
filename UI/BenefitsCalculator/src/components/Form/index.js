import React, { Component, Fragment } from 'react';
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
      }
    };
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    const stateValue = this.state.value;
    const {
      quarter1, quarter2, quarter3, quarter4
    } = stateValue;
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
          labelText="October 2018 – December 2018 earnings:"
          id="quarter1"
          name="quarter1"
          defaultValue={quarter1}
          onChange={(e, value) => {
            const newStateValue = { ...stateValue };
            newStateValue.quarter1 = value;
            this.setState({ value: newStateValue });
          }}
        />
        <InputCurrency
          {... inputCurrencyProps}
          labelText="October 2018 – December 2018 earnings:"
          id="quarter2"
          name="quarter2"
          defaultValue={quarter2}
          onChange={(e, value) => {
            const newStateValue = { ...stateValue };
            newStateValue.quarter2 = value;
            this.setState({ value: newStateValue });
          }}
        />
        <InputCurrency
          {... inputCurrencyProps}
          labelText="October 2018 – December 2018 earnings:"
          id="quarter3"
          name="quarter3"
          defaultValue={quarter3}
          onChange={(e, value) => {
            const newStateValue = { ...stateValue };
            newStateValue.quarter3 = value;
            this.setState({ value: newStateValue });
          }}
        />
        <InputCurrency
          {... inputCurrencyProps}
          labelText="October 2018 – December 2018 earnings:"
          id="quarter4"
          name="quarter4"
          defaultValue={quarter4}
          onChange={(e, value) => {
            const newStateValue = { ...stateValue };
            newStateValue.quarter4 = value;
            this.setState({ value: newStateValue });
          }}
        />
        <Button
          text="See Benefits"
        />
      </form>
      <Output { ...stateValue }/>
      </Fragment>
    );
  }
}

export default Form;
