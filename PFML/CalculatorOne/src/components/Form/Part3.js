import React, { Component, Fragment } from 'react';
import { InputCurrency, InputRadioGroup, CalloutAlert, InputText, Collapse, SelectBox } from '@massds/mayflower-react';
import { FormContext } from './context';
import InputRange from 'react-input-range';
import numbro from 'numbro';
import 'react-input-range/lib/css/index.css';

import './index.css';


class Part3 extends React.Component {
  constructor(props) {
    super(props);
    /*this.state = {
      activeTab: null,
      activeContent: null,
      // eslint-disable-next-line react/no-unused-state
      setActiveTab: this.setActiveTab
    };*/
  }
  
  toCurrency = (number) => {
    const currency = numbro(number).formatCurrency({thousandSeparated: true, mantissa: 2, spaceSeparated: false})
    return currency;
  }
  render(){
    return (
      <FormContext.Consumer>
        {
          (context) => {
            const { has_mass_employees, employees_w2, employees_1099, payroll_w2, payroll_1099, payroll_wages, med_leave_cont, fam_leave_cont } = context;
            const over50per = (employees_1099/employees_w2) > 0.5; 
            const employeeCount = over50per ? (+employees_w2 + +employees_1099) : +employees_w2;
            const over25 = employeeCount >= 25; 
            const medPercent = over25 ? 0.0052 : 0.0031;
            const famPercent = 0.0011;
            const totalPercent = medPercent + famPercent;
            const minMed = over25 ? 0.6 : 0;
            const timePeriodOptions = [
              {text: 'Year', value: 1},
              {text: 'Quarter', value: 4},
              {text: 'Week', value: 52}
            ];
            const totalPayroll = context.payroll_base === 'all' ? (payroll_w2 + (over50per ? payroll_1099 : 0)) : payroll_wages;
            const medLeave = totalPayroll * medPercent;
            const famLeave = totalPayroll * famPercent;

            const onMedChange = (value) => {
              const medCont = value > minMed ? value : minMed;
              context.updateState({
                med_leave_cont: medCont
              })
            }
            const onFamChange = (value) => {
              const famCont = value;
              context.updateState({
                fam_leave_cont: famCont
              })
            }

            const medLeaveComp = medLeave * context.med_leave_cont;
            const famLeaveComp = famLeave * context.fam_leave_cont;
            const medLeaveEmp = medLeave * (1-context.med_leave_cont);
            const famLeaveEmp = famLeave * (1-context.fam_leave_cont);

            const getTimeValue = (text) => {
              let value;
              timePeriodOptions.forEach(period => {
                if(period.text === text) {
                  value = period.value
                }
              })
              return value;
            }
            
            const disable = has_mass_employees && employees_w2 && employees_1099 && ((payroll_w2 && payroll_1099 && context.payroll_base === 'all') || (context.payroll_base === 'one' && payroll_wages)) ? false : true;
            return (
              <React.Fragment>
                <fieldset>
                  <legend className="ma__label">How will you split liability with your employess?</legend>
                  <label className="ma__label">Medical Leave</label>
                  <InputRange
                    maxValue={1}
                    minValue={0}
                    step={0.01}
                    value={context.med_leave_cont >= minMed ? context.med_leave_cont : minMed}
                    formatLabel={value => `${(value*100).toFixed(0)}%`}
                    onChange={value => onMedChange(value)}
                    disabled={disable}
                  />
                  <label className="ma__label">Family Leave</label>
                  <InputRange
                    maxValue={1}
                    minValue={0}
                    step={0.01}
                    value={context.fam_leave_cont || 0}
                    formatLabel={value => `${(value*100).toFixed(0)}%`}
                    onChange={value => onFamChange(value)}
                    disabled={disable}
                  />  
                </fieldset>
                <SelectBox
                    label="Paid Family Medical Leave By"
                    stackLabel={false}
                    required
                    id="color-select"
                    options={timePeriodOptions}
                    selected={context.time_period || 'Year'}
                    onChangeCallback={({selected}) => {
                      context.updateState({ 
                        time_period: selected,
                        time_value: getTimeValue(selected)
                      })
                    }}
                    className="ma__select-box js-dropdown"
                  />
                { !disable && context.payroll_base === 'all' && (
                  <table className="ma__table">
                    <tr>
                      <th>Contribution</th>
                      <th></th>
                      <th>Medical Leave</th>
                      <th>Family Leave</th>
                      <th>Total</th>
                    </tr>
                    <tr>
                      <th rowspan="2">You will pay:</th>
                      <td className="ma__td--group">Total</td>
                      <td>{this.toCurrency(medLeaveComp/context.time_value)}</td>
                      <td>{this.toCurrency(famLeaveComp/context.time_value)}</td>
                      <td>{this.toCurrency((medLeaveComp + famLeaveComp)/context.time_value)}</td>
                    </tr>
                    <tr>
                      <td className="ma__td--group">Per Employee</td>
                      <td>{this.toCurrency((medLeaveComp)/employeeCount)}</td>
                      <td>{this.toCurrency((famLeaveComp)/employeeCount)}</td>
                      <td>{this.toCurrency((medLeaveComp + famLeaveComp)/employeeCount/context.time_value)}</td>
                    </tr> 
                    <tr>
                      <th rowspan="2">Your Employees will pay:</th>
                      <td className="ma__td--group">Total</td>
                      <td>{this.toCurrency(medLeaveEmp/context.time_value)}</td>
                      <td>{this.toCurrency(famLeaveEmp/context.time_value)}</td>
                      <td>{this.toCurrency((medLeaveEmp + famLeaveEmp)/context.time_value)}</td>
                    </tr>
                    <tr>
                      <td className="ma__td--group">Per Employee</td>
                      <td>{this.toCurrency(medLeaveEmp/employeeCount/context.time_value)}</td>
                      <td>{this.toCurrency(famLeaveEmp/employeeCount/context.time_value)}</td>
                      <td>{this.toCurrency((medLeaveEmp + famLeaveEmp)/employeeCount/context.time_value)}</td>
                    </tr>
                  </table>
                )}
                { !disable && context.payroll_base === 'one' && (
                  <table className="ma__table">
                    <tr>
                      <th>Contribution</th>
                      <th>Medical Leave</th>
                      <th>Family Leave</th>
                      <th>Total</th>
                    </tr>
                    <tr>
                      <td>You will pay:</td>
                      <td>{this.toCurrency(medLeaveComp/context.time_value)}</td>
                      <td>{this.toCurrency(famLeaveComp/context.time_value)}</td>
                      <td>{this.toCurrency((medLeaveComp + famLeaveComp)/context.time_value)}</td>
                    </tr>
                    <tr>
                      <td>Your Employee will pay:</td>
                      <td>{this.toCurrency(medLeaveEmp/context.time_value)}</td>
                      <td>{this.toCurrency(famLeaveEmp/context.time_value)}</td>
                      <td>{this.toCurrency((medLeaveEmp + famLeaveEmp)/context.time_value)}</td>
                    </tr>
                    <tr>
                      <td className="ma__td--group">Total payment:</td>
                      <td>{this.toCurrency(medLeave/context.time_value)}</td>
                      <td>{this.toCurrency(famLeave/context.time_value)}</td>
                      <td>{this.toCurrency((medLeave + famLeave)/context.time_value)}</td>
                    </tr>
                  </table>
                )}
              </React.Fragment>
            )
          }
        }
      </FormContext.Consumer>
    ); 
  }  
}


export default Part3;
