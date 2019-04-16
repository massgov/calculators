import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import { InputCurrency, InputRadioGroup, CalloutAlert, Collapse, HelpTip, Paragraph, Input, InputContext, FormContext, InputSync } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import ContributionVariables from '../../data/ContributionVariables.json';
import PartTwoProps from '../../data/PartTwo.json';
import { toCurrency, toPercentage } from '../../utils';
import { getEmpCount, hasMassEmployees, isOver25, isOver50, getTotalPayroll } from './form.utils';

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
  if (!formContext.hasInputProviderIds(['mass_employees', 'employeesW2', 'employees1099'])) {
    return null;
  }
  const {
    totContribution, totMedPercent, totFamPercent, socialSecCap, empMedCont, largeCompMedCont
  } = ContributionVariables.baseVariables;
  const {
    questionOne, questionTwo, questionThree, questionFour, under25MedContDisclaimer
  } = PartTwoProps;
  const {
    onChangeOption, onChangePayW2, onChangePay1099, onChangePayWages, option = 'all'
  } = props;
  const partTwoDefaults = {
    payW2: props.payW2 || '0',
    pay1099: props.pay1099 || '0',
    payWages: props.payWages || '0',
    option: (['all', 'one'].indexOf(option) > -1) ? option : 'all',
    useDefault: true
  };


  const {
    payroll1099 = toCurrency(partTwoDefaults.pay1099),
    payrollW2 = toCurrency(partTwoDefaults.payW2),
    payrollWages = toCurrency(partTwoDefaults.payWages)
  } = formContext.getInputProviderValues();
  const medPercent = totContribution * totMedPercent;
  const medPayrollPercent = isOver25(formContext) ? (largeCompMedCont + empMedCont) : empMedCont;
  const famPercent = totContribution * totFamPercent;
  const totalPercent = medPercent + famPercent;
  const totalPayroll = getTotalPayroll(formContext);
  const payrollWagesCap = Number(numbro.unformat(payrollWages)) > socialSecCap ? socialSecCap : Number(numbro.unformat(payrollWages));
  // all workers annual
  const medCompPayment = medPercent * totalPayroll * medPayrollPercent;
  const famCompPayment = famPercent * totalPayroll;
  // one worker annual
  const medPayment = medPercent * payrollWagesCap * medPayrollPercent;
  const famPayment = famPercent * payrollWagesCap;

  const empMedContPercent = `${empMedCont * 100}%`;
  const isDisabled = () => !hasMassEmployees(formContext) || !getEmpCount(formContext);
  return(
    <Fragment>
      <fieldset>
        <Fragment>
          <Input id="payrollBase" defaultValue={partTwoDefaults.option} useOwnStateValue>
            <InputContext.Consumer>
              {
                (radioContext) => (
                  <div className="ma_input-group--mobile-1">
                    <InputRadioGroup
                      title={questionOne.question}
                      name="payrollBase"
                      outline
                      defaultSelected={partTwoDefaults.option}
                      errorMsg={questionOne.errorMsg}
                      radioButtons={questionOne.options}
                      onChange={({ selected }) => {
                        radioContext.setOwnValue(selected, () => {
                          onChangeOption(selected);
                        });
                      }}
                      disabled={isDisabled()}
                    />
                  </div>
                )
              }
            </InputContext.Consumer>
          </Input>
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
                  defaultValue={payrollW2}
                  min={0}
                  format={{
                    mantissa: 2,
                    trimMantissa: false,
                    thousandSeparated: true
                  }}
                  onChange={(value) => {
                    onChangePayW2(value);
                  }}
                  required
                  disabled={isDisabled() || !isOver50(formContext)}
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
                  defaultValue={payroll1099}
                  min={0}
                  format={{
                    mantissa: 2,
                    trimMantissa: false,
                    thousandSeparated: true
                  }}
                  onChange={(value) => {
                    onChangePay1099(value);
                  }}
                  disabled={isDisabled() || !isOver50(formContext)}
                  required
                  inline
                  step={1}
                />
              </div>
              <Collapse
                in={(hasMassEmployees(formContext) && (!!getEmpCount(formContext)) && (!!Number(totalPayroll)) && (isOver50(formContext) ? (!!Number(numbro.unformat(payroll1099))) : true))}
                dimension="height"
                className="ma__callout-alert"
              >
                <div className="ma__collapse">
                  <CalloutAlert theme="c-primary" icon={null}>
                    <HelpTip
                      text={`The estimated total annual contribution for the business is <strong>${toCurrency(famCompPayment + medCompPayment)}</strong>. `}
                      triggerText={[`<strong>${toCurrency(famCompPayment + medCompPayment)}</strong>`]}
                      id="help-tip-total-ann-cont"
                      theme="c-white"
                      helpText={isOver25(formContext) ? (
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
                                Leave: {toCurrency(medPercent * totalPayroll * medPayrollPercent)} = {toCurrency(totalPayroll)} X {isOver25(formContext) ? toPercentage(medPercent, 2) :
                                <span>{toPercentage(medPercent, 2)} X {empMedContPercent}</span>}
                        </div>
                      </HelpTip>
                    </div>
                    {!isOver25(formContext) &&
                    <Paragraph className="ma__help-tip-many" text={under25MedContDisclaimer.content} />}
                    <div className="ma__disclaimer">
                      <Paragraph
                        text={`<strong>Please note:</strong> If any of the covered individuals’ wages are above the SSI cap (<strong>${toCurrency(socialSecCap)}</strong>), the estimated total contribution above is an overestimation. To yield a more accurate estimate, substitute the SSI cap amount in place of any wages above the cap when summing your total payroll.`}
                      />
                    </div>
                  </CalloutAlert>
                </div>
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
                  defaultValue={payrollWages}
                  min={0}
                  format={{
                    mantissa: 2,
                    trimMantissa: false,
                    thousandSeparated: true
                  }}
                  onChange={(value) => {
                    onChangePayWages(value);
                  }}
                  required
                  inline
                  step={1}
                  disabled={isDisabled()}
                />
              </div>
              <Collapse
                in={hasMassEmployees(formContext) && payrollWages && !!payrollWages.length && !!getEmpCount(formContext) && !!(Number(numbro.unformat(payrollWages)))}
                dimension="height"
              >
                <div className="ma__collapse">
                  {payrollWages && !!payrollWages.length && (
                    <CalloutAlert theme="c-primary" icon={null}>
                      <div className="ma__help-tip-many">
                        <HelpTip
                          text={`The total estimated minimum annual contribution for this covered individual is <strong>${toCurrency(famPayment + medPayment)}</strong>. `}
                          triggerText={[`<strong>${toCurrency(famPayment + medPayment)}</strong>`]}
                          id="help-tip-tot-emp-ann-cont"
                          helpText={isOver25(formContext) ? (
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
                            Leave: {toCurrency(medPayment)} = {toCurrency(payrollWagesCap)} X {isOver25(formContext) ? toPercentage(medPercent, 2) :
                            <span>{toPercentage(medPercent, 2)} X {empMedContPercent}</span>}
                          </div>
                        </HelpTip>
                      </div>
                      {!isOver25(formContext) &&
                      <Paragraph className="ma__help-tip-many" text={under25MedContDisclaimer.content} />}
                      {Number(numbro.unformat(payrollWages)) > socialSecCap && (
                        <div className="ma__disclaimer">
                          <Paragraph
                            text={`<strong>Please note: </strong>Required contributions are capped at the Social Security cap, which is updated annually. It is <strong>${toCurrency(socialSecCap)}</strong> for 2019.`}
                          />
                        </div>
                      )}
                    </CalloutAlert>
                  )}
                </div>
              </Collapse>
            </Fragment>
          )}
        </Fragment>
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
