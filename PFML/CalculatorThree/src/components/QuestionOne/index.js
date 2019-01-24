import React, { Component } from 'react';
import { InputRadioGoup } from '@massds/mayflower-react';
//import './index.css';


class QuestionOne extends Component {
  constructor(props) {
    super(props);
  }

  render() {
  	const radioGroupProps = {
  		title: "Are you leaving for one of the following reasons?",
  		name: "question-one-reason-for-leave",
  		outline: true,
  		inline: true,
  		error: this.props.error,
  		disabled: this.props.disabled,
  		defaultSelected: this.props.defaultSelected,
  		onChange: ({ selected, name, event }) => {
  			console.log(selected)
  		}, 
  		radioButtons: [{ 
			text: "Birth or adoption of a child",
			value: "birth-adoption",
			message: "You can be covered up to 12 weeks by Paid Family and Medical Leave Program."
		}, {
			text: "Own Medical Condition",
			value: "own-medical",
			message: "You can be covered up to 20 weeks by Paid Family and Medical Leave Program."
		}, {
			text: "Caring for a Loved One",
			value: "caring-loved-one",
			message: "You can be covered up to 20 weeks by Paid Family and Medical Leave Program."
		}, {
			text: "Active Duty",
			value: "active-duty",
			message: "You can be covered up to 26 weeks by Paid Family and Medical Leave Program."
		}, {
			text: "Other",
			value: "other",
			message: "You may not be covered by the Paid Family and Medical Leave Program, for more information go here."
		}]
  	}
    return (
      <InputRadioGoup {...radioGroupProps} />
    );
  }
}

export default QuestionOne;
