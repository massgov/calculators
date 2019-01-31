import React from 'react';
import { InputCurrency, Collapse, CalloutAlert, Paragraph } from '@massds/mayflower-react';
import QuestionTwoProps from '../../data/QuestionTwo.json';
import './index.css';

const QuestionTwo = (props) => {
  const { defaultValue, onChange, disabled, belowMinSalary } = props
  const { question, errorMsg, message, messageTheme } = QuestionTwoProps;
  return(
    <React.Fragment>
      <InputCurrency
        labelText={question}
        id="question-2"
        name="question-2"
        defaultValue={defaultValue}
        min={0}
        format={{
          mantissa: 2,
          trimMantissa: false,
          thousandSeparated: true,
          negative: 'parenthesis',
          output: 'currency'
    		}}
        errorMsg={errorMsg}
        onChange={onChange}
        required
        disabled={disabled}
        inline
        step={1}
      />
      <Collapse in={belowMinSalary && !disabled} dimension="height" className="ma__callout-alert">
        <div className="ma__collapse">
          <CalloutAlert theme={messageTheme} icon={{ name: messageTheme === 'c-error-red' ? 'alert' : '', ariaHidden: true }}>
            <Paragraph text={message} />
          </CalloutAlert>
        </div>
      </Collapse>
    </React.Fragment>
  );
};

export default QuestionTwo;
