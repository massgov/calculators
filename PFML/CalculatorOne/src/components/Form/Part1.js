import React, { Component, Fragment } from 'react';
import { InputCurrency, InputRadioGroup, CalloutAlert, InputText, Collapse } from '@massds/mayflower-react';
import { FormContext } from './context';

import './index.css';


const Part1 = () => {
    return (
      <FormContext.Consumer>
        {
          (context) => {
            const onChange_employees_w2 = (e) => {
              context.updateState({ 
                employees_w2: e,
                med_leave_cont: (e + context.employees_1099 >= 25) ? 0.6 : 0,
                fam_leave_cont: 0 
              })
            }
            const onChange_employees_1099 = (e) => {
              context.updateState({ 
                employees_1099: e,
                med_leave_cont: (e + context.employees_w2 >= 25) ? 0.6 : 0,
                fam_leave_cont: 0
              })
            }
            const { has_mass_employees, employees_w2, employees_1099 } = context;
            const over50per = (employees_1099/employees_w2) > 0.5; 
            const employeeCount = +employees_w2 + (over50per ? +employees_1099 : 0);
            const over25 = employeeCount >= 25;
            let message; 
            if(over25) {
              if(over50per) {
                message = (
                  <Fragment>
                    <p><strong>You are required to remit payment to the department starting 7/1 and you are liable for a portion of medical leave for your employees.</strong> Because you have more than 25 total employees in Massachusetts. </p>
                    <p><strong>You are required to remit payment on behalf of your contractors.</strong> For employers with over 50% their workforce made up of 1099s need to consider these as full time employees under the new language.</p>
                  </Fragment>
                )
              } else {
                message =  (
                  <Fragment>
                    <p><strong>You are required to remit payment to the department starting 7/1 and you are liable for a portion of medical leave for your employees.</strong> Because you have more than 25 total employees in Massachusetts. </p>
                    <p><strong>You are not required to remit payment on behalf of your contractors.</strong> Because you have less than 50% of contractors</p>
                  </Fragment>
                )
              }
            } else if (over50per) {
              message =  (
                <Fragment>
                  <p><strong>You are not liable for medical leave payment for your employees.</strong> Because you have less than 25 total employees in Massachusetts.</p>
                  <p><strong>You are not required to remit payment on behalf of your contractors.</strong> Because you have less than 50% of contractors</p>
                </Fragment>
              )
            } else {
              message = (<p><strong>You are not required to remit payment to the department starting 7/1.</strong> Because you have less than 25 total employees in Massachusetts. </p>)
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
                <div class="ma__input-group--inline">
                  <InputText
                    labelText="How many of your MA employees receive W2s?"
                    id="employees_w2"
                    name="employees_w2"
                    type="number"
                    width={0}
                    maxlength={0}
                    placeholder="type something"
                    errorMsg="you did not type something"
                    defaultText={context.employees_w2}
                    disabled={!context.has_mass_employees}
                    onChange={onChange_employees_w2}
                    required={true}
                  />
                </div>
                <div class="ma__input-group--inline">
                  <InputText
                    labelText="How many 1099 contractors have you hired in the past year?"
                    name="employees_1099"
                    id="employees_1099"
                    type="number"
                    width={0}
                    maxlength={0}
                    placeholder="type something"
                    errorMsg="you did not type something"
                    defaultText={context.employees_1099}
                    disabled={!context.has_mass_employees}
                    onChange={onChange_employees_1099}
                    required={true}
                  />
                </div>
                <Collapse in={(has_mass_employees && employees_w2 && employees_1099)} dimension="height" className="ma__callout-alert">
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
