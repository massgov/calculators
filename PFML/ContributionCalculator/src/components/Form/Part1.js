import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { InputRadioGroup, CalloutAlert, InputNumber, Collapse, Paragraph, Input, InputContext, FormContext } from '@massds/mayflower-react';
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
  onChangeMassEmp: (value) => replaceInUrlQuery('massEmp', encode(UrlQueryParamTypes.string, value)),
  onChangeW2: (value) => replaceInUrlQuery('w2', encode(UrlQueryParamTypes.number, value)),
  onChangeEmp1099: (value) => replaceInUrlQuery('emp1099', encode(UrlQueryParamTypes.number, value))
});

const Part1 = (props) => {
  const formContext = useContext(FormContext);
  const {
    minEmployees, largeCompMedCont, smallCompMedCont, largeCompFamCont, smallCompFamCont, emp1099Fraction
  } = ContributionVariables.baseVariables;
  const {
    questionOne, questionTwo, questionThree, output
  } = PartOneProps;
  const { onChangeMassEmp, onChangeW2, onChangeEmp1099 } = props;
  const calloutParagraphClass = 'ma__help-tip-many';
  const getDangerousParagraph = (text, key) => (<div className={calloutParagraphClass} dangerouslySetInnerHTML={{ __html: text }} key={key} />);

  const { employeesW2 = !Number.isNaN(props.w2) ? props.w2 : 0, employees1099 = !Number.isNaN(props.emp1099) ? props.emp1099 : 0 } = formContext.getValues();
  let over50per;
  let employeeCount;
  over50per = (Number(employees1099) / (Number(employeesW2) + Number(employees1099))) >= emp1099Fraction;
  employeeCount = over50per ? (Number(employeesW2) + Number(employees1099)) : Number(employeesW2);

  const getConditionsMessage = () => {
    let calloutMessage = null;
    let conditionEmpCount;
    let conditionEmp1099;
    let conditionOver50;
    if (formContext.hasId('part_one')) {
      const {
        w2 = !Number.isNaN(props.w2) ? props.w2 : 0,
        emp1099 = !Number.isNaN(props.emp1099) ? props.emp1099 : 0,
        over50 = ((emp1099 / w2) + emp1099) >= emp1099Fraction,
        empCount = over50 ? (w2 + emp1099) : w2,
        outputMessage
      } = formContext.getValue('part_one');
      conditionEmpCount = empCount;
      calloutMessage = outputMessage;
      conditionEmp1099 = emp1099;
      conditionOver50 = over50;
    } else {
      const w2 = !Number.isNaN(props.w2) ? props.w2 : 0;
      conditionEmp1099 = !Number.isNaN(props.emp1099) ? props.emp1099 : 0;
      conditionOver50 = ((conditionEmp1099 / w2) + conditionEmp1099) >= emp1099Fraction;
      conditionEmpCount = conditionOver50 ? (w2 + conditionEmp1099) : w2;
    }
    const over25 = conditionEmpCount >= minEmployees;
    const conditions = new Map([
      ['overMinEmpOver1099', (over25 && conditionOver50)],
      ['overMinEmpUnder1099', (over25 && !conditionOver50 && conditionEmp1099 && conditionEmp1099 > 0)],
      ['overMinEmpNo1099', (over25 && !conditionOver50 && (!conditionEmp1099 || conditionEmp1099 <= 0 || conditionEmp1099 === 'NaN'))],
      ['underMinEmpOver1099', (!over25 && conditionOver50)],
      ['underMinEmpUnder1099', (!over25 && !conditionOver50 && conditionEmp1099 && conditionEmp1099 > 0)],
      ['underMinEmpNo1099', (!over25 && !conditionOver50 && (conditionEmp1099 <= 0 || !conditionEmp1099 || conditionEmp1099 === 'NaN'))]
    ]);
    conditions.forEach((condition, key) => {
      if (condition) {
        calloutMessage = (
          <Fragment>
            {output[key].map((message, messageIndex) => {
              // eslint-disable-next-line react/no-array-index-key
              const messageKey = `${key}-${messageIndex}`;
              if (message.paragraph.helpText) {
                return<div key={messageKey} className="ma__help-tip-many">{getHelpTip(message.paragraph, 'c-white', messageKey)}</div>;
              }
              return getDangerousParagraph(message.paragraph.content, messageKey);
            })}
          </Fragment>
        );
      }
    });
    return calloutMessage;
  };

  const partOneDefaults = {
    w2: props.w2 ? Number(props.w2) : null,
    emp1099: props.emp1099 ? Number(props.emp1099) : null,
    mass_employees: 'yes',
    empCount: Number.isNaN(employeeCount) ? 0 : employeeCount,
    over50: over50per,
    over25: Number.isNaN(employeeCount) ? minEmployees <= 0 : employeeCount >= minEmployees,
    disableInputs: false,
    famLeaveCont: props.famCont ? Number(props.famCont) : Number.isNaN(employeeCount) ? 0 : (employeeCount >= minEmployees) ? largeCompFamCont : smallCompFamCont,
    medLeaveCont: props.medCont ? Number(props.medCont) : Number.isNaN(employeeCount) ? 0 : (employeeCount >= minEmployees) ? largeCompMedCont : smallCompMedCont,
  };
  if (typeof props.massEmp === 'string') {
    partOneDefaults.mass_employees = (props.massEmp && props.massEmp === 'true') ? 'yes' : 'no';
  }
  return(
    <fieldset>
      <Input id="part_one" defaultValue={partOneDefaults}>
        <InputContext.Consumer>
          {
            (inputContext) => {
              const {
                mass_employees: massEmployees,
                disableInputs,
                emp1099,
                w2
              } = formContext.getValue('part_one');
              return(
                <React.Fragment>
                  <Input id="mass_employees" defaultValue={massEmployees}>
                    <InputContext.Consumer>
                      {
                        (radioContext) => (
                          <InputRadioGroup
                            title={questionOne.question.helpText ? getHelpTip(questionOne.question) : questionOne.question.content}
                            name="mass_employees"
                            outline
                            defaultSelected={radioContext.getValue()}
                            errorMsg={questionOne.errorMsg}
                            radioButtons={questionOne.options}
                            onChange={(e) => {
                              radioContext.setValue(e.selected, () => {
                                const newVal = Object.assign({}, inputContext.getValue(), { disableInputs: !disableInputs, mass_employees: radioContext.getValue() });
                                inputContext.setValue(newVal, () => {
                                  const hasEmployees = (radioContext.getValue() === 'yes');
                                  formContext.setValue({ id: 'employeesW2', value: Number(formContext.getValue('employeesW2')) });
                                  formContext.setValue({ id: 'question_one_callout', value: !hasEmployees });
                                  onChangeMassEmp(hasEmployees);
                                });
                              });
                            }}
                          />
                        )
                      }
                    </InputContext.Consumer>
                  </Input>
                  <Input id="question_one_callout" defaultValue={massEmployees === 'no'}>
                    <InputContext.Consumer>
                      {
                        (questionContext) => (
                          <Collapse in={questionContext.getValue()} dimension="height" className="ma__callout-alert">
                            <div className="ma__collapse">
                              <CalloutAlert theme={questionOne.options[1].theme}>
                                <Paragraph text={questionOne.options[1].message} />
                              </CalloutAlert>
                            </div>
                          </Collapse>
                        )
                      }
                    </InputContext.Consumer>
                  </Input>
                  <InputNumber
                    labelText={questionTwo.question.helpText ? getHelpTip(questionTwo.question) : questionTwo.question.content}
                    id="employeesW2"
                    name="employeesW2"
                    type="number"
                    width={0}
                    inline
                    maxlength={0}
                    min={0}
                    placeholder="e.g. 50"
                    errorMsg={questionTwo.errorMsg}
                    defaultValue={w2}
                    disabled={massEmployees === 'no'}
                    required
                    unit=""
                    onChange={() => {
                      const empW2 = Number(formContext.getValue('employeesW2'));
                      const current1099 = Number(formContext.getValue('employees1099'));
                      if (!Number.isNaN(empW2)) {
                        const empCount = empW2 + (current1099 / (current1099 + empW2) >= emp1099Fraction ? current1099 : 0);
                        const over50 = (Number(current1099) / (Number(empW2) + Number(current1099))) >= emp1099Fraction;
                        const over25 = empCount >= minEmployees;
                        const newVal = Object.assign({}, formContext.getValue('part_one'), {
                          emp1099: current1099,
                          empCount,
                          over50,
                          over25,
                          w2: empW2
                        });
                        inputContext.setValue(newVal, () => {
                          onChangeW2(empW2);
                        });
                      }
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
                    min={0}
                    placeholder="e.g. 50"
                    inline
                    errorMsg={questionThree.errorMsg}
                    defaultValue={emp1099}
                    disabled={(formContext.hasId('part_one') && formContext.getValue('part_one').mass_employees === 'no')}
                    required
                    onChange={() => {
                      const empW2 = Number(formContext.getValue('employeesW2'));
                      const current1099 = Number(formContext.getValue('employees1099'));
                      if (!Number.isNaN(current1099)) {
                        const empCount = empW2 + (current1099 / (current1099 + empW2) >= emp1099Fraction ? current1099 : 0);
                        const over50 = (Number(current1099) / (Number(empW2) + Number(current1099))) >= emp1099Fraction;
                        const over25 = empCount >= minEmployees;
                        const newVal = Object.assign({}, formContext.getValue('part_one'), {
                          w2: empW2,
                          empCount,
                          over50,
                          over25,
                          emp1099: current1099
                        });
                        inputContext.setValue(newVal, () => {
                          onChangeEmp1099(newVal.emp1099);
                        });
                      }
                    }}
                    showButtons
                  />
                  <Collapse in={massEmployees === 'yes' && w2 && w2 > 0} dimension="height" className="ma__callout-alert">
                    <div className="ma__collapse">
                      <CalloutAlert theme="c-primary">
                        { getConditionsMessage() }
                      </CalloutAlert>
                    </div>
                  </Collapse>
                  {props.children}
                </React.Fragment>
              );
            }
          }
        </InputContext.Consumer>
      </Input>
    </fieldset>
  );
};

Part1.propTypes = {
  /** Functions that push changed context props to the url. */
  onChangeMassEmp: PropTypes.func,
  onChangeW2: PropTypes.func,
  onChangeEmp1099: PropTypes.func
};

export default addUrlProps({ mapUrlChangeHandlersToProps })(Part1);
