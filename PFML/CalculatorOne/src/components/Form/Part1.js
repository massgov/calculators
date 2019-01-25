import React, { Component } from 'react';
import { InputCurrency, InputRadioGroup, CalloutAlert, InputText } from '@massds/mayflower-react';
import { FormContext } from './context';

import './index.css';


const Part1 = () => {
    return (
      <FormContext.Consumer>
        {
          (context) => {
            const onChange_employees_w2 = (e) => {
              context.updateState({ employees_w2: e })
            }
            const onChange_employees_1099 = (e) => {
              context.updateState({ employees_1099: e })
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
                {
                  !context.has_mass_employees && (
                    <CalloutAlert theme="c-error-red">
                      <p>You are <strong>not required</strong> to remit payment to the department starting 7/1. </p>
                    </CalloutAlert>
                  )
                }

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
                  />
                </div>
              </fieldset>
            )
          }
          
        }
      </FormContext.Consumer>
    ); 
}


export default Part1;
