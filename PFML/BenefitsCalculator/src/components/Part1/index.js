import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  InputRadioGroup, CalloutAlert, Paragraph, Collapse, HelpTip
} from '@massds/mayflower-react';
import PartOneProps from '../../data/PartOne.json';
import './index.css';
import { getHelpTip, toCurrency } from '../../utils';
import { calcTotalBenefit } from '../formula';

class Part1 extends Component {
  constructor(props) {
    super(props);
    const message = this.getMessage(PartOneProps, props.defaultSelected);
    this.state = {
      message: (message && message.message) ? message.message : '',
      messageTheme: (message && message.messageTheme) ? message.messageTheme : '',
      weeks: (message && message.weeks) ? message.weeks : null
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
      messageTheme: message.messageTheme,
      weeks: message.weeks
    });
    const maxWeeks = message.weeks;
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange({ selected, maxWeeks, event });
    }
  }

  render() {
    const { question, options } = PartOneProps;
    const { error, disabled, defaultSelected, qualified, weeklyBenefit } = this.props;
    const radioGroupProps = {
      title: getHelpTip(question, 'c-primary', 'question-1-helptip'),
      name: 'question-one',
      outline: true,
      inline: false,
      error,
      disabled: !qualified,
      defaultSelected,
      onChange: this.handleChange,
      radioButtons: options
    };

    const { messageTheme, weeks } = this.state;
    const open = !(weeks < 0);
    const callProps = {
      theme: messageTheme,
      icon: messageTheme === 'c-error-red' ? {
        name: 'alert',
        ariaHidden: true
      } : null
    };

    const totalBenefit = calcTotalBenefit({ benefitDuration: weeks, weeklyBenefit });

    console.log(totalBenefit);
    const message = `If approved, you may be covered <strong>up to ${weeks} weeks</strong> by the PFML program. Your maximum benefit credit is estimated to be <strong>${toCurrency(totalBenefit)}</strong>.`
    
    const startDate = 'This benefit will be available starting <strong>July 1, 2021</strong>.'



    return(
      <Fragment>
        <InputRadioGroup {...radioGroupProps} />
        {
          qualified && (
            <Collapse in={open} dimension="height" className="ma__callout-alert">
              <div className="ma__collapse">
                <CalloutAlert {...callProps}>
                  <HelpTip
                    theme="c-white"
                    text={message}
                    triggerText={[`<strong>${toCurrency(totalBenefit)}</strong>`]}
                    id="help-tip-benefits"
                    labelID="help-tip-benefits-label"
                  >

                  </HelpTip>
                  <Paragraph>
                    {startDate}
                  </Paragraph>
                </CalloutAlert>
              </div>
            </Collapse>
          )
        }
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
