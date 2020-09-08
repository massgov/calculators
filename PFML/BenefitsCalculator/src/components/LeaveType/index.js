import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@massds/mayflower-react/es/components/atoms/buttons/Button';
import CalloutAlert from '@massds/mayflower-react/es/components/organisms/CalloutAlert';
import HelpTip from '@massds/mayflower-react/es/components/organisms/HelpTip';
import Paragraph from '@massds/mayflower-react/es/components/atoms/text/Paragraph';
import Collapse from '@massds/mayflower-react/es/components/animations/Collapse';
import InputRadioGroup from '@massds/mayflower-react/es/components/forms/InputRadioGroup';

import leaveTypeData from '../../data/LeaveType.json';
import './index.css';
import { getHelpTip, getIframeProps, toCurrency } from '../../utils';
import { calcTotalBenefit } from '../formula';

class LeaveType extends Component {
  constructor(props) {
    super(props);
    const {
      message, theme, weeks, startDate
    } = this.getLeaveType(leaveTypeData, props.defaultSelected) || {};
    this.state = {
      message,
      theme,
      weeks,
      startDate
    };
  }

  getLeaveType = (data, selected) => data.options.find((option) => option.value === selected);

  handleChange = ({ selected, event }) => {
    const {
      message, theme, weeks, startDate
    } = this.getLeaveType(leaveTypeData, selected);
    this.setState({
      message,
      theme,
      weeks,
      startDate
    });
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange({ selected, weeks, event });
    }
  }

  render() {
    const { question, options } = leaveTypeData;
    const { defaultSelected, qualified, weeklyBenefit } = this.props;
    const radioGroupProps = {
      title: getHelpTip(question, 'c-primary', 'question-1-helptip'),
      name: 'question-one',
      outline: true,
      inline: false,
      disabled: !qualified,
      defaultSelected,
      onChange: this.handleChange,
      radioButtons: options
    };

    const {
      message, theme, weeks, startDate
    } = this.state;
    const open = !!weeks;
    const callProps = {
      theme,
      icon: theme === 'c-error-red' ? {
        name: 'alert',
        ariaHidden: true
      } : null
    };

    const totalBenefit = calcTotalBenefit({ benefitDuration: weeks, weeklyBenefit });
    const approvedMessage = `If approved, you may be covered <strong>up to ${weeks} weeks</strong> by the PFML program. Your maximum benefit credit is estimated to be <strong>${toCurrency(totalBenefit)}</strong>.`;
    const totalFormulaDescription = 'Your maximum benefit credit is equal to your estimated weekly benefit multiplied by the number of paid weeks (the first 7 days of your leave is a waiting period which is unpaid):';
    const startDateDisclaimer = `This benefit will be available starting <strong>${startDate}</strong>.`;

    const getHelpText = () => (
      <div className="ma__help-text">
        <Fragment>
          <Paragraph text={totalFormulaDescription} />
          <div className="ma__output-calculation">
            <Paragraph text={`${toCurrency(totalBenefit)} = ${toCurrency(weeklyBenefit)} x (${weeks} - 1) weeks`} />
          </div>
        </Fragment>
      </div>
    );

    return(
      <Fragment>
        <InputRadioGroup {...radioGroupProps} />
        {
          qualified && weeks && (
            <Collapse in={open} dimension="height" className="ma__callout-alert">
              <div className="ma__collapse">
                <CalloutAlert {...callProps}>
                  { (Number(weeks) === -1) ? (
                    <div className="ma__help-text">
                      <Paragraph text={message} />
                    </div>
                  ) : (
                    <Fragment>
                      <HelpTip
                        theme="c-white"
                        text={approvedMessage}
                        triggerText={[`<strong>${toCurrency(totalBenefit)}</strong>`]}
                        id="help-tip-benefits"
                        labelID="help-tip-benefits-label"
                        {...getIframeProps()}
                      >
                        {getHelpText()}
                      </HelpTip>
                      <Paragraph>
                        {startDateDisclaimer}
                      </Paragraph>
                      <hr />
                      <Button
                        usage="secondary"
                        size="small"
                        text="Learn more about PFML benefits"
                        href="https://www.mass.gov/paid-family-and-medical-leave-benefits"
                      />
                    </Fragment>
                  )}
                </CalloutAlert>
              </div>
            </Collapse>
          )
        }
      </Fragment>
    );
  }
}

LeaveType.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  belowMinSalary: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
};

export default LeaveType;
