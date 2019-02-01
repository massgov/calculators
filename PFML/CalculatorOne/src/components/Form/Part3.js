import React from 'react';
import numbro from 'numbro';
import { SelectBox, Input, InputSlider, CompoundSlider, InputNumber, FormContext } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import { toCurrency } from '../../utils';
import InputPercentage from '../InputPercentage';
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
  return{
    onChangeMedCont: (value) => replaceInUrlQuery('medCont', encode(UrlQueryParamTypes.number, value)),
    onChangeFamCont: (value) => replaceInUrlQuery('famCont', encode(UrlQueryParamTypes.number, value)),
    onChangeTimePeriod: (value) => replaceInUrlQuery('timePeriod', encode(UrlQueryParamTypes.string, value)),
    onChangeTimeValue: (value) => replaceInUrlQuery('timeValue', encode(UrlQueryParamTypes.number, value))
  };
}

const Part3 = (props) => {
  const {
    minEmployees, emp1099Fraction, smallMedPercent, smallFamPercent, largeMedPercent, largeFamPercent, largeCompMedCont, smallCompMedCont, weeksPerYear, quartersPerYear, socialSecCap
  } = CalculatorOneVariables.baseVariables;
  const {
    onChangeMedCont, onChangeFamCont, onChangeTimeValue, onChangeTimePeriod
  } = props;
  return(
    <FormContext.Consumer>
      {
          (context) => {
            const {
              employees_w2, employees_1099, payroll_w2, payroll_1099, payroll_wages
            } = context.value;
            const familyLeave = Number(context.value['family-leave']);
            const medicalLeave = Number(context.value['medical-leave']);
            const { has_mass_employees, payroll_base, fam_leave_cont, med_leave_cont, time_value, time_period } = context;
            const over50per = (Number(employees_1099) / (Number(employees_w2) + Number(employees_1099))) >= emp1099Fraction;
            const employeeCount = over50per ? (Number(employees_w2) + Number(employees_1099)) : Number(employees_w2);
            const over25 = employeeCount >= minEmployees;
            const medPercent = over25 ? largeMedPercent : smallMedPercent;
            const famPercent = over25 ? largeFamPercent : smallFamPercent;
            const totalPercent = medPercent + famPercent;
            const minMed = over25 ? largeCompMedCont : smallCompMedCont;
            const timePeriodOptions = [
              { text: 'Year', value: '1' },
              { text: 'Quarter', value: String(quartersPerYear) },
              { text: 'Week', value: String(weeksPerYear) }
            ];
            const totalPayroll = payroll_base === 'all' ? (numbro.unformat(payroll_w2) + (over50per ? numbro.unformat(payroll_1099) : 0)) : (numbro.unformat(payroll_wages) > socialSecCap ? socialSecCap : numbro.unformat(payroll_wages));
            const medLeave = totalPayroll * medPercent;
            const famLeave = totalPayroll * famPercent;

            const onMedChange = (med) => {
              const medCont = med.value > minMed ? med.value : minMed;
              context.setValue({id: med.id, value: medCont});
              //context.updateState({med_leave_cont: medCont });
              //onChangeMedCont(medCont);
            };
            const onFamChange = (fam) => {
              const value = {...context.value};
              value[fam.id] = fam.value;
              context.setValue(fam);
              //console.table(context);
              //context.updateState({ fam_leave_cont: fam.value });
              //onChangeFamCont(fam.value);
            };
            const getTimeValue = (text) => {
              let value;
              timePeriodOptions.forEach((period) => {
                if (period.text === text) {
                  value = period.value;
                }
              });
              return value;
            };

            const medLeaveComp = medLeave * med_leave_cont;
            const famLeaveComp = famLeave * fam_leave_cont;
            const medLeaveEmp = medLeave * (1 - med_leave_cont);
            const famLeaveEmp = famLeave * (1 - fam_leave_cont);
            const disable = !(has_mass_employees && employees_w2 && (employees_1099 >= 0) && ((payroll_w2 && (over50per ? numbro.unformat(payroll_1099) > 0 : numbro.unformat(payroll_1099) >= 0) && payroll_base === 'all') || (payroll_base === 'one' && payroll_wages)));
            const medMin = over25 ? 60 : 0;
            const medTicks = over25 ? [['0', '0%'], ['1', '100%'], ['0.6', 'Minimum requirement']] : [['0', '0%'], ['1', '100%']];

            const familyLeaveSliderProps = {
              labelText: 'Family Leave',
              id: 'family-leave',
              defaultValue: String(familyLeave),
              axis: 'x',
              max: 100,
              min: 0,
              step: 1,
              ticks: [
                [0, '0%'],
                [100, '100%']
              ],
              domain: [0, 100],
              skipped: true
            };

            const medLeaveSliderProps = {
              labelText: 'Medical Leave',
              id: 'medical-leave',
              required: true,
              defaultValue: String(medicalLeave),
              axis: 'x',
              max: 100,
              min: medMin,
              step: 1,
              ticks: [
                [0, '0%'],
                [100, '100%']
              ],
              //ticks: medTicks,
              skipped: true
            };

            return(
              <React.Fragment>
                {!disable && (
                  <React.Fragment>
                    <fieldset>
                      <legend className="ma__label">How will you split liability with your employees?</legend>
                      <div className="ma__input-group--two">
                        <div className="ma__input-group--ends">
                          <InputNumber
                            labelText="Employer Contribution"
                            name="famEmployerCont"
                            id="famEmployerCont"
                            type="number"
                            width={0}
                            maxlength={0}
                            placeholder="e.g. 50"
                            inline={false}
                            defaultValue={0}
                            unit="%"
                            required
                            max={100}
                            min={0}
                            step={1}
                            showButtons
                          />
                          <InputNumber
                            labelText="Employee Contribution"
                            name="famEmployeeCont"
                            id="famEmployeeCont"
                            type="number"
                            width={0}
                            maxlength={0}
                            placeholder="e.g. 50"
                            inline={false}
                            step={1}
                            max={100}
                            min={0}
                            defaultValue={0}
                            unit="%"
                            required
                            disabled
                            showButtons
                          />
                        </div>
                        <InputSlider {...familyLeaveSliderProps} />
                        <div className="ma__input-group--ends">
                          <InputNumber
                            labelText="Employer Contribution"
                            name="medEmployerCont"
                            id="medEmployerCont"
                            type="number"
                            width={0}
                            maxlength={0}
                            placeholder="e.g. 50"
                            inline={false}
                            max={100}
                            min={0}
                            defaultValue={0}
                            unit="%"
                            required
                            step={1}
                            showButtons
                          />
                          <InputNumber
                            labelText="Employee Contribution"
                            name="medEmployeeCont"
                            id="medEmployeeCont"
                            type="number"
                            width={0}
                            maxlength={0}
                            placeholder="e.g. 50"
                            inline={false}
                            max={100}
                            min={0}
                            defaultValue={0}
                            unit="%"
                            required
                            disabled
                            showButtons
                            step={1}
                          />
                        </div>
                        <InputSlider {...medLeaveSliderProps} />
                      </div>
                    </fieldset>
                    <h2 className="ma__table-heading">
                      <SelectBox
                        label="Paid Family Medical Leave by"
                        stackLabel={false}
                        required
                        id="color-select"
                        options={timePeriodOptions}
                        selected={time_period || 'Year'}
                        onChangeCallback={({ selected }) => {
                          const value = getTimeValue(selected);
                          context.updateState({
                            time_period: selected,
                            time_value: value
                          });
                          onChangeTimeValue(value);
                          onChangeTimePeriod(selected);
                        }}
                        className="ma__select-box js-dropdown"
                      />
                    </h2>
                  </React.Fragment>
                )}
                {!disable && payroll_base === 'all' && (
                  <table className="ma__table">
                    <tbody>
                      <tr className="ma__table-headers">
                        <th>Contribution</th>
                        <th />
                        <th>Medical Leave</th>
                        <th>Family Leave</th>
                        <th>Total</th>
                      </tr>
                      <tr>
                        <th rowSpan="2">You will pay:</th>
                        <td className="ma__td--group">Total</td>
                        <td>{toCurrency(medLeaveComp / time_value)}</td>
                        <td>{toCurrency(famLeaveComp / time_value)}</td>
                        <td>{toCurrency((medLeaveComp + famLeaveComp) / time_value)}</td>
                      </tr>
                      <tr>
                        <td className="ma__td--group">Per Employee</td>
                        <td>{toCurrency((medLeaveComp) / employeeCount)}</td>
                        <td>{toCurrency((famLeaveComp) / employeeCount)}</td>
                        <td>{toCurrency((medLeaveComp + famLeaveComp) / employeeCount / time_value)}</td>
                      </tr>
                      <tr>
                        <th rowSpan="2">Your Employees will pay:</th>
                        <td className="ma__td--group">Total</td>
                        <td>{toCurrency(medLeaveEmp / time_value)}</td>
                        <td>{toCurrency(famLeaveEmp / time_value)}</td>
                        <td>{toCurrency((medLeaveEmp + famLeaveEmp) / time_value)}</td>
                      </tr>
                      <tr>
                        <td className="ma__td--group">Per Employee</td>
                        <td>{toCurrency(medLeaveEmp / employeeCount / time_value)}</td>
                        <td>{toCurrency(famLeaveEmp / employeeCount / time_value)}</td>
                        <td>{toCurrency((medLeaveEmp + famLeaveEmp) / employeeCount / time_value)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
                { !disable && payroll_base === 'one' && (
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
                        <td>{toCurrency(medLeaveComp / time_value)}</td>
                        <td>{toCurrency(famLeaveComp / time_value)}</td>
                        <td>{toCurrency((medLeaveComp + famLeaveComp) / time_value)}</td>
                      </tr>
                      <tr>
                        <td>Your Employee will pay:</td>
                        <td>{toCurrency(medLeaveEmp / time_value)}</td>
                        <td>{toCurrency(famLeaveEmp / time_value)}</td>
                        <td>{toCurrency((medLeaveEmp + famLeaveEmp) / time_value)}</td>
                      </tr>
                      <tr>
                        <td className="ma__td--group">Total payment:</td>
                        <td>{toCurrency(medLeave / time_value)}</td>
                        <td>{toCurrency(famLeave / time_value)}</td>
                        <td>{toCurrency((medLeave + famLeave) / time_value)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </React.Fragment>
            );
          }
        }
    </FormContext.Consumer>
  );
};


export default Part3;
