import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { decode, addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import { FormContext } from '@massds/mayflower-react';
import ContributionVariables from '../../data/ContributionVariables.json';
import Part1 from '../Form/Part1';
import Part2 from '../Form/Part2';
import Part3 from '../Form/Part3';
import Reset from '../Form/Reset';

import '../../css/index.css';

/**
 * Map from url query params to props. The values in `url` will still be encoded
 * as strings since we did not pass a `urlPropsQueryConfig` to addUrlProps.
 */
const mapUrlToProps = (url) => ({
  massEmp: decode(UrlQueryParamTypes.string, url.massEmp),
  w2: decode(UrlQueryParamTypes.number, url.w2),
  emp1099: decode(UrlQueryParamTypes.number, url.emp1099),
  option: decode(UrlQueryParamTypes.string, url.option),
  payW2: decode(UrlQueryParamTypes.number, url.payW2),
  pay1099: decode(UrlQueryParamTypes.number, url.pay1099),
  payWages: decode(UrlQueryParamTypes.number, url.payWages),
  medCont: decode(UrlQueryParamTypes.number, url.medCont),
  famCont: decode(UrlQueryParamTypes.number, url.famCont),
  timeValue: decode(UrlQueryParamTypes.string, url.timeValue),
  timePeriod: decode(UrlQueryParamTypes.string, url.timePeriod)
});

const {
  minEmployees, largeCompMedCont, smallCompMedCont, largeCompFamCont, smallCompFamCont, emp1099Fraction
} = ContributionVariables.baseVariables;

class ExampleForm extends Component {
  constructor(props) {
    super(props);
    const {
      massEmp, w2, emp1099, option, payW2, pay1099, payWages, timeValue, timePeriod, famCont, medCont
    } = this.props;
    const over50per = (Number(emp1099) / (Number(w2) + Number(emp1099))) > emp1099Fraction;
    const employeeCount = over50per ? (Number(w2) + Number(emp1099)) : Number(w2);
    const over25 = employeeCount >= minEmployees;
    const medLeaveCont = (employeeCount >= minEmployees) ? largeCompMedCont : smallCompMedCont;
    const famLeaveCont = (employeeCount >= minEmployees) ? largeCompFamCont : smallCompFamCont;
    const validNumber = (num) => (num || (num !== null && num !== undefined));
    const getDefaultCurrency = (num) => ((validNumber(num)) ? Number(num) : null);
    const getDefaultNumber = (num) => ((validNumber(num)) ? Number(num) : null);
    /* eslint-disable react/no-unused-state */
    this.state = {
      isActive: true,

      value: {
        employeesW2: getDefaultNumber(w2),
        employees1099: getDefaultNumber(emp1099),
        payrollW2: getDefaultCurrency(payW2),
        payroll1099: getDefaultCurrency(pay1099),
        payrollWages: getDefaultCurrency(payWages)
      },
      setValue: this.setValue,
      timeValue: validNumber(timeValue) ? Number(timeValue) : 1,
      timePeriod: (timePeriod && timePeriod.length > 0) ? timePeriod : 'Year',
      famLeaveCont: validNumber(famCont) ? famCont : famLeaveCont,
      medLeaveCont: validNumber(medCont) ? medCont : medLeaveCont,
      payrollBase: (option && option.length > 0) ? option : 'all',
      hasMassEmployees: massEmp ? (massEmp === 'yes') : true,
      updateState: this.updateState,
      over25,
      over50per,
      employeeCount
    };
    /* eslint-enable react/no-unused-state */
  }
  setValue = (input) => {
    const { value } = this.state;
    value[input.id] = input.value;
    this.setState({ value });
  };
  updateState = (newState) => { this.setState(newState); };
  render() {
    return(
      <form className="ma__form-page">
        <FormContext.Provider value={this.state}>
          <div className="page-content">
            <Part1 />
            <hr />
            <Part2 />
          </div>
          <hr />
          <Part3 />
          <Reset />
        </FormContext.Provider>
      </form>
    );
  }
}

ExampleForm.propTypes = {
  massEmp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  w2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  emp1099: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  option: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  payW2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pay1099: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  payWages: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  timeValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  timePeriod: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  famCont: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  medCont: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default addUrlProps({ mapUrlToProps })(ExampleForm);
