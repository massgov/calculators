import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import { InputCurrency, InputRadioGroup, CalloutAlert, Collapse, HelpTip, Paragraph, Input, InputContext, FormContext } from '@massds/mayflower-react';
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
  const partOneContext = useContext(InputContext);

  const {
    minEmployees, smallMedPercent, smallFamPercent, largeMedPercent, largeFamPercent, socialSecCap
  } = ContributionVariables.baseVariables;
  const {
    questionOne, questionTwo, questionThree, questionFour
  } = PartTwoProps;
  const {
    onChangeOption, onChangePayW2, onChangePay1099, onChangePayWages
  } = props;
  const partTwoDefaults = {
    payrollBase: props.option || 'all',
    payW2: props.payW2 || '0',
    pay1099: props.pay1099 || '0',
    payWages: props.payWages || '0'
  };

  return(
    <Input id="payrollBase" defaultValue={partTwoDefaults}>
      <InputContext.Consumer>
        {
          (inputContext) => {
            if (!formContext.hasId('part_one')) {
              return null;
            }
            const {
              payrollW2, payroll1099, payrollWages,
            } = formContext.getValues();
            const {
              mass_employees, over50: over50per, empCount: employeeCount
            } = partOneContext.getValue();
            const hasMassEmployees = (mass_employees) === 'yes';
            const over25 = employeeCount >= minEmployees;
            const medPercent = over25 ? largeMedPercent : smallMedPercent;
            const famPercent = over25 ? largeFamPercent : smallFamPercent;
            const totalPercent = medPercent + famPercent;
            const totalPayroll = over50per ? (numbro.unformat(payrollW2) + numbro.unformat(payroll1099)) : (numbro.unformat(payrollW2));
            const totalPayment = totalPayroll * totalPercent;
            const payrollWagesCap = numbro.unformat(payrollWages) > socialSecCap ? socialSecCap : numbro.unformat(payrollWages);
            const disableInput = !hasMassEmployees || !employeeCount;
            const { payrollBase, payW2, pay1099, payWages } = inputContext.getValue();
            return(
              <Fragment>
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
                        const newVal = Object.assign({}, formContext.getValue('payrollBase'), { payrollBase: e.selected });
                        inputContext.setValue(newVal, () => {
                          onChangeOption(newVal.payrollBase);
                        });
                      }
                      }
                      disabled={disableInput}
                    />
                  </div>
                  {payrollBase === 'all' && (
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
                          defaultValue={payW2}
                          min={0}
                          format={{
                            mantissa: 2,
                            trimMantissa: false,
                            thousandSeparated: true
                          }}
                          onChange={(value, id) => {
                            const newVal = Object.assign({}, formContext.getValue('payrollBase'), { payW2: value });
                            inputContext.setValue(newVal, () => {
                              onChangePayW2(value);
                            });
                          }}
                          disabled={disableInput}
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
                          defaultValue={pay1099}
                          min={0}
                          format={{
                            mantissa: 2,
                            trimMantissa: false,
                            thousandSeparated: true
                          }}
                          onChange={(value, id) => {
                            const newVal = Object.assign({}, formContext.getValue('payrollBase'), { pay1099: value });
                            inputContext.setValue(newVal, () => {
                              onChangePay1099(value);
                            });
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
                              textBefore="The total estimated annual contribution for your company is "
                              triggerText={`<strong>${toCurrency(totalPayment)}</strong>`}
                              textAfter="."
                              id="help-tip-total-ann-cont"
                              labelID="help-tip-total-ann-cont-label"
                              theme="c-white"
                            >
                              <p className="ma__help-text">{toCurrency(totalPayment)} = {toCurrency(totalPayroll)} X {toPercentage(totalPercent, 2)}</p>

                            </HelpTip>
                            <HelpTip
                              textBefore="Of this amount, "
                              triggerText={`<strong>${toCurrency(medPercent * totalPayroll)}</strong> is for medical leave and <strong>${toCurrency(famPercent * totalPayroll)}</strong> is for family leave.`}
                              textAfter="."
                              id="help-tip-medfam-ann-cont"
                              labelID="help-tip-medfam-ann-cont-label"
                              theme="c-white"
                            >
                              <div className="ma__help-text">
                                <p>Medical Leave: {toCurrency(medPercent * totalPayroll)} = {toCurrency(totalPayroll)} X {toPercentage(medPercent, 2)}</p>
                                <p>Family Leave: {toCurrency(famPercent * totalPayroll)} = {toCurrency(totalPayroll)} X {toPercentage(famPercent, 2)}</p>
                              </div>

                            </HelpTip>
                          </CalloutAlert>
                        </div>
                      </Collapse>
                    </Fragment>
                  )}
                  {payrollBase === 'one' && (
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
                          defaultValue={payWages}
                          min={0}
                          format={{
                            mantissa: 2,
                            trimMantissa: false,
                            thousandSeparated: true
                          }}
                          onChange={(value, id) => {
                            const newVal = Object.assign({}, formContext.getValue('payrollBase'), { payWages: value });
                            inputContext.setValue(newVal, () => {
                              onChangePayWages(value);
                            });
                          }}
                          required
                          inline
                          step={1}
                          disabled={disableInput}
                        />
                      </div>
                      <Collapse in={((payrollWages) && (employeeCount > 0) && (numbro.unformat(payrollWages) > 0))} dimension="height">
                        <div className="ma__collapse">
                          {payrollWages && (
                            <CalloutAlert theme="c-primary" icon={null}>
                              <HelpTip
                                textBefore="The total estimated annual contribution for this qualifying worker is "
                                triggerText={`<strong>${toCurrency(payrollWagesCap * totalPercent)}</strong>`}
                                textAfter="."
                                id="help-tip-tot-emp-ann-cont"
                                labelID="help-tip-tot-emp-cont-label"
                                helpText={`${toCurrency(payrollWagesCap * totalPercent)} = ${toCurrency(payrollWagesCap)} X ${toPercentage(totalPercent, 2)}`}
                                theme="c-white"
                              />
                              <HelpTip
                                textBefore="Of this amount, "
                                triggerText={`<strong>${toCurrency(medPercent * payrollWagesCap)}</strong> is for medical leave and <strong>${toCurrency(famPercent * payrollWagesCap)}</strong> is for family leave`}
                                textAfter="."
                                id="help-tip-medfam-emp-ann-cont"
                                labelID="help-tip-medfam-emp-cont-label"
                                helpText={<div><p>Medical Leave: {toCurrency(medPercent * payrollWagesCap)} = {toCurrency(payrollWagesCap)} X {toPercentage(medPercent, 2)}</p><p>Family Leave: {toCurrency(famPercent * payrollWagesCap)} = {toCurrency(payrollWagesCap)} X {toPercentage(famPercent, 2)}</p></div>}
                                theme="c-white"
                              />
                              { numbro.unformat(payrollWages) > socialSecCap && (
                                <Paragraph text={`Required contributions are capped at the Social Security cap, which is updated annually. It is <strong>${toCurrency(socialSecCap)}</strong> for 2019.`} />
                              )}
                            </CalloutAlert>
                          )}
                        </div>
                      </Collapse>
                    </Fragment>
                  )}
                </fieldset>
                {props.children(partOneContext)}
              </Fragment>
            );
          }
        }
      </InputContext.Consumer>
    </Input>
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
