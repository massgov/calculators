import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  InputRadioGroup, CalloutAlert, Paragraph, Collapse
} from '@massds/mayflower-react';
import PartOneProps from '../../data/PartOne.json';
import './index.css';

class Part1 extends Component {
  constructor(props) {
    super(props);
    const message = this.getMessage(PartOneProps, props.defaultSelected);
    this.state = {
      message: (message && message.message) ? message.message : '',
      messageTheme: (message && message.messageTheme) ? message.messageTheme : ''
    };
  }

  getMessage = (qOneProps, selected) => {
    let message;
    qOneProps.options.forEach((option) => {
      if (option.value === selected) {
        message = {
          message: option.message,
          messageTheme: option.theme,
          weeks: option.weeks
        };
      }
    });
    return message;
  }

  handleChange = ({ selected, event }) => {
    const message = this.getMessage(PartOneProps, selected);
    this.setState({
      message: message.message,
      messageTheme: message.messageTheme
    });
    const maxWeeks = message.weeks;
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange({ selected, maxWeeks, event });
    }
  }

  render() {
    const { question, options } = PartOneProps;
    const { error, disabled, defaultSelected } = this.props;
    const radioGroupProps = {
      title: question,
      name: 'question-one',
      outline: true,
      inline: true,
      error,
      disabled,
      defaultSelected,
      onChange: this.handleChange,
      radioButtons: options
    };
    const { message, messageTheme } = this.state;
    const open = !!message;
    return(
      <Fragment>
        <InputRadioGroup {...radioGroupProps} />
        <Collapse in={open} dimension="height" className="ma__callout-alert">
          <div className="ma__collapse">
            <CalloutAlert theme={messageTheme} icon={{ name: messageTheme === 'c-error-red' ? 'alert' : '', ariaHidden: true }}>
              <Paragraph text={message} />
            </CalloutAlert>
          </div>
        </Collapse>
      </Fragment>
    );
  }
}

Part1.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  belowMinSalary: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
};

export default Part1;
