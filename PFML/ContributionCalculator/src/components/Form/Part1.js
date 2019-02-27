import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { InputRadioGroup, CalloutAlert, InputNumber, Collapse, Paragraph, FormContext } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import ContributionVariables from '../../data/ContributionVariables.json';
import PartOneProps from '../../data/PartOne.json';
import { getHelpTip } from '../../utils';

import '../../css/index.css';

/**
 * Manually specify how to deal with changes to URL query param props.
 * We do this since we are not using a urlPropsQueryConfig.
 */
const mapUrlChangeHandlersToProps = () => ({
  onChangeMedCont: (value) => replaceInUrlQuery('medCont', encode(UrlQueryParamTypes.number, value)),
  onChangeMassEmp: (value) => replaceInUrlQuery('massEmp', encode(UrlQueryParamTypes.string, value)),
  onChangeW2: (value) => replaceInUrlQuery('w2', encode(UrlQueryParamTypes.number, value)),
  onChangeEmp1099: (value) => replaceInUrlQuery('emp1099', encode(UrlQueryParamTypes.number, value))
});

const Part1 = (props) => {
  const {
    minEmployees, largeCompMedCont, smallCompMedCont, largeCompFamCont, smallCompFamCont, emp1099Fraction
  } = ContributionVariables.baseVariables;
  const {
    questionOne, questionTwo, questionThree, output
  } = PartOneProps;
  const {
    onChangeMassEmp, onChangeW2, onChangeEmp1099, onChangeMedCont
  } = props;
  const calloutParagraphClass = 'ma__help-tip-many';
  const getDangerousParagraph = (text, key) => (<p className={calloutParagraphClass} dangerouslySetInnerHTML={{ __html: text }} key={key} />);
  return(
    <FormContext.Consumer>
      {
          (context) => {
            const {
              over25,
              over50per,
              hasMassEmployees,
              value: {
                employeesW2, employees1099
              }
            } = context;
            let outputMessage;
            if (over25 && over50per) {
              outputMessage = (
                <Fragment>
                  {output.overMinEmpOver1099.map((message, messageIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    message.paragraph.helpText ? <p className={calloutParagraphClass}>{getHelpTip(message.paragraph, 'c-white', `overMinEmpOver1099-${messageIndex}`)}</p> : getDangerousParagraph(message.paragraph.content, `overMinEmpOver1099-${messageIndex}`)
                  ))}
                </Fragment>
              );
            }
            if (over25 && !over50per && employees1099 && employees1099 > 0) {
              outputMessage = (
                <Fragment>
                  {output.overMinEmpUnder1099.map((message, messageIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    message.paragraph.helpText ? <p className="ma__help-tip-many">{getHelpTip(message.paragraph, 'c-white', `overMinEmpUnder1099-${messageIndex}`)}</p> : getDangerousParagraph(message.paragraph.content, `overMinEmpUnder1099-${messageIndex}`)
                  ))}
                </Fragment>
              );
            }
            if (over25 && !over50per && (!employees1099 || Number(employees1099) <= 0 || employees1099 === 'NaN')) {
              outputMessage = (
                <Fragment>
                  {output.overMinEmpNo1099.map((message, messageIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    message.paragraph.helpText ? <p className="ma__help-tip-many">{getHelpTip(message.paragraph, 'c-white', `overMinEmpNo1099-${messageIndex}`)}</p> : getDangerousParagraph(message.paragraph.content, `overMinEmpNo1099-${messageIndex}`)
                  ))}
                </Fragment>
              );
            }
            if (!over25 && over50per) {
              outputMessage = (
                <Fragment>
                  {output.underMinEmpOver1099.map((message, messageIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    message.paragraph.helpText ? <p className="ma__help-tip-many">{getHelpTip(message.paragraph, 'c-white', `underMinEmpOver1099-${messageIndex}`)}</p> : getDangerousParagraph(message.paragraph.content, `underMinEmpOver1099-${messageIndex}`)
                  ))}
                </Fragment>
              );
            }
            if (!over25 && !over50per && employees1099 && employees1099 > 0) {
              outputMessage = (
                <Fragment>
                  {output.underMinEmpUnder1099.map((message, messageIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    message.paragraph.helpText ? <p className="ma__help-tip-many">{getHelpTip(message.paragraph, 'c-white', `underMinEmpUnder1099-${messageIndex}`)}</p> : getDangerousParagraph(message.paragraph.content, `underMinEmpUnder1099-${messageIndex}`)
                  ))}
                </Fragment>
              );
            }
            if (!over25 && !over50per && (Number(employees1099) <= 0 || !employees1099 || employees1099 === 'NaN')) {
              outputMessage = (
                <Fragment>
                  {output.underMinEmpNo1099.map((message, messageIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    message.paragraph.helpText ? <p className="ma__help-tip-many">{getHelpTip(message.paragraph, 'c-white', `underMinEmpNo1099-${messageIndex}`)}</p> : getDangerousParagraph(message.paragraph.content, `underMinEmpNo1099-${messageIndex}`)
                  ))}
                </Fragment>
              );
            }
            if (!over25 && over50per && Number(employees1099) > 0 && !(Number(employeesW2) > 0)) {
              outputMessage = (
                <Fragment>
                  {output.underMinEmpNoW2.map((message, messageIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    message.paragraph.helpText ? <p className="ma__help-tip-many">{getHelpTip(message.paragraph, 'c-white', `underMinEmpNo1099-${messageIndex}`)}</p> : getDangerousParagraph(message.paragraph.content, `underMinEmpNo1099-${messageIndex}`)
                  ))}
                </Fragment>
              );
            }
            if (over25 && over50per && Number(employees1099) > 0 && !(Number(employeesW2) > 0)) {
              outputMessage = (
                <Fragment>
                  {output.overMinEmpNoW2.map((message, messageIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    message.paragraph.helpText ? <p className="ma__help-tip-many">{getHelpTip(message.paragraph, 'c-white', `underMinEmpNo1099-${messageIndex}`)}</p> : getDangerousParagraph(message.paragraph.content, `underMinEmpNo1099-${messageIndex}`)
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
                  inline
                  disabled={!context.hasMassEmployees}
                  id="employeesW2"
                  name="employeesW2"
                  type="number"
                  width={0}
                  maxlength={100}
                  placeholder="e.g. 50"
                  errorMsg={questionTwo.errorMsg}
                  min={0}
                  defaultValue={employeesW2 ? Number(employeesW2) : null}
                  required
                  unit=""
                  onChange={(e, inputValue) => {
                    const empW2 = Number(inputValue) > 0 ? Number(inputValue) : 0;
                    const value = { ...context.value };
                    value.payrollBase = 'all';
                    value.employeesW2 = empW2;
                    const empCount = empW2 + (context.value.employees1099 / (context.value.employees1099 + empW2) >= emp1099Fraction ? context.value.employees1099 : 0);
                    // Use updateState for updating many form values, otherwise use setValue for a single form id.
                    onChangeW2(empW2);
                    context.updateState({
                      value,
                      employeeCount: empCount,
                      medLeaveCont: (empCount >= minEmployees) ? largeCompMedCont : smallCompMedCont,
                      famLeaveCont: (empCount >= minEmployees) ? largeCompFamCont : smallCompFamCont,
                      over25: empCount >= minEmployees,
                      over50per: (Number(context.value.employees1099) / (Number(empW2) + Number(context.value.employees1099))) >= emp1099Fraction
                    });
                    onChangeMedCont(value.medLeaveCont);
                  }}
                  showButtons
                />
                <InputNumber
                  labelText={questionThree.question.helpText ? getHelpTip(questionThree.question) : questionThree.question.content}
                  inline
                  disabled={!context.hasMassEmployees}
                  name="employees1099"
                  id="employees1099"
                  type="number"
                  width={0}
                  maxlength={100}
                  placeholder="e.g. 50"
                  errorMsg={questionThree.errorMsg}
                  min={0}
                  defaultValue={employees1099 ? Number(employees1099) : null}
                  required
                  unit=""
                  onChange={(e, inputValue) => {
                    const emp1099 = Number(inputValue) > 0 ? Number(inputValue) : 0;
                    // Pull value from form for updating.
                    const value = { ...context.value };
                    value.employees1099 = emp1099;
                    const empCount = context.value.employeesW2 + (emp1099 / (emp1099 + context.value.employeesW2) >= emp1099Fraction ? emp1099 : 0);
                    context.updateState({
                      value,
                      employeeCount: empCount,
                      medLeaveCont: (empCount >= minEmployees) ? largeCompMedCont : smallCompMedCont,
                      famLeaveCont: (empCount >= minEmployees) ? largeCompFamCont : smallCompFamCont,
                      over25: empCount >= minEmployees,
                      over50per: (Number(emp1099) / (Number(context.value.employeesW2) + Number(emp1099))) >= emp1099Fraction
                    });
                    onChangeEmp1099(emp1099);
                    onChangeMedCont(value.medLeaveCont);
                  }}
                  showButtons
                />
                <Collapse in={hasMassEmployees && (employeesW2 > 0 || employees1099 > 0)} dimension="height" className="ma__callout-alert">
                  <div className="ma__collapse">
                    <CalloutAlert theme="c-primary">
                      { outputMessage }
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
  onChangeMedCont: PropTypes.func,
  onChangeMassEmp: PropTypes.func,
  onChangeW2: PropTypes.func,
  onChangeEmp1099: PropTypes.func
};

export default addUrlProps({ mapUrlChangeHandlersToProps })(Part1);
