import React, { Component } from 'react';
import { InputCurrency, Button } from '@massds/mayflower-react';

import './index.css';


class Form extends Component {
  constructor(props) {
    super(props);
  }

  render() {
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
      <form className="ma__form-page" action="#">
        <InputCurrency
          {... inputCurrencyProps}
          labelText="October 2018 – December 2018 earnings:"
          id="quarter1"
          name="quarter1"
          defaultValue={100}
          onChange={(e, value) => {
            console.log(value);
          }}
        />
        <InputCurrency
          {... inputCurrencyProps}
          labelText="October 2018 – December 2018 earnings:"
          id="quarter2"
          name="quarter2"
          defaultValue={100}
          onChange={(e, value) => {
            console.log(value);
          }}
        />
        <InputCurrency
          {... inputCurrencyProps}
          labelText="October 2018 – December 2018 earnings:"
          id="quarter3"
          name="quarter3"
          defaultValue={100}
          onChange={(e, value) => {
            console.log(value);
          }}
        />
        <InputCurrency
          {... inputCurrencyProps}
          labelText="October 2018 – December 2018 earnings:"
          id="quarter4"
          name="quarter4"
          defaultValue={100}
          onChange={(e, value) => {
            console.log(value);
          }}
        />
        <Button text="See Benefits" />
      </form>
    );
  }
}

export default Form;
