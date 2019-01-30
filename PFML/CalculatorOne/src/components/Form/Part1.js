import React, {  Fragment } from 'react';
import { InputRadioGroup, CalloutAlert, InputNumber, Collapse } from '@massds/mayflower-react';
import { FormContext } from './context';
import CalculatorOneVariables from '../../data/CalculatorOneVariables.json';

import './index.css';


const Part1 = () => {
    const { minEmployees, largeCompMedCont, smallCompMedCont, largeCompFamCont, smallCompFamCont, emp1099Fraction } = CalculatorOneVariables.baseVariables;
    return (
      <FormContext.Consumer>
        {
          (context) => {
            const onChange_employees_w2 = (e) => {
              const empW2 = e.target.value;
              context.updateState({ 
                employees_w2: empW2,
                med_leave_cont: (empW2 + context.employees_1099 >= minEmployees) ? largeCompMedCont : smallCompMedCont,
                fam_leave_cont: (empW2 + context.employees_1099 >= minEmployees) ? largeCompFamCont : smallCompFamCont 
              })
            }
            const onChange_employees_1099 = (e) => {
              const emp1099 = e.target.value;
              context.updateState({ 
                employees_1099: emp1099,
                med_leave_cont: (emp1099 + context.employees_w2 >= minEmployees) ? largeCompMedCont : smallCompMedCont,
                fam_leave_cont: (emp1099 + context.employees_w2 >= minEmployees) ? largeCompFamCont : smallCompFamCont
              })
            }
            const { has_mass_employees, employees_w2, employees_1099 } = context;
            const over50per = (employees_1099/employees_w2) > emp1099Fraction; 
            const employeeCount = +employees_w2 + (over50per ? +employees_1099 : 0);
            const over25 = employeeCount >= minEmployees;
            let message; 
            if(over25) {
              if(over50per) {
                message = (
                  <Fragment>
                    <p><strong>You are required to remit payment to the department starting 7/1 and you are liable for a portion of your employees medical leave contribution</strong> because you have more than 25 total employees in Massachusetts. </p>
                    <p><strong>You are required to remit payment on behalf of your contractors.</strong> Employers with 50% or more of their workforce made up of 1099s need to consider these as full time employees under the new language.</p>
                  </Fragment>
                )
              } else {
                message =  (
                  <Fragment>
                    <p><strong>You are required to remit payment to the department starting 7/1 and you are liable for a portion of your employees medical leave contribution</strong> because you have more than 25 total employees in Massachusetts. </p>
                    <p><strong>You are not required to remit payment on behalf of your contractors</strong> because you have less than 50% of contractors</p>
                  </Fragment>
                )
              }
            } else if (over50per) {
              message =  (
                <Fragment>
                  <p><strong>You are not liable for medical leave payment for your employees</strong> because you have less than 25 total employees in Massachusetts.</p>
                  <p><strong>You are not required to remit payment on behalf of your contractors</strong> because you have less than 50% of contractors</p>
                </Fragment>
              )
            } else {
              message = (<p><strong>You are not required to remit payment to the department starting 7/1</strong> because you have less than 25 total employees in Massachusetts. </p>)
            }
            return (
              <fieldset>
                <InputRadioGroup
                  title="Do you have any employees in Massachusetts?"
                  name="mass_employees"
                  outline
                  defaultSelected="yes"
                  errorMsg="You must selected your favorite plant."
                  radioButtons={[
                    {id: 'yes',value: 'yes',label: 'Yes'},
                    {id: 'no',value: 'no',label: 'No'}
                  ]}
                  onChange={(e) => {
                    if(e.selected === 'yes') {
                      context.updateState({ has_mass_employees: true })
                    } else {
                      context.updateState({ has_mass_employees: false })
                    }
                  }}
                  />
                  <Collapse in={!has_mass_employees} dimension="height" className="ma__callout-alert">
                    <div className="ma__collapse">
                      <CalloutAlert theme="c-error-red">
                        <p>You are <strong>not required</strong> to remit payment to the department starting 7/1. </p>
                      </CalloutAlert>
                    </div>
                  </Collapse>
                <div className="ma__input-group--inline">
                  <InputNumber
                    labelText="How many of your MA employees receive W2s?"
                    id="employees_w2"
                    name="employees_w2"
                    type="number"
                    width={0}
                    maxlength={0}
                    placeholder="e.g. 50"
                    errorMsg="you did not type something"
                    defaultValue={context.employees_w2}
                    disabled={!context.has_mass_employees}
                    onChange={(e) => onChange_employees_w2(e)}
                    required={true}
                  />
                </div>
                <div className="ma__input-group--inline">
                  <InputNumber
                    labelText="How many 1099 contractors have you hired in the past year?"
                    name="employees_1099"
                    id="employees_1099"
                    type="number"
                    width={0}
                    maxlength={0}
                    placeholder="e.g. 50"
                    errorMsg="you did not type something"
                    defaultValue={context.employees_1099}
                    disabled={!context.has_mass_employees}
                    onChange={(e) => onChange_employees_1099(e)}
                    required={true}
                  />
                </div>
                <Collapse in={(has_mass_employees && employees_w2)} dimension="height" className="ma__callout-alert">
                  <div className="ma__collapse">
                    <CalloutAlert theme="c-primary">
                        { message }
                    </CalloutAlert>
                  </div>
                </Collapse>
              </fieldset>
            )
          }
          
        }
      </FormContext.Consumer>
    ); 
}


export default Part1;
