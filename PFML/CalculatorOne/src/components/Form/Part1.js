import React, {  Fragment } from 'react';
import { InputRadioGroup, CalloutAlert, InputNumber, Collapse, Paragraph } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import { FormContext } from './context';
import CalculatorOneVariables from '../../data/CalculatorOneVariables.json';
import PartOneProps from '../../data/PartOne.json';

import './index.css';

/**
 * Manually specify how to deal with changes to URL query param props.
 * We do this since we are not using a urlPropsQueryConfig.
 */
function mapUrlChangeHandlersToProps(props) {
  return {
    onChangeMassEmp: (value) => replaceInUrlQuery('massEmp', encode(UrlQueryParamTypes.boolean, value)),
    onChangeW2: (value) => replaceInUrlQuery('w2', encode(UrlQueryParamTypes.number, value)),
    onChangeEmp1099: (value) => replaceInUrlQuery('emp1099', encode(UrlQueryParamTypes.number, value))
  }
}

const Part1 = (props) => {
    const { minEmployees, largeCompMedCont, smallCompMedCont, largeCompFamCont, smallCompFamCont, emp1099Fraction } = CalculatorOneVariables.baseVariables;
    const { questionOne, questionTwo, questionThree, output } = PartOneProps;
    const { onChangeMassEmp, onChangeW2, onChangeEmp1099 } = props;
    return (
      <FormContext.Consumer>
        {
          (context) => {
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
                  defaultSelected={context.has_mass_employees ? 'yes' : 'no'}
                  errorMsg={questionOne.errorMsg}
                  radioButtons={questionOne.options}
                  onChange={(e) => {
                    const hasEmp = e.selected === 'yes' ? true : false;
                    context.updateState({
                      has_mass_employees: hasEmp
                    });
                    onChangeMassEmp(hasEmp)
                  }}
                  />
                  <Collapse in={!has_mass_employees} dimension="height" className="ma__callout-alert">
                    <div className="ma__collapse">
                      <CalloutAlert theme={questionOne.options[1].theme}>
                        <Paragraph text={questionOne.options[1].message} />
                      </CalloutAlert>
                    </div>
                  </Collapse>
                  <InputNumber
                    labelText={questionTwo.question}
                    id="employees_w2"
                    name="employees_w2"
                    type="number"
                    width={0}
                    inline={true}
                    maxlength={0}
                    placeholder="e.g. 50"
                    errorMsg={questionTwo.errorMsg}
                    defaultValue={context.employees_w2}
                    disabled={!context.has_mass_employees}
                    onChange={(e, value) => {
                      const empW2 = value;
                      onChangeW2(empW2)
                      context.updateState({
                        employees_w2: empW2,
                        med_leave_cont: (empW2 + context.employees_1099 >= minEmployees) ? largeCompMedCont : smallCompMedCont,
                        fam_leave_cont: (empW2 + context.employees_1099 >= minEmployees) ? largeCompFamCont : smallCompFamCont
                      })
                    }}
                    required={true}
                  />
                  <InputNumber
                    labelText={questionThree.question}
                    name="employees_1099"
                    id="employees_1099"
                    type="number"
                    width={0}
                    maxlength={0}
                    placeholder="e.g. 50"
                    inline={true}
                    errorMsg={questionThree.errorMsg}
                    defaultValue={context.employees_1099}
                    disabled={!context.has_mass_employees}
                    onChange={(e, value) => {
                      const emp1099 = value;
                      onChangeEmp1099(emp1099)
                      context.updateState({
                        employees_1099: emp1099,
                        med_leave_cont: (emp1099 + context.employees_w2 >= minEmployees) ? largeCompMedCont : smallCompMedCont,
                        fam_leave_cont: (emp1099 + context.employees_w2 >= minEmployees) ? largeCompFamCont : smallCompFamCont
                      })
                    }}
                    required={true}
                  />
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

export default addUrlProps({ mapUrlChangeHandlersToProps })(Part1);
