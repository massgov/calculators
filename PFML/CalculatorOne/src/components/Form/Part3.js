import React, { Component, Fragment } from 'react';
import { InputCurrency, InputRadioGroup, CalloutAlert, InputText, Collapse } from '@massds/mayflower-react';
import { FormContext } from './context';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

import './index.css';


const Part3 = () => {
    return (
      <FormContext.Consumer>
        {
          (context) => {
            const { has_mass_employees, employees_w2, employees_1099, payroll_w2, payroll_1099, payroll_wages } = context;
            const over50per = (employees_1099/employees_w2) > 0.5; 
            const employeeCount = over50per ? (+employees_w2 + +employees_1099) : +employees_w2;
            const over25 = employeeCount >= 25; 
            const medPercent = over25 ? 0.0052 : 0.0031;
            const famPercent = 0.0011;
            const minMed = over25 ? 0.6 : 0;
            return (
              <fieldset>
                <div className="ma__label">How will you split liability with your employess?</div>
                <InputRange
                  maxValue={1}
                  minValue={minMed}
                  step={0.01}
                  value={context.med_leave_cont || minMed}
                  formatLabel={value => `${(value*100).toFixed(0)}%`}
                  onChange={value => context.updateState({ med_leave_cont: value })}
                  onChangeComplete={value => console.log(value)}
                  minLabel="Employer Contribution"
                  maxLabel="Employee Contribution"
                />
                <InputRange
                  maxValue={1}
                  minValue={0}
                  step={0.01}
                  value={context.fam_leave_cont || 0}
                  formatLabel={value => `${(value*100).toFixed(0)}%`}
                  onChange={value => context.updateState({ fam_leave_cont: value })}
                />
              </fieldset>
            )
          }
        }
      </FormContext.Consumer>
    ); 
}


export default Part3;
