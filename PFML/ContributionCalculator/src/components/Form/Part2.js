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
    minEmployees, emp1099Fraction, smallMedPercent, smallFamPercent, largeMedPercent, largeFamPercent, socialSecCap
  } = ContributionVariables.baseVariables;
  const {
    questionOne, questionTwo, questionThree, questionFour
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
              value: {employeesW2, employees1099, payrollW2, payroll1099, payrollWages}
            } = context;
            const { payrollBase, hasMassEmployees } = context;
            const over50per = (Number(employees1099) / (Number(employeesW2) + Number(employees1099))) >= emp1099Fraction;
            const employeeCount = over50per ? (Number(employeesW2) + Number(employees1099)) : Number(employeesW2);
            const medPercent = over25 ? largeMedPercent : smallMedPercent;
            const famPercent = over25 ? largeFamPercent : smallFamPercent;
            const totalPercent = medPercent + famPercent;
            const totalPayroll = over50per ? (numbro.unformat(payrollW2) + numbro.unformat(payroll1099)) : (numbro.unformat(payrollW2));
            const totalPayment = totalPayroll * totalPercent;
            const payrollWagesCap = numbro.unformat(payrollWages) > socialSecCap ? socialSecCap : numbro.unformat(payrollWages);
            const disableInput = !hasMassEmployees || !employeeCount;
            const under25MedContDisclaimer = `*Employers with fewer than 25 qualifying workers are not required to pay the employer share (60%) of the medical leave contribution. Their qualifying workers will pay up to <strong>40%</strong> of the medical leave unless the employer chooses to contribute on their behalf. </p>`;
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
                        disabled={disableInput}
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
                    <Collapse in={hasMassEmployees && numbro.unformat(payrollW2) > 0 && (over50per ? numbro.unformat(payroll1099) > 0 : true)} dimension="height" className="ma__callout-alert">
                      <div className="ma__collapse">
                        <CalloutAlert theme="c-primary" icon={null}>
                          <HelpTip
                            text={`The total estimated annual contribution for your company is <strong>${toCurrency(totalPayment)}</strong>. `}
                            triggerText={[`<strong>${toCurrency(totalPayment)}</strong>`]}
                            id="help-tip-total-ann-cont"
                            theme="c-white"
                          >
                            <p className="ma__help-text">{toCurrency(totalPayment)} = {toCurrency(totalPayroll)} X {toPercentage(totalPercent, 2)}</p>

                          </HelpTip>
                          <HelpTip
                            text={`Of this amount, <strong>${toCurrency(famPercent * totalPayroll)}</strong> is for family leave and <strong>${toCurrency(medPercent * totalPayroll * (over25 ? 1 : 0.4))}</strong> is for medical leave.`}
                            triggerText={[`<strong>${toCurrency(famPercent * totalPayroll)}</strong>`,`<strong>${toCurrency(medPercent * totalPayroll * (over25 ? 1 : 0.4))}</strong>`]}
                            id="help-tip-medfam-ann-cont"
                            theme="c-white"
                          >
                            <div className="ma__help-text">
                              Family Leave: {toCurrency(famPercent * totalPayroll)} = {toCurrency(totalPayroll)} X {toPercentage(famPercent, 2)}
                            </div>  
                            <div className="ma__help-text">
                              Medical Leave: {toCurrency(medPercent * totalPayroll * (over25 ? 1 : 0.4))} = {toCurrency(totalPayroll)} X 
                              { over25 ? toPercentage(medPercent, 2) : <span>{toPercentage(medPercent, 2)} X 40%</span>}
                              { !over25 && (
                                <div className="ma__disclaimer">
                                  <Paragraph text={under25MedContDisclaimer} />
                                </div>
                              )}
                            </div>
                          </HelpTip>
                          { numbro.unformat(payrollWages) > socialSecCap && (
                            <div className='ma__disclaimer'>
                              <Paragraph text={`<strong>SSI Cap Disclaimer:</strong> If any of your qualifying workers’ wages are above the SSI cap <strong>${toCurrency(socialSecCap)}</strong> your total contribution is an overestimation. To yield a more accurate estimate, use the SSI cap amount in place of any wages that are above the cap when calculating your total payroll above.`} />
                            </div>
                          )}
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
                    <Collapse in={(payrollWages && (employeeCount > 0) && (numbro.unformat(payrollWages) > 0))} dimension="height">
                      <div className="ma__collapse">
                        {payrollWages && (
                        <CalloutAlert theme="c-primary" icon={null}>
                          <HelpTip
                            text={`The total estimated annual contribution for this qualifying worker is <strong>${toCurrency(payrollWagesCap * totalPercent)}</strong>. `}
                            triggerText={[`<strong>${toCurrency(payrollWagesCap * totalPercent)}</strong>`]}
                            id="help-tip-tot-emp-ann-cont"
                            helpText={[`${toCurrency(payrollWagesCap * totalPercent)} = ${toCurrency(payrollWagesCap)} X ${toPercentage(totalPercent, 2)}`]}
                            theme="c-white"
                          >
                          </HelpTip>
                          <HelpTip
                            text={`Of this amount, <strong>${toCurrency(famPercent * payrollWagesCap)}</strong> is for family leave. and <strong>${toCurrency(medPercent * payrollWagesCap * (over25 ? 1 : 0.4))}</strong> is for medical leave.`}
                            triggerText={[` <strong>${toCurrency(famPercent * payrollWagesCap)}</strong>`, `<strong>${toCurrency(medPercent * payrollWagesCap * (over25 ? 1 : 0.4))}</strong>`]}
                            id="help-tip-medfam-emp-ann-cont"
                            theme="c-white"
                          >
                            <div className="ma__help-text">Family Leave: {toCurrency(famPercent * payrollWagesCap)} = {toCurrency(payrollWagesCap)} X {toPercentage(famPercent, 2)}
                            </div>
                            <div className="ma__help-text">Medical Leave: {toCurrency(medPercent * payrollWagesCap * (over25 ? 1 : 0.4))} = {toCurrency(payrollWagesCap)} X 
                            { over25 ? toPercentage(medPercent, 2) : <span>{toPercentage(medPercent, 2)} X 40%</span>}
                            { !over25 && (
                              <div className="ma__disclaimer">
                                <Paragraph text={under25MedContDisclaimer} />
                              </div>
                            )}
                            </div>
                            
                          </HelpTip>
                          { numbro.unformat(payrollWages) > socialSecCap && (
                            <div className="ma__disclaimer">
                              <Paragraph text={`<strong>SSI Cap Disclaimer: </strong>Required contributions are capped at the Social Security cap, which is updated annually. It is <strong>${toCurrency(socialSecCap)}</strong> for 2019.`} />
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
