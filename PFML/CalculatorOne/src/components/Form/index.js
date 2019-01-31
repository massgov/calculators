import React, { Component } from 'react';
import { decode, addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import CalculatorOneVariables from '../../data/CalculatorOneVariables.json';
import { FormContext } from './context';
import Part1 from './Part1';
import Part2 from './Part2';
import Part3 from './Part3';

import './index.css';

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
  minEmployees, largeCompMedCont, smallCompMedCont, largeCompFamCont, smallCompFamCont
} = CalculatorOneVariables.baseVariables;

class Form extends Component {
  constructor(props) {
    super(props);
    const {
      massEmp, w2, emp1099, option, payW2, pay1099, payWages, timeValue, timePeriod
    } = this.props;
    const med_leave_cont = (emp1099 + w2 >= minEmployees) ? largeCompMedCont : smallCompMedCont;
    const fam_leave_cont = (emp1099 + w2 >= minEmployees) ? largeCompFamCont : smallCompFamCont;
    this.state = {
      has_mass_employees: massEmp ? (massEmp === 'yes') : true,
      employees_w2: w2 || '',
      employees_1099: emp1099 || '',
      payroll_base: option || 'all',
      med_leave_cont: med_leave_cont || '0',
      fam_leave_cont: fam_leave_cont || '0',
      payroll_w2: payW2 || '',
      payroll_1099: pay1099 || '',
      payroll_wages: payWages || '',
      time_value: timeValue || 1,
      time_period: timePeriod || 'Year',
      updateState: (newState) => this.setState(newState)
    };
  }
  render() {
    return(
      <FormContext.Provider value={this.state}>
        <form className="ma__form-page" action="#">
          <div className="page-content">
            <Part1 />
            <hr />
            <Part2 />
          </div>
          <hr />
          <Part3 />
        </form>
      </FormContext.Provider>
    );
  }
}


Form.contextType = FormContext;

export default addUrlProps({ mapUrlToProps })(Form);
