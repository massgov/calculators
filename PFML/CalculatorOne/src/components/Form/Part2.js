import React, { Fragment } from 'react';
import numbro from 'numbro';
import { InputCurrency, InputRadioGroup, CalloutAlert, Collapse } from '@massds/mayflower-react';
import { FormContext } from './context';
import CalculatorOneVariables from '../../data/CalculatorOneVariables.json';
import PartTwoProps from '../../data/PartTwo.json';

import './index.css';

const toCurrency = (number) => {
  const currency = numbro(number).formatCurrency({thousandSeparated: true, mantissa: 2, spaceSeparated: false})
  return currency;
}

const Part2 = () => {
    const { minEmployees, emp1099Fraction, smallMedPercent, smallFamPercent, largeMedPercent, largeFamPercent, socialSecCap } = CalculatorOneVariables.baseVariables;
    const { questionOne, questionTwo, questionThree, questionFour, output } = PartTwoProps;
    return (
      <FormContext.Consumer>
        {
          (context) => {
            const { employees_w2, employees_1099, payroll_w2, payroll_1099, payroll_wages, payroll_base, has_mass_employees } = context;
            const over50per = (employees_1099/employees_w2) > emp1099Fraction; 
            const employeeCount = over50per ? (employees_w2 + employees_1099) : employees_w2;
            const over25 = employeeCount >= minEmployees;
            const medPercent = over25 ? largeMedPercent : smallMedPercent;
            const famPercent = over25 ? largeFamPercent : smallFamPercent;
            const totalPercent = medPercent + famPercent;
            const totalPayroll = over50per ? (Number(payroll_w2) + Number(payroll_1099)) : (Number(payroll_w2));
            const totalPayment = totalPayroll * totalPercent;
            const totalPaymentEmp = totalPayment / employeeCount;
            const payroll_wages_cap = context.payroll_wages > socialSecCap ? socialSecCap : payroll_wages;
            return (
              <fieldset>
                <div className="ma_input-group--mobile-1">
                  <InputRadioGroup
                    title={questionOne.question}
                    name="payroll_base"
                    outline
                    defaultSelected="all"
                    errorMsg={questionOne.errorMsg}
                    radioButtons={questionOne.options}
                    onChange={(e) => {
                        context.updateState({ payroll_base: e.selected })
                      }
                    }
                    disabled={!has_mass_employees || !employeeCount}
                  />
                </div>
              {
                (payroll_base === 'all') ? (
                  <Fragment>
                    <div className="ma__input-group--inline" key="payroll_w2">
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
                        onChange={(e, value) => context.updateState({payroll_w2: value })}
                        required={true}
                        disabled = {!employeeCount}
                        />
                      </div>
                      <div className="ma__input-group--inline" key="payroll_1099">
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
                          onChange={(e, value)  => context.updateState({ payroll_1099: value })}
                          disabled = {!employeeCount}
                          required={true}
                          />
                      </div>
                      <Collapse in={has_mass_employees && payroll_w2 && (over50per ? payroll_1099 > 0 : payroll_1099 >= 0)} dimension="height" className="ma__callout-alert">
                        <div className="ma__collapse">
                          <CalloutAlert theme="c-primary" icon={null}>
                            <p>Total estimated annual contribution for your company is <strong>{toCurrency(totalPayment)}</strong> (<strong>{toCurrency(totalPaymentEmp)}</strong> per employee).</p>
                            <p>Of this amount, <strong>{toCurrency(medPercent * totalPayroll)}</strong> is for medical leave and <strong>{toCurrency(famPercent * totalPayroll)}</strong> is for family leave.</p>
                          </CalloutAlert>
                        </div>
                      </Collapse>
                    </Fragment>
                ) : (
                <Fragment>
                  <div className="ma__input-group--inline" key="payroll_wages">
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
                      onChange={(e, value) => context.updateState({ payroll_wages: value })}
                      required={true}
                      />
                    </div>
                    <Collapse in={payroll_wages && payroll_wages > 0 && over25} dimension="height" className="ma__callout-alert">
                      <div className="ma__collapse">
                        <CalloutAlert theme="c-primary" icon={null}>
                          <p>Total estimated annual contribution for this employee is <strong>{toCurrency(payroll_wages_cap * totalPercent)}</strong> </p>
                          <p>Of this amount, <strong>{toCurrency(medPercent * payroll_wages_cap)}</strong> is for medical leave and <strong>{toCurrency(famPercent * payroll_wages_cap)}</strong> is for family leave.</p>
                          { payroll_wages > socialSecCap && (
                            <p>Because the employess wages are over the social security cap, they do not contribute for income above <strong>{toCurrency(socialSecCap)}</strong>.</p>
                          )}
                        </CalloutAlert>
                      </div>
                    </Collapse>
                  </Fragment>
                )
              }

              </fieldset>
            )
          }
          
        }
      </FormContext.Consumer>
    );
}


export default Part2;
