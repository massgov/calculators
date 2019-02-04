import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import { InputCurrency, InputRadioGroup, CalloutAlert, Collapse, HelpTip, FormContext } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import CalculatorOneVariables from '../../data/CalculatorOneVariables.json';
import PartTwoProps from '../../data/PartTwo.json';
import { toCurrency, toPercentage } from '../../utils';

import '../../css/index.css';

/**
 * Manually specify how to deal with changes to URL query param props.
 * We do this since we are not using a urlPropsQueryConfig.
 */
function mapUrlChangeHandlersToProps(props) {
  return{
    onChangeOption: (value) => replaceInUrlQuery('option', encode(UrlQueryParamTypes.string, value)),
    onChangePayW2: (value) => replaceInUrlQuery('payW2', encode(UrlQueryParamTypes.number, value)),
    onChangePay1099: (value) => replaceInUrlQuery('pay1099', encode(UrlQueryParamTypes.number, value)),
    onChangePayWages: (value) => replaceInUrlQuery('payWages', encode(UrlQueryParamTypes.number, value))
  };
}

const Part2 = (props) => {
  const {
    minEmployees, emp1099Fraction, smallMedPercent, smallFamPercent, largeMedPercent, largeFamPercent, socialSecCap
  } = CalculatorOneVariables.baseVariables;
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
 employeesW2, employees1099, payrollW2, payroll1099, payrollWages
} = context.value;
            const { payrollBase, hasMassEmployees } = context;
            const over50per = (Number(employees1099) / (Number(employeesW2) + Number(employees1099))) >= emp1099Fraction;
            const employeeCount = over50per ? (Number(employeesW2) + Number(employees1099)) : Number(employeesW2);
            const over25 = employeeCount >= minEmployees;
            const medPercent = over25 ? largeMedPercent : smallMedPercent;
            const famPercent = over25 ? largeFamPercent : smallFamPercent;
            const totalPercent = medPercent + famPercent;
            const totalPayroll = over50per ? (numbro.unformat(payrollW2) + numbro.unformat(payroll1099)) : (numbro.unformat(payrollW2));
            const totalPayment = totalPayroll * totalPercent;
            const totalPaymentEmp = totalPayment / employeeCount;
            const payrollWagesCap = numbro.unformat(payrollWages) > socialSecCap ? socialSecCap : numbro.unformat(payrollWages);
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
                    disabled={!hasMassEmployees || !employeeCount}
                  />
                </div>
                {
                (payrollBase === 'all') ? (
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
                        onChange={(e, value) => {
                          onChangePayW2(value);
                        }}
                        required
                        disabled={!employeeCount}
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
                        onChange={(e, value) => {
                          onChangePay1099(value);
                        }}
                        disabled={!employeeCount}
                        required
                        inline
                        step={1}
                      />
                    </div>
                    <Collapse in={hasMassEmployees && numbro.unformat(payrollW2) > 0 && (over50per ? numbro.unformat(payroll1099) > 0 : true)} dimension="height" className="ma__callout-alert">
                      <div className="ma__collapse">
                        <CalloutAlert theme="c-primary" icon={null}>
                          <HelpTip
                            textBefore="Total estimated annual contribution for your company is "
                            triggerText={`<strong>${toCurrency(totalPayment)}</strong> (<strong>${toCurrency(totalPaymentEmp)}</strong> per employee)`}
                            textAfter="."
                            id="help-tip-total-ann-cont"
                            labelID="help-tip-total-ann-cont-label"
                            theme="c-white"
                          >
                            <p className="ma__help-text">{toCurrency(totalPayment)} = {toCurrency(totalPayroll)} X {toPercentage(totalPercent, 2)}</p>

                          </HelpTip>
                          <HelpTip
                            textBefore="Of this amount, "
                            triggerText={`<strong>${toCurrency(medPercent * totalPayroll)}</strong>  is for medical leave and <strong>${toCurrency(famPercent * totalPayroll)}</strong>  is for family leave`}
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
                ) : (
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
                        onChange={(e, value) => {
                          onChangePayWages(value);
                        }}
                        required
                        inline
                        step={1}
                      />
                    </div>
                    <Collapse in={(payrollWages && numbro.unformat(payrollWages) > 0 && over25)} dimension="height" className="ma__callout-alert">
                      <div className="ma__collapse">
                        {payrollWages && numbro.unformat(payrollWages > 0) && over25 && (
                        <CalloutAlert theme="c-primary" icon={null}>
                          <HelpTip
                            textBefore="Total estimated annual contribution for this employee is "
                            triggerText={`<strong>${toCurrency(payrollWagesCap * totalPercent)}</strong>`}
                            textAfter="."
                            id="help-tip-tot-emp-ann-cont"
                            labelID="help-tip-tot-emp-cont-label"
                            helpText={<p className="ma__help-text">{toCurrency(payrollWagesCap * totalPercent)} = {toCurrency(payrollWagesCap)} X {toPercentage(totalPercent, 2)}</p>}
                            theme="c-white"
                          />
                          <HelpTip
                            textBefore="Of this amount, "
                            triggerText={`<strong>${toCurrency(medPercent * payrollWagesCap)}</strong> is for medical leave and <strong>${toCurrency(famPercent * payrollWagesCap)}</strong> is for family leave`}
                            textAfter="."
                            id="help-tip-medfam-emp-ann-cont"
                            labelID="help-tip-medfam-emp-cont-label"
                            helpText={<div className="ma__help-text"><p>Medical Leave: {toCurrency(medPercent * payrollWagesCap)} = {toCurrency(payrollWagesCap)} X {toPercentage(medPercent, 2)}</p><p>Family Leave: {toCurrency(famPercent * payrollWagesCap)} = {toCurrency(payrollWagesCap)} X {toPercentage(famPercent, 2)}</p></div>}
                            theme="c-white"
                          />
                          { numbro.unformat(payrollWages) > socialSecCap && (
                            <p>Because the employee's wages are over the social security cap, they do not contribute for income above <strong>{toCurrency(socialSecCap)}</strong>.</p>
                          )}
                        </CalloutAlert>
                      )}
                      </div>
                    </Collapse>
                  </Fragment>
                )
              }
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
