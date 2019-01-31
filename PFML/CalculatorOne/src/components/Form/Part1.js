import React, { Fragment } from 'react';
import { InputRadioGroup, CalloutAlert, InputNumber, Collapse, Paragraph, FormContext } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import CalculatorOneVariables from '../../data/CalculatorOneVariables.json';
import PartOneProps from '../../data/PartOne.json';

import './index.css';

/**
 * Manually specify how to deal with changes to URL query param props.
 * We do this since we are not using a urlPropsQueryConfig.
 */
function mapUrlChangeHandlersToProps(props) {
  return{
    onChangeMassEmp: (value) => replaceInUrlQuery('massEmp', encode(UrlQueryParamTypes.string, value)),
    onChangeW2: (value) => replaceInUrlQuery('w2', encode(UrlQueryParamTypes.number, value)),
    onChangeEmp1099: (value) => replaceInUrlQuery('emp1099', encode(UrlQueryParamTypes.number, value))
  };
}

const Part1 = (props) => {
  const {
    minEmployees, largeCompMedCont, smallCompMedCont, largeCompFamCont, smallCompFamCont, emp1099Fraction
  } = CalculatorOneVariables.baseVariables;
  const {
    questionOne, questionTwo, questionThree, output
  } = PartOneProps;
  const { onChangeMassEmp, onChangeW2, onChangeEmp1099 } = props;
  return(
    <FormContext.Consumer>
      {
          (context) => {
            const { employees_w2, employees_1099 } = context.value;
            const { has_mass_employees } = context;
            const over50per = (employees_1099 / employees_w2) > emp1099Fraction;
            const employeeCount = +employees_w2 + (over50per ? +employees_1099 : 0);
            const over25 = employeeCount >= minEmployees;
            let message;
            if (over25) {
              if (over50per) {
                message = (
                  <Fragment>
                    {output.overMinEmpOver1099.map((message, messageIndex) => <Paragraph key={`Form.message.${messageIndex}`} text={message.paragraph} />)}
                  </Fragment>
                );
              } else {
                message = (
                  <Fragment>
                    {output.overMinEmpUnder1099.map((message, messageIndex) => <Paragraph key={`Form.message.${messageIndex}`} text={message.paragraph} />)}
                  </Fragment>
                );
              }
            } else if (over50per) {
              message = (
                <Fragment>
                  {output.underMinEmpOver1099.map((message, messageIndex) => <Paragraph key={`Form.message.${messageIndex}`} text={message.paragraph} />)}
                </Fragment>
              );
            } else {
              message = (
                <Fragment>
                  {output.underMinEmpUnder1099.map((message, messageIndex) => <Paragraph key={`Form.message.${messageIndex}`} text={message.paragraph} />)}
                </Fragment>
              );
            }
            return(
              <fieldset>
                <InputRadioGroup
                  title={questionOne.question}
                  name="mass_employees"
                  outline
                  defaultSelected={has_mass_employees ? 'yes' : 'no'}
                  errorMsg={questionOne.errorMsg}
                  radioButtons={questionOne.options}
                  onChange={(e) => {
                    const hasEmp = e.selected === 'yes';
                    context.updateState({
                      has_mass_employees: hasEmp
                    });
                    onChangeMassEmp(e.selected);
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
                  inline
                  maxlength={0}
                  placeholder="e.g. 50"
                  errorMsg={questionTwo.errorMsg}
                  defaultValue={Number(context.value.employees_w2)}
                  disabled={!context.has_mass_employees}
                  required
                  unit=""
                  onChange={(e, value) => {
                    const empW2 = value;
                    const updatedValue = {
                      payroll_base: 'all',
                      med_leave_cont: ((empW2 + context.value.employees_1099) >= minEmployees) ? largeCompMedCont : smallCompMedCont,
                      fam_leave_cont: (empW2 + context.value.employees_1099 >= minEmployees) ? largeCompFamCont : smallCompFamCont
                    };
                    // Use updateState for updating many form values, otherwise use setValue for a single form id.
                    context.updateState(updatedValue);
                    onChangeW2(empW2);
                  }}
                />
                <InputNumber
                  labelText={questionThree.question}
                  name="employees_1099"
                  id="employees_1099"
                  type="number"
                  width={0}
                  maxlength={0}
                  placeholder="e.g. 50"
                  inline
                  errorMsg={questionThree.errorMsg}
                  defaultValue={Number(context.value.employees_1099)}
                  disabled={!context.has_mass_employees}
                  required
                  unit=""
                  onChange={(e, value) => {
                    const emp1099 = value;
                    onChangeEmp1099(emp1099);
                    // Pull value from form for updating.
                    const { value: contextValue } = context;
                    const updatedValue = {
                      ...contextValue,
                      employees_1099: Number(emp1099),
                      med_leave_cont: (emp1099 + context.value.employees_w2 >= minEmployees) ? largeCompMedCont : smallCompMedCont,
                      fam_leave_cont: (emp1099 + context.value.employees_w2 >= minEmployees) ? largeCompFamCont : smallCompFamCont
                    };
                    // Use updateState for updating many form values, otherwise use setValue for a single form id.
                    context.updateState({ value: updatedValue });
                  }}
                />
                <Collapse in={!!(has_mass_employees && employees_w2)} dimension="height" className="ma__callout-alert">
                  <div className="ma__collapse">
                    <CalloutAlert theme="c-primary">
                      { message }
                    </CalloutAlert>
                  </div>
                </Collapse>
              </fieldset>
            );
          }

        }
    </FormContext.Consumer>
  );
};

export default addUrlProps({ mapUrlChangeHandlersToProps })(Part1);
