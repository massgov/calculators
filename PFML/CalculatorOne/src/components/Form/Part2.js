import React, { Fragment } from 'react';
import { InputCurrency, InputRadioGroup, CalloutAlert, Collapse, HelpTip } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import { FormContext } from './context';
import CalculatorOneVariables from '../../data/CalculatorOneVariables.json';
import PartTwoProps from '../../data/PartTwo.json';
import { toCurrency, toPercentage } from '../../utils';

import './index.css';

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
    questionOne, questionTwo, questionThree, questionFour, output
  } = PartTwoProps;
  const {
    onChangeOption, onChangePayW2, onChangePay1099, onChangePayWages
  } = props;
  return(
    <FormContext.Consumer>
      {
          (context) => {
            const {
 employees_w2, employees_1099, payroll_w2, payroll_1099, payroll_wages, payroll_base, has_mass_employees
} = context;
            const over50per = (employees_1099 / employees_w2) > emp1099Fraction;
            const employeeCount = over50per ? (employees_w2 + employees_1099) : employees_w2;
            const over25 = employeeCount >= minEmployees;
            const medPercent = over25 ? largeMedPercent : smallMedPercent;
            const famPercent = over25 ? largeFamPercent : smallFamPercent;
            const totalPercent = medPercent + famPercent;
            const totalPayroll = over50per ? (Number(payroll_w2) + Number(payroll_1099)) : (Number(payroll_w2));
            const totalPayment = totalPayroll * totalPercent;
            const totalPaymentEmp = totalPayment / employeeCount;
            const payroll_wages_cap = context.payroll_wages > socialSecCap ? socialSecCap : payroll_wages;
            return(
              <fieldset>
                <div className="ma_input-group--mobile-1">
                  <InputRadioGroup
                    title={questionOne.question}
                    name="payroll_base"
                    outline
                    defaultSelected={context.payroll_base}
                    errorMsg={questionOne.errorMsg}
                    radioButtons={questionOne.options}
                    onChange={(e) => {
                        context.updateState({ payroll_base: e.selected });
                        onChangeOption(e.selected);
                      }
                    }
                    disabled={!has_mass_employees || !employeeCount}
                  />
                </div>
                {
                (payroll_base === 'all') ? (
                  <Fragment>
                    <div key="payroll_w2">
                      <InputCurrency
                        labelText={questionTwo.question}
                        id="payroll_w2"
                        name="payroll_w2"
                        width={0}
                        maxlength={200}
                        placeholder="e.g. $100,000"
                        errorMsg={questionTwo.errorMsg}
                        defaultValue={context.payroll_w2}
                        min={0}
                        format={{
                          mantissa: 2,
                          trimMantissa: false,
                          thousandSeparated: true
                        }}
                        onChange={(e, value) => {
                          context.updateState({ payroll_w2: value });
                          onChangePayW2(value);
                        }}
                        required
                        disabled={!employeeCount}
                        inline
                        step={1}
                      />
                    </div>
                    <div key="payroll_1099">
                      <InputCurrency
                        labelText={questionThree.question}
                        id="payroll_1099"
                        name="payroll_1099"
                        width={0}
                        maxlength={200}
                        placeholder="e.g. $100,000"
                        errorMsg={questionThree.errorMsg}
                        defaultValue={context.payroll_1099}
                        min={0}
                        format={{
                          mantissa: 2,
                          trimMantissa: false,
                          thousandSeparated: true
                        }}
                        onChange={(e, value) => {
                          context.updateState({ payroll_1099: value });
                          onChangePay1099(value);
                        }}
                        disabled={!employeeCount}
                        required
                        inline
                        step={1}
                      />
                    </div>
                    <Collapse in={has_mass_employees && payroll_w2 && (over50per ? payroll_1099 > 0 : payroll_1099 >= 0)} dimension="height" className="ma__callout-alert">
                      <div className="ma__collapse">
                        <CalloutAlert theme="c-primary" icon={null}>
                          <HelpTip
                            textBefore="Total estimated annual contribution for your company is "
                            triggerText={`<strong>${toCurrency(totalPayment)}</strong> (<strong>${toCurrency(totalPaymentEmp)}</strong> per employee)`}
                            textAfter="."
                            id="help-tip-total-ann-cont"
                            labelID="help-tip-total-ann-cont-label"
                            helpText={<p className="ma__help-text">{toCurrency(totalPayment)} = {toCurrency(totalPayroll)} X {toPercentage(totalPercent, 2)}</p>}
                            theme="c-white"
                          />
                          <HelpTip
                            textBefore="Of this amount, "
                            triggerText={`<strong>${toCurrency(medPercent * totalPayroll)}</strong>  is for medical leave and <strong>${toCurrency(famPercent * totalPayroll)}</strong>  is for family leave`}
                            textAfter="."
                            id="help-tip-medfam-ann-cont"
                            labelID="help-tip-medfam-ann-cont-label"
                            helpText={<div className="ma__help-text"><p>Medical Leave: {toCurrency(medPercent * totalPayroll)} = {toCurrency(totalPayroll)} X {toPercentage(medPercent, 2)}</p><p>Family Leave: {toCurrency(famPercent * totalPayroll)} = {toCurrency(totalPayroll)} X {toPercentage(famPercent, 2)}</p></div>}
                            theme="c-white"
                          />
                        </CalloutAlert>
                      </div>
                    </Collapse>
                  </Fragment>
                ) : (
                  <Fragment>
                    <div key="payroll_wages">
                      <InputCurrency
                        labelText={questionFour.question}
                        id="payroll_wages"
                        name="payroll_wages"
                        width={0}
                        maxlength={200}
                        placeholder="e.g. $100,000"
                        errorMsg={questionFour.errorMsg}
                        defaultValue={context.payroll_wages}
                        min={0}
                        format={{
                        mantissa: 2,
                        trimMantissa: false,
                        thousandSeparated: true
                      }}
                        onChange={(e, value) => {
                        context.updateState({ payroll_wages: value });
                        onChangePayWages(value);
                      }}
                        required
                        inline
                        step={1}
                      />
                    </div>
                    <Collapse in={payroll_wages && payroll_wages > 0 && over25} dimension="height" className="ma__callout-alert">
                      <div className="ma__collapse">
                        {payroll_wages && payroll_wages > 0 && over25 && (
                        <CalloutAlert theme="c-primary" icon={null}>
                          <HelpTip
                            textBefore="Total estimated annual contribution for this employee is "
                            triggerText={`<strong>${toCurrency(payroll_wages_cap * totalPercent)}</strong>`}
                            textAfter="."
                            id="help-tip-tot-emp-ann-cont"
                            labelID="help-tip-tot-emp-cont-label"
                            helpText={<p className="ma__help-text">{toCurrency(payroll_wages_cap * totalPercent)} = {toCurrency(payroll_wages_cap)} X {toPercentage(totalPercent, 2)}</p>}
                            theme="c-white"
                          />
                          <HelpTip
                            textBefore="Of this amount, "
                            triggerText={`<strong>${toCurrency(medPercent * payroll_wages_cap)}</strong> is for medical leave and <strong>${toCurrency(famPercent * payroll_wages_cap)}</strong> is for family leave`}
                            textAfter="."
                            id="help-tip-medfam-emp-ann-cont"
                            labelID="help-tip-medfam-emp-cont-label"
                            helpText={<div className="ma__help-text"><p>Medical Leave: {toCurrency(medPercent * payroll_wages_cap)} = {toCurrency(payroll_wages_cap)} X {toPercentage(medPercent, 2)}</p><p>Family Leave: {toCurrency(famPercent * payroll_wages_cap)} = {toCurrency(payroll_wages_cap)} X {toPercentage(famPercent, 2)}</p></div>}
                            theme="c-white"
                          />
                          { payroll_wages > socialSecCap && (
                            <p>Because the employess wages are over the social security cap, they do not contribute for income above <strong>{toCurrency(socialSecCap)}</strong>.</p>
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


export default addUrlProps({ mapUrlChangeHandlersToProps })(Part2);
