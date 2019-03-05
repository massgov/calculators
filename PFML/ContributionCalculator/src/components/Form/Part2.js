import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import { InputCurrency, InputRadioGroup, CalloutAlert, Collapse, HelpTip, FormContext, Paragraph } from '@massds/mayflower-react';
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
  onChangePayW2: (value) => replaceInUrlQuery('payW2', encode(UrlQueryParamTypes.number, value)),
  onChangePay1099: (value) => replaceInUrlQuery('pay1099', encode(UrlQueryParamTypes.number, value)),
  onChangePayWages: (value) => replaceInUrlQuery('payWages', encode(UrlQueryParamTypes.number, value))
});

const Part2 = (props) => {
  const {
    totContribution, totMedPercent, totFamPercent, socialSecCap, empMedCont, largeCompMedCont
  } = ContributionVariables.baseVariables;
  const {
    questionOne, questionTwo, questionThree, questionFour, under25MedContDisclaimer
  } = PartTwoProps;
  const {
    onChangeOption, onChangePayW2, onChangePay1099, onChangePayWages
  } = props;
  return(
    <FormContext.Consumer>
      {
          (context) => {
            const {
              over25,
              over50per,
              employeeCount,
              payrollBase,
              hasMassEmployees,
              value: {
                payrollW2, payroll1099, payrollWages, employeesW2
              }
            } = context;
            const medPercent = totContribution * totMedPercent;
            const medPayrollPercent = over25 ? (largeCompMedCont + empMedCont) : empMedCont;
            const famPercent = totContribution * totFamPercent;
            const totalPercent = medPercent + famPercent;
            let totalPayroll;
            if (payrollBase === 'all' && employeesW2 > 0) {
              totalPayroll = over50per ? (numbro.unformat(payroll1099) + numbro.unformat(payrollW2)) : numbro.unformat(payrollW2);
            } else if (payrollBase === 'all' && !(employeesW2 > 0)) {
              totalPayroll = numbro.unformat(payroll1099);
            } else {
              totalPayroll = numbro.unformat(payrollWages) > socialSecCap ? socialSecCap : numbro.unformat(payrollWages);
            }
            const payrollWagesCap = numbro.unformat(payrollWages) > socialSecCap ? socialSecCap : numbro.unformat(payrollWages);
            const disableInput = !hasMassEmployees || !employeeCount;
            // all workers annual
            const medCompPayment = medPercent * totalPayroll * medPayrollPercent;
            const famCompPayment = famPercent * totalPayroll;
            // one worker annual
            const medPayment = medPercent * payrollWagesCap * medPayrollPercent;
            const famPayment = famPercent * payrollWagesCap;

            const empMedContPercent = `${empMedCont * 100}%`;

            return(
              <fieldset>
                <div className="ma_input-group--mobile-1">
                  <InputRadioGroup
                    title={questionOne.question}
                    name="payrollBase"
                    outline
                    defaultSelected={payrollBase}
                    errorMsg={questionOne.errorMsg}
                    radioButtons={questionOne.options}
                    onChange={(e) => {
                        context.updateState({ payrollBase: e.selected });
                        onChangeOption(e.selected);
                      }
                    }
                    disabled={disableInput}
                  />
                </div>
                {payrollBase === 'all' && (
                  <Fragment>
                    <div key="payrollW2">
                      <InputCurrency
                        labelText={questionTwo.question}
                        id="payrollW2"
                        name="payrollW2"
                        width={0}
                        maxlength={200}
                        placeholder="e.g. $100,000"
                        errorMsg={questionTwo.errorMsg}
                        defaultValue={numbro.unformat(payrollW2)}
                        min={0}
                        format={{
                          mantissa: 2,
                          trimMantissa: false,
                          thousandSeparated: true
                        }}
                        onChange={(val) => {
                          context.updateState({
                            value: {
                              ...context.value,
                              payrollW2: val
                            }
                          });
                          onChangePayW2(val);
                        }}
                        required
                        disabled={disableInput || !employeesW2}
                        inline
                        step={1}
                      />
                    </div>
                    <div key="payroll1099">
                      <InputCurrency
                        labelText={questionThree.question}
                        id="payroll1099"
                        name="payroll1099"
                        width={0}
                        maxlength={200}
                        placeholder="e.g. $100,000"
                        errorMsg={questionThree.errorMsg}
                        defaultValue={numbro.unformat(payroll1099)}
                        min={0}
                        format={{
                          mantissa: 2,
                          trimMantissa: false,
                          thousandSeparated: true
                        }}
                        onChange={(val) => {
                          context.updateState({
                            value: {
                              ...context.value,
                              payroll1099: val
                            }
                          });
                          onChangePay1099(val);
                        }}
                        disabled={disableInput || !over50per}
                        required
                        inline
                        step={1}
                      />
                    </div>
                    <Collapse in={hasMassEmployees && employeeCount > 0 && totalPayroll && (over50per ? numbro.unformat(payroll1099) > 0 : true)} dimension="height" className="ma__callout-alert">
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
                          <p className="ma__help-tip-many">
                            <HelpTip
                              text={`Of this amount, <strong>${toCurrency(famPercent * totalPayroll)}</strong> is for family leave and <strong>${toCurrency(medPercent * totalPayroll * medPayrollPercent)}</strong> is for medical leave.`}
                              triggerText={[`<strong>${toCurrency(famPercent * totalPayroll)}</strong>`, `<strong>${toCurrency(medPercent * totalPayroll * medPayrollPercent)}</strong>`]}
                              id="help-tip-medfam-ann-cont"
                              theme="c-white"
                            >
                              <div className="ma__help-text">
                                Family Leave: {toCurrency(famPercent * totalPayroll)} = {toCurrency(totalPayroll)} X {toPercentage(famPercent, 2)}
                              </div>
                              <div className="ma__help-text">
                                Medical Leave: {toCurrency(medPercent * totalPayroll * medPayrollPercent)} = {toCurrency(totalPayroll)} X { over25 ? toPercentage(medPercent, 2) : <span>{toPercentage(medPercent, 2)} X {empMedContPercent}</span>}
                              </div>
                            </HelpTip>
                          </p>
                          { !over25 && <Paragraph className="ma__help-tip-many" text={under25MedContDisclaimer.content} />}
                          <div className="ma__disclaimer">
                            <Paragraph text={`<strong>Please note:</strong> If any of the covered individuals’ wages are above the SSI cap (<strong>${toCurrency(socialSecCap)}</strong>), the estimated total contribution above is an overestimation. To yield a more accurate estimate, substitute the SSI cap amount in place of any wages above the cap when summing your total payroll.`} />
                          </div>
                        </CalloutAlert>
                      </div>
                    </Collapse>
                  </Fragment>
                )}
                {payrollBase === 'one' && (
                  <Fragment>
                    <div key="payrollWages">
                      <InputCurrency
                        labelText={questionFour.question}
                        id="payrollWages"
                        name="payrollWages"
                        width={0}
                        maxlength={200}
                        placeholder="e.g. $100,000"
                        errorMsg={questionFour.errorMsg}
                        defaultValue={numbro.unformat(payrollWages)}
                        min={0}
                        format={{
                          mantissa: 2,
                          trimMantissa: false,
                          thousandSeparated: true
                        }}
                        onChange={(val) => {
                          context.updateState({
                            value: {
                              ...context.value,
                              payrollWages: val
                            }
                          });
                          onChangePayWages(val);
                        }}
                        required
                        inline
                        step={1}
                        disabled={disableInput}
                      />
                    </div>
                    <Collapse in={hasMassEmployees && (payrollWages && (employeeCount > 0) && (numbro.unformat(payrollWages) > 0))} dimension="height">
                      <div className="ma__collapse">
                        {payrollWages && (
                        <CalloutAlert theme="c-primary" icon={null}>
                          <p className="ma__help-tip-many">
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
                              <div className="ma__help-text">Family Leave: {toCurrency(famPayment)} = {toCurrency(payrollWagesCap)} X {toPercentage(famPercent, 2)}
                              </div>
                              <div className="ma__help-text">Medical Leave: {toCurrency(medPayment)} = {toCurrency(payrollWagesCap)} X { over25 ? toPercentage(medPercent, 2) : <span>{toPercentage(medPercent, 2)} X {empMedContPercent}</span>}
                              </div>
                            </HelpTip>
                          </p>
                          { !over25 && <Paragraph className="ma__help-tip-many" text={under25MedContDisclaimer.content} />}
                          { numbro.unformat(payrollWages) > socialSecCap && (
                            <div className="ma__disclaimer">
                              <Paragraph text={`<strong>Please note: </strong>Required contributions are capped at the Social Security cap, which is updated annually. It is <strong>${toCurrency(socialSecCap)}</strong> for 2019.`} />
                            </div>
                          )}
                        </CalloutAlert>
                      )}
                      </div>
                    </Collapse>
                  </Fragment>
                )}
              </fieldset>
            );
          }

        }
    </FormContext.Consumer>
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
