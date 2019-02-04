import React from 'react';
import numbro from 'numbro';
import { SelectBox, Input, InputSlider, InputNumber, FormContext } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import { toCurrency, getHelpTip } from '../../utils';
import CalculatorOneVariables from '../../data/CalculatorOneVariables.json';
import PartThreeProps from '../../data/PartThree.json';

import '../../css/index.css';

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
    minEmployees, emp1099Fraction, smallMedPercent, smallFamPercent, largeMedPercent, largeFamPercent, largeCompFamCont, smallCompFamCont, largeCompMedCont, smallCompMedCont, weeksPerYear, quartersPerYear, socialSecCap
  } = CalculatorOneVariables.baseVariables;
  const { questionOne } = PartThreeProps;
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
            const {
              has_mass_employees, payroll_base, fam_leave_cont, med_leave_cont, time_value, time_period
            } = context;

            const over50per = (Number(employees_1099) / (Number(employees_w2) + Number(employees_1099))) >= emp1099Fraction;
            const employeeCount = over50per ? (Number(employees_w2) + Number(employees_1099)) : Number(employees_w2);
            const over25 = employeeCount >= minEmployees;
            const medPercent = over25 ? largeMedPercent : smallMedPercent;
            const famPercent = over25 ? largeFamPercent : smallFamPercent;
            const totalPercent = medPercent + famPercent;
            
            const timePeriodOptions = [
              { text: 'Year', value: '1' },
              { text: 'Quarter', value: String(quartersPerYear) },
              { text: 'Week', value: String(weeksPerYear) }
            ];

            const totalPayroll = payroll_base === 'all' ? (numbro.unformat(payroll_w2) + (over50per ? numbro.unformat(payroll_1099) : 0)) : (numbro.unformat(payroll_wages) > socialSecCap ? socialSecCap : numbro.unformat(payroll_wages));
            const medLeave = totalPayroll * medPercent;
            const famLeave = totalPayroll * famPercent;

            const minMed = over25 ? largeCompMedCont : smallCompMedCont;
            const minFam = over25 ? largeCompFamCont : smallCompFamCont;
            const minMedPer = Math.round(minMed*100);
            const minFamPer = Math.round(minFam*100);

            const onMedChange = (event, value) => {
              const fracNum = value > minMedPer ? value/100 : minMed;
              context.updateState({med_leave_cont: fracNum });
              onChangeMedCont(fracNum);
            };
            const onFamChange = (event, value) => {
              const fracNum = value > minFamPer ? value/100 : minFam;
              context.updateState({ fam_leave_cont: fracNum });
              onChangeFamCont(fracNum);
            };
            const onMedSliderChange = (value) => {
              const fracNum = value > minMedPer ? value/100 : minMed;
              context.updateState({med_leave_cont: fracNum });
              onChangeMedCont(fracNum);
            };
            const onFamSliderChange = (value) => {
              const fracNum = value > minFamPer ? value/100 : minFam;
              context.updateState({ fam_leave_cont: fracNum });
              onChangeFamCont(fracNum);
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
            const disable = has_mass_employees && employees_w2 > 0 && (
              payroll_base === 'all' && payroll_w2 && numbro.unformat(payroll_w2) > 0 && (over50per ? numbro.unformat(payroll_1099) > 0 : true)
            ) || (
              payroll_base === 'one' && payroll_wages && numbro.unformat(payroll_wages) > 0
            );
            console.log(numbro.unformat(payroll_w2))
            const famTicks = minFamPer === 0 ? [[0, '0%'],[100, '100%']] : [[0, '0%'],[minFamPer,'Min Employer Contribution'],[100, '100%']]
            const medTicks = minMedPer === 0 ? [[0, '0%'],[100, '100%']] : [[0, '0%'],[minMedPer,'Min Employer Contribution'],[100, '100%']]
            
            const familyLeaveSliderProps = {
              id: 'family-leave',
              required: true,
              defaultValue: String(Math.round(fam_leave_cont*100)),
              axis: 'x',
              max: 100,
              min: minFamPer,
              step: 1,
              ticks: famTicks,
              domain: [0, 100],
              skipped: true,
              onChange: (value) => onFamSliderChange(value)
            };
            const medLeaveSliderProps = {
              id: 'medical-leave',
              required: true,
              defaultValue: String(Math.round(med_leave_cont*100)),
              axis: 'x',
              max: 100,
              min: minMedPer,
              step: 1,
              domain: [0, 100],
              ticks: medTicks,
              skipped: true,
              onChange: (value) => onMedSliderChange(value)
            };

            return(
              <React.Fragment>
                {disable && (
                  <React.Fragment>
                    <fieldset>
                      <legend className="ma__label">
                        {over25 ? getHelpTip(questionOne.over25) : getHelpTip(questionOne.under25)}
                      </legend>
                      <div className="ma__input-group--two">
                        <Input labelText="Family Leave" required={true}>
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
                              defaultValue={Math.round(fam_leave_cont*100)}
                              unit="%"
                              required
                              max={100}
                              min={0}
                              step={1}
                              showButtons
                              onChange={(event,value) => onFamChange(event,value)}
                              key={Math.random()}
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
                              defaultValue={Math.round((1-fam_leave_cont)*100)}
                              unit="%"
                              required
                              disabled
                              showButtons
                              onChange={(event,value) => onFamChange(event,value)}
                              key={Math.random()}
                            />
                          </div>
                          <InputSlider {...familyLeaveSliderProps} />
                        </Input>
                        <Input labelText="Medical Leave" required={true}>
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
                              defaultValue={Math.round(med_leave_cont*100)}
                              unit="%"
                              required
                              step={1}
                              showButtons
                              onChange={(event,value) => onMedChange(event,value)}
                              key={Math.random()}
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
                              defaultValue={Math.round((1-med_leave_cont)*100)}
                              unit="%"
                              required
                              disabled
                              showButtons
                              step={1}
                              onChange={(event,value) => onMedChange(event,value)}
                              key={Math.random()}
                            />
                          </div>
                          <InputSlider {...medLeaveSliderProps} />
                        </Input>
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
                {disable && payroll_base === 'all' && (
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
                        <td>{toCurrency((medLeaveComp) / employeeCount / time_value )}</td>
                        <td>{toCurrency((famLeaveComp) / employeeCount / time_value)}</td>
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
                {disable && payroll_base === 'one' && (
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


export default addUrlProps({ mapUrlChangeHandlersToProps })(Part3);
