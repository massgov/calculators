import React, { Component } from 'react';
import { decode, addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import { FormContext } from '@massds/mayflower-react';
import CalculatorOneVariables from '../../data/CalculatorOneVariables.json';
import Part1 from '../Form/Part1';
import Part2 from '../Form/Part2';
import Part3 from '../Form/Part3';

import '../../css/index.css';

/**
 * Map from url query params to props. The values in `url` will still be encoded
 * as strings since we did not pass a `urlPropsQueryConfig` to addUrlProps.
 */
function mapUrlToProps(url, props) {
  return{
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
  };
}

const {
  minEmployees, largeCompMedCont, smallCompMedCont, largeCompFamCont, smallCompFamCont, emp1099Fraction
} = CalculatorOneVariables.baseVariables;

class ExampleForm extends Component {
  constructor(props) {
    super(props);
    const {
      massEmp, w2, emp1099, option, payW2, pay1099, payWages, timeValue, timePeriod, famCont, medCont
    } = this.props;
    const over50per = (Number(emp1099) / (Number(w2) + Number(emp1099))) >= emp1099Fraction;
    const employeeCount = over50per ? (Number(w2) + Number(emp1099)) : Number(w2);
    const over25 = employeeCount >= minEmployees;
    const med_leave_cont = (employeeCount >= minEmployees) ? largeCompMedCont : smallCompMedCont;
    const fam_leave_cont = (employeeCount >= minEmployees) ? largeCompFamCont : smallCompFamCont;
    const validNumber = (num) => (num || (num !== null && num !== undefined));
    const getDefaultCurrency = (num) => ((validNumber(num)) ? Number(num) : '0');
    const getDefaultNumber = (num) => ((validNumber(num)) ? Number(num) : 0);
    this.state = {
      isActive: true,
      value: {
        employees_w2: getDefaultNumber(w2),
        employees_1099: getDefaultNumber(emp1099),
        payroll_w2: getDefaultCurrency(payW2),
        payroll_1099: getDefaultCurrency(pay1099),
        payroll_wages: getDefaultCurrency(payWages)
      },
      setValue: this.setValue,
      time_value: validNumber(timeValue) ? Number(timeValue) : 1,
      time_period: (timePeriod && timePeriod.length > 0) ? timePeriod : 'Year',
      fam_leave_cont: validNumber(famCont) ? famCont : fam_leave_cont,
      med_leave_cont: validNumber(medCont) ? medCont : med_leave_cont,
      payroll_base: (option && option.length > 0) ? option : 'all',
      has_mass_employees: massEmp ? (massEmp === 'yes') : true,
      updateState: this.updateState
    };
  }
  setValue = (input) => {
    const { value } = this.state;
    value[input.id] = input.value;
    this.setState({ value });
  };
  updateState = (newState) => { this.setState(newState); };
  render() {
    return(
      <form className="ma__form-page" action="#">
        <FormContext.Provider value={this.state}>
          <div className="page-content">
            <Part1 />
            <hr />
            <Part2 />
          </div>
          <hr />
          <Part3 />
        </FormContext.Provider>
      </form>
    );
  }
}


ExampleForm.contextType = FormContext;

export default addUrlProps({ mapUrlToProps })(ExampleForm);
