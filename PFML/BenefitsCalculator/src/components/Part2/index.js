import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  InputCurrency, CalloutAlert, Paragraph
} from '@massds/mayflower-react';
import PartTwoProps from '../../data/PartTwo.json';
import './index.css';

const Part2 = (props) => {
  const {
    defaultValue, onChange, disabled, belowMinSalary, onBlur
  } = props;
  const {
    question, errorMsg, message, messageTheme, placeholder
  } = PartTwoProps;
  return(
    <Fragment>
      <InputCurrency
        labelText={question}
        id="question-2"
        name="question-2"
        width={0}
        maxlength={200}
        defaultValue={defaultValue}
        max={1000000000000}
        min={0}
        placeholder={placeholder}
        format={{
          mantissa: 2,
          trimMantissa: false,
          thousandSeparated: true
        }}
        errorMsg={errorMsg}
        onChange={onChange}
        required
        disabled={disabled}
        inline
        step={1}
        onBlur={onBlur}
      />
      {
        belowMinSalary && !disabled && defaultValue > 0 && (
          <CalloutAlert theme={messageTheme} icon={{ name: messageTheme === 'c-error-red' ? 'alert' : '', ariaHidden: true }}>
            <Paragraph text={message} />
          </CalloutAlert>
        )
      }
    </Fragment>
  );
};


Part2.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  belowMinSalary: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
};

export default Part2;
