import React, { Component } from 'react';
import {
  InputRadioGroup, CalloutAlert, Paragraph, Collapse
} from '@massds/mayflower-react';
import QuestionOneProps from '../../data/QuestionOne.json';
import './index.css';

class QuestionOne extends Component {
  constructor(props) {
    super(props);
    const message = this.getMessage(QuestionOneProps, props.defaultSelected);
    this.state = {
      message: (message && message.message) ? message.message : '',
      messageTheme: (message && message.messageTheme) ? message.messageTheme : '',
      weeks: (message && message.weeks) ? message.weeks : ''
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

  handleChange = ({ selected, name, event }) => {
    const message = this.getMessage(QuestionOneProps, selected);
    this.setState({
      message: message.message,
      messageTheme: message.messageTheme,
      weeks: message.weeks
    });
    const maxWeeks = message.weeks;
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ selected, maxWeeks, event });
    }
  }

  render() {
    const { question, options } = QuestionOneProps;
  	const radioGroupProps = {
  		title: question,
  		name: 'question-one',
  		outline: true,
  		inline: true,
  		error: this.props.error,
  		disabled: this.props.disabled,
  		defaultSelected: this.props.defaultSelected,
  		onChange: this.handleChange,
  		radioButtons: options
  	};
  	const open = !!this.state.message;
    return(
      <React.Fragment>
        <InputRadioGroup {...radioGroupProps} />
        <Collapse in={open} dimension="height" className="ma__callout-alert">
          <div className="ma__collapse">
            <CalloutAlert theme={this.state.messageTheme} icon={{ name: this.state.messageTheme === 'c-error-red' ? 'alert' : '', ariaHidden: true }}>
              <Paragraph text={this.state.message} />
            </CalloutAlert>
          </div>
        </Collapse>
      </React.Fragment>
    );
  }
}

export default QuestionOne;
