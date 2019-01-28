import React, { Component } from 'react';
import { InputRadioGroup, CalloutAlert, Paragraph, Collapse } from '@massds/mayflower-react';
import QuestionOneProps from '../../data/QuestionOne.json'
import './index.css';

class QuestionOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      messageTheme: "",
      weeks: ""
    };
  }

  handleChange = ({selected, name, event}) => {
    let maxWeeks;
    QuestionOneProps.options.forEach(option => {
      if(option.value === selected) {
        maxWeeks = option.weeks;
        this.setState({ 
          message: option.message,
          messageTheme: option.theme,
          weeks: option.weeks 
        });
      }
    })
    if(typeof this.props.onChange == "function"){
      this.props.onChange({selected, maxWeeks, event})
    }
  }

  render() {
    const { question, options } = QuestionOneProps;
  	const radioGroupProps = {
  		title: question,
  		name: "question-one",
  		outline: true,
  		inline: true,
  		error: this.props.error,
  		disabled: this.props.disabled,
  		//defaultSelected: this.props.defaultSelected,
  		onChange: this.handleChange, 
  		radioButtons: options
  	}
  	const open = this.state.message ? true : false;
  	console.log(open)
    return (
      <React.Fragment>
        <InputRadioGroup {...radioGroupProps} />
        <Collapse in={open} dimension="height" className="ma__callout-alert">
          <div className="ma__collapse">
            <CalloutAlert theme={this.state.messageTheme} icon={{name: this.state.messageTheme === "c-error-red" ? "alert" : "",ariaHidden: true}} >
              <Paragraph text={this.state.message} />
            </CalloutAlert>
          </div>
        </Collapse>
      </React.Fragment>
    );
  }
}

export default QuestionOne;
