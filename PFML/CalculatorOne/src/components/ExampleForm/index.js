import React, { Component } from 'react';
import { decode, addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import { FormContext } from '@massds/mayflower-react';
import CalculatorOneVariables from '../../data/CalculatorOneVariables.json';
import Part1 from '../Form/Part1';
import Part2 from '../Form/Part2';
import Part3 from '../Form/Part3';

import '../Form/index.css';

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

class ExampleForm extends Component {
  constructor(props) {
    super(props);
    const {
      massEmp, w2, emp1099, option, payW2, pay1099, payWages, timeValue, timePeriod, famCont, medCont
    } = this.props;
    const med_leave_cont = (emp1099 + w2 >= minEmployees) ? largeCompMedCont : smallCompMedCont;
    const fam_leave_cont = (emp1099 + w2 >= minEmployees) ? largeCompFamCont : smallCompFamCont;
    this.state = {
      isActive: true,
      value: {
        employees_w2: w2 || '',
        employees_1099: emp1099 || '',
      },
      setValue: this.setValue,
      has_mass_employees: massEmp ? (massEmp === 'yes') : true,
      updateState: this.updateState
    };
  }
  setValue = (input) => {
    const { value } = this.state;
    value[input.id] = input.value;
    this.setState({ value });
  };
  updateState = (newState) => this.setState(newState);
  render() {
    return(
        <form className="ma__form-page" action="#">
          <FormContext.Provider value={this.state}>
            <div className="page-content">
              <Part1 />
              <hr />
            </div>
            <hr />
          </FormContext.Provider>
        </form>
    );
  }
}


ExampleForm.contextType = FormContext;

export default addUrlProps({ mapUrlToProps })(ExampleForm);
