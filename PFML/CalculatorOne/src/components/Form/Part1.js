import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { InputRadioGroup, CalloutAlert, InputNumber, Collapse, Paragraph, FormContext } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import CalculatorOneVariables from '../../data/CalculatorOneVariables.json';
import PartOneProps from '../../data/PartOne.json';
import { getHelpTip } from '../../utils';

import '../../css/index.css';

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
            const { employeesW2, employees1099 } = context.value;
            const { hasMassEmployees } = context;
            const over50per = (Number(employees1099) / (Number(employeesW2) + Number(employees1099))) >= emp1099Fraction;
            const employeeCount = over50per ? (Number(employeesW2) + Number(employees1099)) : Number(employeesW2);
            const over25 = employeeCount >= minEmployees;
            let message;
            if (over25 && over50per) {
              message = (
                <Fragment>
                  {output.overMinEmpOver1099.map((message, messageIndex) => (
                    message.paragraph.helpText ? getHelpTip(message.paragraph, 'c-white', `overMinEmpOver1099-${messageIndex}`) : <Paragraph key={`overMinEmpOver1099-${messageIndex}`} text={message.paragraph.content} />
                  ))}
                </Fragment>
              );
            }
            if (over25 && !over50per && employees1099 && employees1099 > 0) {
              message = (
                <Fragment>
                  {output.overMinEmpUnder1099.map((message, messageIndex) => (
                    message.paragraph.helpText ? getHelpTip(message.paragraph, 'c-white', `overMinEmpUnder1099-${messageIndex}`) : <Paragraph key={`overMinEmpUnder1099-${messageIndex}`} text={message.paragraph.content} />
                  ))}
                </Fragment>
              );
            }
            if (over25 && !over50per && (!employees1099 || Number(employees1099) <= 0 || employees1099 === 'NaN')) {
              message = (
                <Fragment>
                  {output.overMinEmpNo1099.map((message, messageIndex) => (
                    message.paragraph.helpText ? getHelpTip(message.paragraph, 'c-white', `overMinEmpNo1099-${messageIndex}`) : <Paragraph key={`overMinEmpNo1099-${messageIndex}`} text={message.paragraph.content} />
                  ))}
                </Fragment>
              );
            }
            if (!over25 && over50per) {
              message = (
                <Fragment>
                  {output.underMinEmpOver1099.map((message, messageIndex) => (
                    message.paragraph.helpText ? getHelpTip(message.paragraph, 'c-white', `underMinEmpOver1099-${messageIndex}`) : <Paragraph key={`underMinEmpOver1099-${messageIndex}`} text={message.paragraph.content} />
                  ))}
                </Fragment>
              );
            }
            if (!over25 && !over50per && employees1099 && employees1099 > 0) {
              message = (
                <Fragment>
                  {output.underMinEmpUnder1099.map((message, messageIndex) => (
                    message.paragraph.helpText ? getHelpTip(message.paragraph, 'c-white', `underMinEmpUnder1099-${messageIndex}`) : <Paragraph key={`underMinEmpUnder1099-${messageIndex}`} text={message.paragraph.content} />
                  ))}
                </Fragment>
              );
            }
            if (!over25 && !over50per && (Number(employees1099) <= 0 || !employees1099 || employees1099 === 'NaN')) {
              message = (
                <Fragment>
                  {output.underMinEmpNo1099.map((message, messageIndex) => (
                    message.paragraph.helpText ? getHelpTip(message.paragraph, 'c-white', `underMinEmpNo1099-${messageIndex}`) : <Paragraph key={`underMinEmpNo1099-${messageIndex}`} text={message.paragraph.content} />
                  ))}
                </Fragment>
              );
            }
            return(
              <fieldset>
                <InputRadioGroup
                  title={questionOne.question.helpText ? getHelpTip(questionOne.question) : questionOne.question.content}
                  name="mass_employees"
                  outline
                  defaultSelected={hasMassEmployees ? 'yes' : 'no'}
                  errorMsg={questionOne.errorMsg}
                  radioButtons={questionOne.options}
                  onChange={(e) => {
                    const hasEmp = e.selected === 'yes';
                    context.updateState({
                      hasMassEmployees: hasEmp
                    });
                    onChangeMassEmp(e.selected);
                  }}
                />
                <Collapse in={!hasMassEmployees} dimension="height" className="ma__callout-alert">
                  <div className="ma__collapse">
                    <CalloutAlert theme={questionOne.options[1].theme}>
                      <Paragraph text={questionOne.options[1].message} />
                    </CalloutAlert>
                  </div>
                </Collapse>
                <InputNumber
                  labelText={questionTwo.question.helpText ? getHelpTip(questionTwo.question) : questionTwo.question.content}
                  id="employeesW2"
                  name="employeesW2"
                  type="number"
                  width={0}
                  inline
                  maxlength={0}
                  placeholder="e.g. 50"
                  errorMsg={questionTwo.errorMsg}
                  defaultValue={Number(employeesW2)}
                  disabled={!context.hasMassEmployees}
                  required
                  unit=""
                  onChange={(e, inputValue) => {
                    const empW2 = Number(inputValue);
                    const value = { ...context.value };
                    value.payrollBase = 'all';
                    value.employeesW2 = empW2;
                    const employeeCount = empW2 + (context.value.employees1099 / (context.value.employees1099 + empW2) >= emp1099Fraction ? context.value.employees1099 : 0);
                    // Use updateState for updating many form values, otherwise use setValue for a single form id.
                    onChangeW2(empW2);
                    context.updateState({
                      value,
                      medLeaveCont: (employeeCount >= minEmployees) ? largeCompMedCont : smallCompMedCont,
                      famLeaveCont: (employeeCount >= minEmployees) ? largeCompFamCont : smallCompFamCont
                    });
                  }}
                  showButtons
                />
                <InputNumber
                  labelText={questionThree.question.helpText ? getHelpTip(questionThree.question) : questionThree.question.content}
                  name="employees1099"
                  id="employees1099"
                  type="number"
                  width={0}
                  maxlength={0}
                  placeholder="e.g. 50"
                  inline
                  errorMsg={questionThree.errorMsg}
                  defaultValue={Number(context.value.employees1099)}
                  disabled={!context.hasMassEmployees}
                  required
                  onChange={(e, inputValue) => {
                    const emp1099 = Number(inputValue);
                    // Pull value from form for updating.
                    const value = { ...context.value };
                    value.employees1099 = emp1099;
                    const employeeCount = context.value.employeesW2 + (emp1099 / (emp1099 + context.value.employeesW2) >= emp1099Fraction ? emp1099 : 0);
                    context.updateState({
                      value,
                      medLeaveCont: (employeeCount >= minEmployees) ? largeCompMedCont : smallCompMedCont,
                      famLeaveCont: (employeeCount >= minEmployees) ? largeCompFamCont : smallCompFamCont
                    });
                    onChangeEmp1099(emp1099);
                  }}
                  showButtons
                />
                <Collapse in={hasMassEmployees && employeesW2 > 0} dimension="height" className="ma__callout-alert">
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

Part1.propTypes = {
  /** Functions that push changed context props to the url. */
  onChangeMassEmp: PropTypes.func,
  onChangeW2: PropTypes.func,
  onChangeEmp1099: PropTypes.func
};

export default addUrlProps({ mapUrlChangeHandlersToProps })(Part1);
