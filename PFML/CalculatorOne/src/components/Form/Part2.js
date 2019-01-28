import React, { Fragment } from 'react';
import numbro from 'numbro';
import { InputCurrency, InputRadioGroup, CalloutAlert, InputText } from '@massds/mayflower-react';
import { FormContext } from './context';

import './index.css';

const toCurrency = (number) => {
  const currency = numbro(number).formatCurrency({thousandSeparated: true, mantissa: 2, spaceSeparated: false})
  return currency;
}

const Part2 = () => {
    return (
      <FormContext.Consumer>
        {
          (context) => {
            const onChange_employees_w2 = (e) => {
              context.updateState({ employees_w2: e })
            }
            const { employees_w2, employees_1099, payroll_w2, payroll_1099, payroll_wages, payroll_base, has_mass_employees } = context;
            const over50per = (employees_1099/employees_w2) > 0.5; 
            const employeeCount = +employees_w2 + (over50per ? +employees_1099 : 0);
            const over25 = employeeCount >= 25;
            const medPercent = over25 ? 0.0052 : 0.0031;
            const famPercent = 0.0011;
            const totalPercent = medPercent + famPercent;
            const totalPayroll = payroll_w2 + (over50per ? payroll_1099 : 0)
            const totalPayment = totalPayroll * totalPercent;
            
            return (
              <fieldset>
                <InputRadioGroup
                  title="Which option are you calculating your contribution based upon? "
                  name="payroll_base"
                  outline
                  defaultSelected="all"
                  errorMsg="You must selected your favorite plant."
                  radioButtons={[
                    {id: 'payroll_base_all',value: 'all',label: 'All Employees'},
                    {id: 'payroll_base_one',value: 'one',label: 'Individual Employee'}
                  ]}
                  onChange={(e) => {
                      context.updateState({ payroll_base: e.selected })
                    }
                  }
                  />
              {
                (payroll_base === 'all') ? (
                  <Fragment>
                    <div class="ma__input-group--inline">
                      <InputCurrency
                        labelText="What was your total payroll for W2 Employees last year?"
                        id="payroll_w2"
                        name="payroll_w2"
                        width={0}
                        maxlength={20}
                        placeholder="type something"
                        errorMsg="you did not type something"
                        defaultText="0"
                        max={1000000000}
                        min={0}
                        format={{
                          mantissa: 2,
                          trimMantissa: false,
                          thousandSeparated: true
                        }}
                        onChange={(e) => context.updateState({ payroll_w2: e })}
                        disabled = {!employeeCount}
                        />
                      </div>
                      <div class="ma__input-group--inline">
                        <InputCurrency
                          labelText="How much did you pay 1099 contractors last year?"
                          id="payroll_1099"
                          name="payroll_1099"
                          width={0}
                          maxlength={20}
                          placeholder="type something"
                          errorMsg="you did not type something"
                          defaultText="0"
                          max={1000000000}
                          min={0}
                          format={{
                            mantissa: 2,
                            trimMantissa: false,
                            thousandSeparated: true
                          }}
                          onChange={(e) => context.updateState({ payroll_1099: e })}
                          disabled = {!employeeCount}
                          />
                      </div>
                      {
                        (has_mass_employees && payroll_w2 &&  payroll_1099) && (
                          <CalloutAlert theme="c-primary" icon={null}>
                            <p>Total estimated annual contribution for your company is <strong>{toCurrency(totalPayment)}</strong>. ({toCurrency(totalPayment/employeeCount)} per employee) </p>
                            <p>Of this amount, <strong>{toCurrency(medPercent * totalPayroll)}</strong> is for medical leave and <strong>{toCurrency(famPercent * totalPayroll)}</strong> is for family leave.</p>
                          </CalloutAlert>
                        )
                      }
                    </Fragment>
                ) : (
                <Fragment>
                  <div class="ma__input-group--inline">
                    <InputCurrency
                      labelText="What was the employee’s gross wages last year?"
                      id="payroll_wages"
                      name="payroll_wages"
                      width={0}
                      maxlength={20}
                      placeholder="type something"
                      errorMsg="you did not type something"
                      defaultText="0"
                      max={1000000000}
                      min={0}
                      format={{
                        mantissa: 2,
                        trimMantissa: false,
                        thousandSeparated: true
                      }}
                      onChange={(e) => context.updateState({ payroll_wages: e })}
                      />
                    </div>
                    {
                      (has_mass_employees && payroll_wages && payroll_wages > 0 && over25) && (
                        <CalloutAlert theme="c-primary" icon={null}>
                          <p>Total estimated annual contribution for this employee is <strong>{toCurrency(payroll_wages * 0.0063)}</strong> </p>
                        </CalloutAlert>
                      )
                    }
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
