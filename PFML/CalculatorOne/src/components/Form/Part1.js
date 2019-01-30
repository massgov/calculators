import React, {  Fragment } from 'react';
import { InputRadioGroup, CalloutAlert, InputNumber, Collapse, Paragraph } from '@massds/mayflower-react';
import { FormContext } from './context';
import CalculatorOneVariables from '../../data/CalculatorOneVariables.json';
import PartOneProps from '../../data/PartOne.json';

import './index.css';


const Part1 = () => {
    const { minEmployees, largeCompMedCont, smallCompMedCont, largeCompFamCont, smallCompFamCont, emp1099Fraction } = CalculatorOneVariables.baseVariables;
    const { questionOne, questionTwo, questionThree, output } = PartOneProps;
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
                    {output.overMinEmpOver1099.map(message => <Paragraph text={message.paragraph} />)}
                  </Fragment>
                )
              } else {
                message =  (
                  <Fragment>
                    {output.overMinEmpUnder1099.map(message => <Paragraph text={message.paragraph} />)}
                  </Fragment>
                )
              }
            } else if (over50per) {
              message =  (
                <Fragment>
                  {output.underMinEmpOver1099.map(message => <Paragraph text={message.paragraph} />)}
                </Fragment>
              )
            } else {
              message = (
                <Fragment>
                  {output.underMinEmpUnder1099.map(message => <Paragraph text={message.paragraph} />)}
                </Fragment>
              )
            }
            return (
              <fieldset>
                <InputRadioGroup
                  title={questionOne.question}
                  name="mass_employees"
                  outline
                  defaultSelected="yes"
                  errorMsg={questionOne.errorMsg}
                  radioButtons={questionOne.options}
                  onChange={(e) => {
                    if(e.selected === 'yes') {
                      context.updateState({ has_mass_employees: true })
                    } else {
                      context.updateState({ has_mass_employees: false })
                    }
                    questionOne.options.forEach(option => {
                      if(option.value === e.selected){
                        context.updateState({ 
                          has_mass_employees_message: option.message,
                          has_mass_employees_theme: option.theme
                        })
                      }
                    })
                  }}
                  />
                  <Collapse in={!has_mass_employees} dimension="height" className="ma__callout-alert">
                    <div className="ma__collapse">
                      <CalloutAlert theme={context.has_mass_employees_theme}>
                        <Paragraph text={context.has_mass_employees_message} />
                      </CalloutAlert>
                    </div>
                  </Collapse>
                <div className="ma__input-group--inline">
                  <InputNumber
                    labelText={questionTwo.question}
                    id="employees_w2"
                    name="employees_w2"
                    type="number"
                    width={0}
                    maxlength={0}
                    placeholder="e.g. 50"
                    errorMsg={questionTwo.errorMsg}
                    defaultValue={context.employees_w2}
                    disabled={!context.has_mass_employees}
                    onChange={(e) => onChange_employees_w2(e)}
                    required={true}
                  />
                </div>
                <div className="ma__input-group--inline">
                  <InputNumber
                    labelText={questionThree.question}
                    name="employees_1099"
                    id="employees_1099"
                    type="number"
                    width={0}
                    maxlength={0}
                    placeholder="e.g. 50"
                    errorMsg={questionThree.errorMsg}
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
