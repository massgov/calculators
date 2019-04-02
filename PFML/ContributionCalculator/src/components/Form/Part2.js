import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import { InputCurrency, InputRadioGroup, CalloutAlert, Collapse, HelpTip, Paragraph, Input, InputContext, FormContext, InputSync } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import ContributionVariables from '../../data/ContributionVariables.json';
import PartTwoProps from '../../data/PartTwo.json';
import { toCurrency, toPercentage } from '../../utils';

import '../../css/index.css';

/**
 * Manually specify how to deal with changes to URL query param props.
 * We do this since we are not using a urlPropsQueryConfig.
 */
const mapUrlChangeHandlersToProps = () => ({
  onChangeOption: (value) => replaceInUrlQuery('option', encode(UrlQueryParamTypes.string, value)),
  onChangePayW2: (value) => replaceInUrlQuery('payW2', encode(UrlQueryParamTypes.string, value)),
  onChangePay1099: (value) => replaceInUrlQuery('pay1099', encode(UrlQueryParamTypes.string, value)),
  onChangePayWages: (value) => replaceInUrlQuery('payWages', encode(UrlQueryParamTypes.string, value))
});

const Part2 = (props) => {
  const formContext = useContext(FormContext);
  const {
    totContribution, totMedPercent, totFamPercent, socialSecCap, empMedCont, largeCompMedCont, emp1099Fraction, minEmployees
  } = ContributionVariables.baseVariables;
  const {
    questionOne, questionTwo, questionThree, questionFour, under25MedContDisclaimer
  } = PartTwoProps;
  const {
    onChangeOption, onChangePayW2, onChangePay1099, onChangePayWages
  } = props;
  const partTwoDefaults = {
    payrollBase: props.option || 'all',
    payW2: props.payW2 || '',
    pay1099: props.pay1099 || '',
    payWages: props.payWages || ''
  };


  const {
    mass_employees = props.massEmp || 'yes',
    employeesW2 = props.w2 ? Number(props.w2) : null,
    employees1099 = props.emp1099 ? Number(props.emp1099) : null,
    payrollW2 = partTwoDefaults.payW2,
    payroll1099 = partTwoDefaults.pay1099,
    payWages = partTwoDefaults.payWages
  } = formContext.getInputProviderValues();
  let payrollBase = props.option || formContext.getInputProviderValue('payrollBase') || 'all';
  let employeeCount = Number(employeesW2) + (Number(employees1099) / (Number(employees1099) + Number(employeesW2)) >= emp1099Fraction ? Number(employees1099) : 0);
  let over50per = (Number(employees1099) / (Number(employeesW2) + Number(employees1099))) >= emp1099Fraction;
  let over25 = employeeCount >= minEmployees;
  let hasMassEmployees = mass_employees === 'yes';
  let medPercent = totContribution * totMedPercent;
  let medPayrollPercent = over25 ? (largeCompMedCont + empMedCont) : empMedCont;
  let famPercent = totContribution * totFamPercent;
  let totalPercent = medPercent + famPercent;
  let totalPayroll;
  if (payrollBase === 'all' && employeesW2 > 0) {
    totalPayroll = over50per ? (Number(numbro.unformat(payroll1099)) + Number(numbro.unformat(payrollW2))) : Number(numbro.unformat(payrollW2));
  } else if (payrollBase === 'all' && !(Number(employeesW2) > 0)) {
    totalPayroll = Number(numbro.unformat(payroll1099));
  } else {
    totalPayroll = Number(numbro.unformat(payWages)) > socialSecCap ? socialSecCap : Number(numbro.unformat(payWages));
  }
  const payrollWagesCap = Number(numbro.unformat(payWages)) > socialSecCap ? socialSecCap : Number(numbro.unformat(payWages));
  let disableInput = !hasMassEmployees || Number.isNaN(employeeCount);
  // all workers annual
  let medCompPayment = medPercent * totalPayroll * medPayrollPercent;
  let famCompPayment = famPercent * totalPayroll;
  // one worker annual
  let medPayment = medPercent * payrollWagesCap * medPayrollPercent;
  let famPayment = famPercent * payrollWagesCap;

  const empMedContPercent = `${empMedCont * 100}%`;
  return(
    <Fragment>
      <fieldset>
        <Input id="payrollBase" defaultValue={payrollBase} useOwnStateValue>
          <InputContext.Consumer>
            {
              (radioContext) => (
                <div className="ma_input-group--mobile-1">
                  <InputRadioGroup
                    title={questionOne.question}
                    name="payrollBase"
                    outline
                    defaultSelected={payrollBase}
                    errorMsg={questionOne.errorMsg}
                    radioButtons={questionOne.options}
                    onChange={(e) => {
                      radioContext.setOwnValue(e.selected, () => {
                        onChangeOption(e.selected);
                      });
                    }}
                    disabled={disableInput}
                  />
                </div>
              )
            }
          </InputContext.Consumer>
        </Input>
        <InputSync inputProviderIds={['mass_employees', 'employeesW2', 'employees1099', 'payrollBase', 'payrollW2']}>
          {
            () => {
              const empw2 = Number(formContext.getInputProviderValue('employeesW2'));
              const emp1099 = Number(formContext.getInputProviderValue('employees1099'));
              employeeCount = Number(empw2) + (Number(emp1099) / (Number(emp1099) + Number(empw2)) >= emp1099Fraction ? Number(emp1099) : 0);
              over25 = employeeCount >= minEmployees;
              hasMassEmployees = formContext.getInputProviderValue('mass_employees') === 'yes';
              disableInput = !hasMassEmployees || Number.isNaN(employeeCount);
              over50per = (Number(emp1099) / (Number(empw2) + Number(emp1099))) >= emp1099Fraction;
              payrollBase = formContext.getInputProviderValue('payrollBase');
              const pay1099 = formContext.getInputProviderValue('payroll1099') || '';
              const pWages = formContext.getInputProviderValue('payWages') || '';
              const payW2 = formContext.getInputProviderValue('payrollW2') || '';
              if (payrollBase === 'all' && empw2 > 0) {
                totalPayroll = over50per ? (Number(numbro.unformat(pay1099)) + Number(numbro.unformat(payW2))) : Number(numbro.unformat(payW2));
              } else if (payrollBase === 'all' && !(Number(empw2) > 0)) {
                totalPayroll = Number(numbro.unformat(pay1099));
              } else {
                totalPayroll = Number(numbro.unformat(pWages)) > socialSecCap ? socialSecCap : Number(numbro.unformat(pWages));
              }
              medPercent = totContribution * totMedPercent;
              medPayrollPercent = over25 ? (largeCompMedCont + empMedCont) : empMedCont;
              famPercent = totContribution * totFamPercent;
              totalPercent = medPercent + famPercent;
              medCompPayment = medPercent * totalPayroll * medPayrollPercent;
              famCompPayment = famPercent * totalPayroll;
              // one worker annual
              medPayment = medPercent * payrollWagesCap * medPayrollPercent;
              famPayment = famPercent * payrollWagesCap;
              return (
                <Fragment>
                  {formContext.getInputProviderValue('payrollBase') === 'all' && (
                    <Fragment>
                      <div>
                        <InputCurrency
                          labelText={questionTwo.question}
                          id="payrollW2"
                          name="payrollW2"
                          width={0}
                          maxlength={200}
                          placeholder="e.g. $100,000"
                          errorMsg={questionTwo.errorMsg}
                          defaultValue={toCurrency(payrollW2)}
                          min={0}
                          format={{
                            mantissa: 2,
                            trimMantissa: false,
                            thousandSeparated: true
                          }}
                          onChange={(value, id) => {
                            // const newVal = Object.assign({}, inputContext.getValue(), { payW2: value });
                            // inputContext.setValue(newVal, () => {
                            onChangePayW2(value);
                            // });
                          }}
                          required
                          disabled={disableInput || !over50per}
                          inline
                          step={1}
                        />
                      </div>
                      <div>
                        <InputCurrency
                          labelText={questionThree.question}
                          id="payroll1099"
                          name="payroll1099"
                          width={0}
                          maxlength={200}
                          placeholder="e.g. $100,000"
                          errorMsg={questionThree.errorMsg}
                          defaultValue={toCurrency(payroll1099)}
                          min={0}
                          format={{
                            mantissa: 2,
                            trimMantissa: false,
                            thousandSeparated: true
                          }}
                          onChange={(value, id) => {
                            // const newVal = Object.assign({}, inputContext.getValue(), { pay1099: value });
                            // inputContext.setValue(newVal, () => {
                            onChangePay1099(value);
                            // });
                          }}
                          disabled={disableInput || !over50per}
                          required
                          inline
                          step={1}
                        />
                      </div>
                      <Collapse
                        in={(hasMassEmployees && (employeeCount > 0) && !Number.isNaN(totalPayroll) && (over50per ? (Number(numbro.unformat(pay1099)) > 0) : true))}
                        dimension="height" className="ma__callout-alert">
                        <InputSync inputProviderIds={['payrollBase', 'payroll1099', 'payrollW2', 'employeesW2', 'employees1099']}>
                          {
                            () => {
                              medPercent = totContribution * totMedPercent;
                              medPayrollPercent = over25 ? (largeCompMedCont + empMedCont) : empMedCont;
                              famPercent = totContribution * totFamPercent;
                              totalPercent = medPercent + famPercent;
                              medCompPayment = medPercent * totalPayroll * medPayrollPercent;
                              famCompPayment = famPercent * totalPayroll;
                              // one worker annual
                              medPayment = medPercent * payrollWagesCap * medPayrollPercent;
                              famPayment = famPercent * payrollWagesCap;
                              return(
                              <div className="ma__collapse">
                                <CalloutAlert theme="c-primary" icon={null}>
                                  <HelpTip
                                    text={`The estimated total annual contribution for the business is <strong>${toCurrency(famCompPayment + medCompPayment)}</strong>. `}
                                    triggerText={[`<strong>${toCurrency(famCompPayment + medCompPayment)}</strong>`]}
                                    id="help-tip-total-ann-cont"
                                    theme="c-white"
                                    helpText={over25 ? (
                                      // over 25 total medLeave calculation
                                      [`${toCurrency(famCompPayment + medCompPayment)} = ${toCurrency(totalPayroll)} X ${toPercentage(totalPercent, 2)}`]
                                    ) : (
                                      // under 25 total medLeave calculation
                                      [`${toCurrency(famCompPayment + medCompPayment)} = (${toCurrency(totalPayroll)} X ${toPercentage(famPercent, 2)}) + (${toCurrency(totalPayroll)} X ${toPercentage(medPercent, 2)} X ${empMedContPercent})`]
                                    )
                                    }
                                  />
                                  <div className="ma__help-tip-many">
                                    <HelpTip
                                      text={`Of this amount, <strong>${toCurrency(famPercent * totalPayroll)}</strong> is for family leave and <strong>${toCurrency(medPercent * totalPayroll * medPayrollPercent)}</strong> is for medical leave.`}
                                      triggerText={[`<strong>${toCurrency(famPercent * totalPayroll)}</strong>`, `<strong>${toCurrency(medPercent * totalPayroll * medPayrollPercent)}</strong>`]}
                                      id="help-tip-medfam-ann-cont"
                                      theme="c-white"
                                    >
                                      <div className="ma__help-text">
                                        Family
                                        Leave: {toCurrency(famPercent * totalPayroll)} = {toCurrency(totalPayroll)} X {toPercentage(famPercent, 2)}
                                      </div>
                                      <div className="ma__help-text">
                                        Medical
                                        Leave: {toCurrency(medPercent * totalPayroll * medPayrollPercent)} = {toCurrency(totalPayroll)} X {over25 ? toPercentage(medPercent, 2) :
                                        <span>{toPercentage(medPercent, 2)} X {empMedContPercent}</span>}
                                      </div>
                                    </HelpTip>
                                  </div>
                                  {!over25 &&
                                  <Paragraph className="ma__help-tip-many" text={under25MedContDisclaimer.content}/>}
                                  <div className="ma__disclaimer">
                                    <Paragraph
                                      text={`<strong>Please note:</strong> If any of the covered individuals’ wages are above the SSI cap (<strong>${toCurrency(socialSecCap)}</strong>), the estimated total contribution above is an overestimation. To yield a more accurate estimate, substitute the SSI cap amount in place of any wages above the cap when summing your total payroll.`}/>
                                  </div>
                                </CalloutAlert>
                              </div>
                            );}

                          }
                        </InputSync>
                      </Collapse>
                    </Fragment>
                  )}
                  {formContext.getInputProviderValue('payrollBase') === 'one' && (
                    <Fragment>
                      <div>
                        <InputCurrency
                          labelText={questionFour.question}
                          id="payrollWages"
                          name="payrollWages"
                          width={0}
                          maxlength={200}
                          placeholder="e.g. $100,000"
                          errorMsg={questionFour.errorMsg}
                          defaultValue={toCurrency(payWages)}
                          min={0}
                          format={{
                            mantissa: 2,
                            trimMantissa: false,
                            thousandSeparated: true
                          }}
                          onChange={(value, id) => {
                            // const newVal = Object.assign({}, inputContext.getValue(), { payWages: value });
                            // inputContext.setValue(newVal, () => {
                            onChangePayWages(value);
                            // });
                          }}
                          required
                          inline
                          step={1}
                          disabled={disableInput}
                        />
                      </div>
                      <Collapse
                        in={hasMassEmployees && (pWages && (employeeCount > 0) && (Number(numbro.unformat(pWages)) > 0))}
                        dimension="height">
                        <div className="ma__collapse">
                          {pWages && (
                            <CalloutAlert theme="c-primary" icon={null}>
                              <div className="ma__help-tip-many">
                                <HelpTip
                                  text={`The total estimated minimum annual contribution for this covered individual is <strong>${toCurrency(famPayment + medPayment)}</strong>. `}
                                  triggerText={[`<strong>${toCurrency(famPayment + medPayment)}</strong>`]}
                                  id="help-tip-tot-emp-ann-cont"
                                  helpText={over25 ? (
                                    // over 25 total medLeave calculation
                                    [`Total Contribution: ${toCurrency(famPayment + medPayment)} = ${toCurrency(payrollWagesCap)} X ${toPercentage(totalPercent, 2)}`]
                                  ) : (
                                    // under 25 total medLeave calculation
                                    [`Total Contribution: ${toCurrency(famPayment + medPayment)} = (${toCurrency(payrollWagesCap)} X ${toPercentage(famPercent, 2)}) + (${toCurrency(payrollWagesCap)} X ${toPercentage(medPercent, 2)} X ${empMedContPercent})`]
                                  )
                                  }
                                  theme="c-white"
                                />
                                <HelpTip
                                  text={`Of this amount, <strong>${toCurrency(famPayment)}</strong> is for family leave. and <strong>${toCurrency(medPayment)}</strong> is for medical leave.`}
                                  triggerText={[`<strong>${toCurrency(famPayment)}</strong>`, `<strong>${toCurrency(medPayment)}</strong>`]}
                                  id="help-tip-medfam-emp-ann-cont"
                                  theme="c-white"
                                >
                                  <div className="ma__help-text">Family
                                    Leave: {toCurrency(famPayment)} = {toCurrency(payrollWagesCap)} X {toPercentage(famPercent, 2)}
                                  </div>
                                  <div className="ma__help-text">Medical
                                    Leave: {toCurrency(medPayment)} = {toCurrency(payrollWagesCap)} X {over25 ? toPercentage(medPercent, 2) :
                                      <span>{toPercentage(medPercent, 2)} X {empMedContPercent}</span>}
                                  </div>
                                </HelpTip>
                              </div>
                              {!over25 &&
                              <Paragraph className="ma__help-tip-many" text={under25MedContDisclaimer.content}/>}
                              {Number(numbro.unformat(pWages)) > socialSecCap && (
                                <div className="ma__disclaimer">
                                  <Paragraph
                                    text={`<strong>Please note: </strong>Required contributions are capped at the Social Security cap, which is updated annually. It is <strong>${toCurrency(socialSecCap)}</strong> for 2019.`}/>
                                </div>
                              )}
                            </CalloutAlert>
                          )}
                        </div>
                      </Collapse>
                    </Fragment>
                  )}
                </Fragment>
              );
              }
            }
        </InputSync>
      </fieldset>
    </Fragment>
  );
};

Part2.propTypes = {
  /** Functions that push changed context props to the url. */
  onChangeOption: PropTypes.func,
  onChangePayW2: PropTypes.func,
  onChangePay1099: PropTypes.func,
  onChangePayWages: PropTypes.func
};

export default addUrlProps({ mapUrlChangeHandlersToProps })(Part2);
