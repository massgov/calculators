import React from 'react';
import { SelectBox, Input, InputSlider } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import { FormContext } from './context';
import { toCurrency } from '../../utils';
import CalculatorOneVariables from '../../data/CalculatorOneVariables.json';
import './index.css';

// to replace with react slider when lands
import 'react-input-range/lib/css/index.css';
import InputRange from 'react-input-range';

/**
 * Manually specify how to deal with changes to URL query param props.
 * We do this since we are not using a urlPropsQueryConfig.
 */
function mapUrlChangeHandlersToProps(props) {
  return {
    onChangeMedCont: (value) => replaceInUrlQuery('medCont', encode(UrlQueryParamTypes.number, value)),
    onChangeFamCont: (value) => replaceInUrlQuery('famCont', encode(UrlQueryParamTypes.number, value)),
    onChangeTimePeriod: (value) => replaceInUrlQuery('timePeriod', encode(UrlQueryParamTypes.string, value)),
    onChangeTimeValue: (value) => replaceInUrlQuery('timeValue', encode(UrlQueryParamTypes.number, value)),
  }
}

const Part3 = (props) => {
  const { minEmployees, emp1099Fraction, smallMedPercent, smallFamPercent, largeMedPercent, largeFamPercent, largeCompMedCont, smallCompMedCont, weeksPerYear, quartersPerYear, socialSecCap } = CalculatorOneVariables.baseVariables;
  const { onChangeMedCont, onChangeFamCont, onChangeTimeValue, onChangeTimePeriod } = props;
  return (
      <FormContext.Consumer>
        {
          (context) => {
            const { has_mass_employees, employees_w2, employees_1099, payroll_w2, payroll_1099, payroll_wages, med_leave_cont, fam_leave_cont } = context;
            const over50per = (employees_1099/employees_w2) > emp1099Fraction;
            const employeeCount = over50per ? (+employees_w2 + +employees_1099) : +employees_w2;
            const over25 = employeeCount >= minEmployees;
            const medPercent = over25 ? largeMedPercent : smallMedPercent;
            const famPercent = over25 ? largeFamPercent : smallFamPercent;
            const totalPercent = medPercent + famPercent;
            const minMed = over25 ? largeCompMedCont : smallCompMedCont;
            const timePeriodOptions = [
              {text: 'Year', value: 1},
              {text: 'Quarter', value: quartersPerYear},
              {text: 'Week', value: weeksPerYear}
            ];
            const totalPayroll = context.payroll_base === 'all' ? (Number(payroll_w2) + (over50per ? Number(payroll_1099) : 0)) : (Number(payroll_wages) > socialSecCap ? socialSecCap : Number(payroll_wages));
            const medLeave = totalPayroll * medPercent;
            const famLeave = totalPayroll * famPercent;

            const onMedChange = (value) => {
              const medCont = value > minMed ? value : minMed;
              context.updateState({
                med_leave_cont: medCont
              })
              onChangeMedCont(medCont)
            }
            const onFamChange = (value) => {
              const famCont = value;
              context.updateState({
                fam_leave_cont: famCont
              })
              onChangeFamCont(value)
            }
            const getTimeValue = (text) => {
              let value;
              timePeriodOptions.forEach(period => {
                if(period.text === text) {
                  value = period.value
                }
              })
              return value;
            }

            const medLeaveComp = medLeave * context.med_leave_cont;
            const famLeaveComp = famLeave * context.fam_leave_cont;
            const medLeaveEmp = medLeave * (1-context.med_leave_cont);
            const famLeaveEmp = famLeave * (1-context.fam_leave_cont);
            const disable = has_mass_employees && employees_w2 && (employees_1099 >= 0) && ((payroll_w2 && (over50per ? payroll_1099 > 0 : payroll_1099 >= 0) && context.payroll_base === 'all') || (context.payroll_base === 'one' && payroll_wages)) ? false : true;

            return (
              <React.Fragment>
                {!disable && (
                  <React.Fragment>
                    <fieldset>
                      <legend className="ma__label">How will you split liability with your employess?</legend>
                      <InputSlider
                        labelText="Family Leave"
                        id="text-input"
                        required
                        defaultValue="0"
                        axis="x"
                        max={1}
                        min={0}
                        step={0.01}
                        ticks={[['0','0%'],['1','100%'],]}
                        domain={[0,1]}
                        onChange={value => console.log(value)}
                      />
                      <InputSlider
                        labelText="Medical Leave"
                        id="text-input"
                        required
                        defaultValue="0"
                        axis="x"
                        max={1}
                        min={0}
                        step={0.01}
                        ticks={[['0','0%'],['1','100%'],['0.6','Minimum requirement']]}
                        domain={[0,1]}
                        onChange={value => onMedChange(value)}
                      />
                    </fieldset>
                    <h2 className="ma__table-heading">
                      <SelectBox
                        label="Paid Family Medical Leave By"
                        stackLabel={false}
                        required
                        id="color-select"
                        options={timePeriodOptions}
                        selected={context.time_period || 'Year'}
                        onChangeCallback={({selected}) => {
                          const value = getTimeValue(selected);
                          context.updateState({
                            time_period: selected,
                            time_value: value
                          })
                          onChangeTimeValue(value)
                          onChangeTimePeriod(selected)
                        }}
                        className="ma__select-box js-dropdown"
                      />
                    </h2>
                  </React.Fragment>
                )}
                {!disable && context.payroll_base === 'all' && (
                  <table className="ma__table">
                    <tbody>
                      <tr className="ma__table-headers">
                        <th>Contribution</th>
                        <th></th>
                        <th>Medical Leave</th>
                        <th>Family Leave</th>
                        <th>Total</th>
                      </tr>
                      <tr>
                        <th rowspan="2">You will pay:</th>
                        <td className="ma__td--group">Total</td>
                        <td>{toCurrency(medLeaveComp/context.time_value)}</td>
                        <td>{toCurrency(famLeaveComp/context.time_value)}</td>
                        <td>{toCurrency((medLeaveComp + famLeaveComp)/context.time_value)}</td>
                      </tr>
                      <tr>
                        <td className="ma__td--group">Per Employee</td>
                        <td>{toCurrency((medLeaveComp)/employeeCount)}</td>
                        <td>{toCurrency((famLeaveComp)/employeeCount)}</td>
                        <td>{toCurrency((medLeaveComp + famLeaveComp)/employeeCount/context.time_value)}</td>
                      </tr>
                      <tr>
                        <th rowspan="2">Your Employees will pay:</th>
                        <td className="ma__td--group">Total</td>
                        <td>{toCurrency(medLeaveEmp/context.time_value)}</td>
                        <td>{toCurrency(famLeaveEmp/context.time_value)}</td>
                        <td>{toCurrency((medLeaveEmp + famLeaveEmp)/context.time_value)}</td>
                      </tr>
                      <tr>
                        <td className="ma__td--group">Per Employee</td>
                        <td>{toCurrency(medLeaveEmp/employeeCount/context.time_value)}</td>
                        <td>{toCurrency(famLeaveEmp/employeeCount/context.time_value)}</td>
                        <td>{toCurrency((medLeaveEmp + famLeaveEmp)/employeeCount/context.time_value)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
                { !disable && context.payroll_base === 'one' && (
                  <table className="ma__table">
                    <tbody>
                      <tr className="ma__table-headers">
                        <th>Contribution</th>
                        <th>Medical Leave</th>
                        <th>Family Leave</th>
                        <th>Total</th>
                      </tr>
                      <tr>
                        <td>You will pay:</td>
                        <td>{toCurrency(medLeaveComp/context.time_value)}</td>
                        <td>{toCurrency(famLeaveComp/context.time_value)}</td>
                        <td>{toCurrency((medLeaveComp + famLeaveComp)/context.time_value)}</td>
                      </tr>
                      <tr>
                        <td>Your Employee will pay:</td>
                        <td>{toCurrency(medLeaveEmp/context.time_value)}</td>
                        <td>{toCurrency(famLeaveEmp/context.time_value)}</td>
                        <td>{toCurrency((medLeaveEmp + famLeaveEmp)/context.time_value)}</td>
                      </tr>
                      <tr>
                        <td className="ma__td--group">Total payment:</td>
                        <td>{toCurrency(medLeave/context.time_value)}</td>
                        <td>{toCurrency(famLeave/context.time_value)}</td>
                        <td>{toCurrency((medLeave + famLeave)/context.time_value)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </React.Fragment>
            )
          }
        }
      </FormContext.Consumer>
    );
}


export default addUrlProps({ mapUrlChangeHandlersToProps })(Part3);
