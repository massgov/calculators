import React, { Component } from 'react';
import { InputCurrency, Paragraph } from '@massds/mayflower-react';
import QuestionTwoProps from '../../data/QuestionTwo.json'
import './index.css';

const QuestionTwo = (props) => {
	const { question, errorMsg } = QuestionTwoProps;
	return (
      <div className="ma__input-group--inline">
        <InputCurrency 
          labelText={question}
          id="question-2"
          name="question-2"
          defaultText="0"
          min={0}
          format={{
          	"mantissa": 2,
          	"trimMantissa": false,
          	"thousandSeparated": true,
          	"negative": "parenthesis",
          	"output": "currency"
  		  }}
  		  errorMsg={errorMsg}
  		  onChange={props.onChange}
        required={true}
  		/>
      </div>
    );
};

export default QuestionTwo;
