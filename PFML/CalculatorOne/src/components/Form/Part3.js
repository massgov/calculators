import React from 'react';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import { SelectBox, Input, InputSlider, InputNumber, FormContext } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import { toCurrency, getHelpTip } from '../../utils';
import CalculatorOneVariables from '../../data/CalculatorOneVariables.json';
import PartThreeProps from '../../data/PartThree.json';

import '../../css/index.css';

/**
 * Manually specify how to deal with changes to URL query param props.
 * We do this since we are not using a urlPropsQueryConfig.
 */
const mapUrlChangeHandlersToProps = () => ({
  onChangeMedCont: (value) => replaceInUrlQuery('medCont', encode(UrlQueryParamTypes.number, value)),
  onChangeFamCont: (value) => replaceInUrlQuery('famCont', encode(UrlQueryParamTypes.number, value)),
  onChangeTimePeriod: (value) => replaceInUrlQuery('timePeriod', encode(UrlQueryParamTypes.string, value)),
  onChangeTimeValue: (value) => replaceInUrlQuery('timeValue', encode(UrlQueryParamTypes.number, value))
});

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
              employeesW2, employees1099, payrollW2, payroll1099, payrollWages
            } = context.value;
            const {
              hasMassEmployees, payrollBase, famLeaveCont, medLeaveCont, timeValue, timePeriod
            } = context;

            const over50per = (Number(employees1099) / (Number(employeesW2) + Number(employees1099))) >= emp1099Fraction;
            const employeeCount = over50per ? (Number(employeesW2) + Number(employees1099)) : Number(employeesW2);
            const over25 = employeeCount >= minEmployees;
            const medPercent = over25 ? largeMedPercent : smallMedPercent;
            const famPercent = over25 ? largeFamPercent : smallFamPercent;

            const timePeriodOptions = [
              { text: 'Year', value: '1' },
              { text: 'Quarter', value: String(quartersPerYear) },
              { text: 'Week', value: String(weeksPerYear) }
            ];

            let totalPayroll;
            if (payrollBase === 'all') {
              totalPayroll = over50per ? (numbro.unformat(payroll1099) + numbro.unformat(payrollW2)) : numbro.unformat(payrollW2);
            } else {
              totalPayroll = numbro.unformat(payrollWages) > socialSecCap ? socialSecCap : numbro.unformat(payrollWages);
            }
            const medLeave = totalPayroll * medPercent;
            const famLeave = totalPayroll * famPercent;

            const minMed = over25 ? largeCompMedCont : smallCompMedCont;
            const minFam = over25 ? largeCompFamCont : smallCompFamCont;
            const minMedPer = Math.round(minMed * 100);
            const minFamPer = Math.round(minFam * 100);

            const onMedChange = (event, value) => {
              // If statement should be removed after porting form context in.
              if (event.target.type === 'button') {
                const fracNum = value > minMedPer ? value / 100 : minMed;
                context.updateState({ medLeaveCont: fracNum });
                onChangeMedCont(fracNum);
              }
            };
            // Remove this function after integrating form context.
            const onMedBlur = (event, value) => {
              const fracNum = value > minFamPer ? value / 100 : minMed;
              context.updateState({ medLeaveCont: fracNum });
              onChangeFamCont(fracNum);
            };
            const onFamChange = (event, value) => {
              // If statement should be removed after porting form context in.
              if (event.target.type === 'button') {
                const fracNum = value > minFamPer ? value / 100 : minFam;
                context.updateState({ famLeaveCont: fracNum });
                onChangeFamCont(fracNum);
              }
            };
            // Remove this function after integrating form context.
            const onFamBlur = (event, value) => {
              const fracNum = value > minFamPer ? value / 100 : minFam;
              context.updateState({ famLeaveCont: fracNum });
              onChangeFamCont(fracNum);
            };
            const onMedSliderChange = (value) => {
              const fracNum = value > minMedPer ? value / 100 : minMed;
              context.updateState({ medLeaveCont: fracNum });
              onChangeMedCont(fracNum);
            };
            const onFamSliderChange = (value) => {
              const fracNum = value > minFamPer ? value / 100 : minFam;
              context.updateState({ famLeaveCont: fracNum });
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

            const medLeaveComp = medLeave * medLeaveCont;
            const famLeaveComp = famLeave * famLeaveCont;
            const medLeaveEmp = medLeave * (1 - medLeaveCont);
            const famLeaveEmp = famLeave * (1 - famLeaveCont);

            const disableAll = payrollBase === 'all' && numbro.unformat(payrollW2) > 0 && (over50per ? numbro.unformat(payroll1099) > 0 : true);
            const disableOne = payrollBase === 'one' && numbro.unformat(payrollWages) > 0;
            const disable = hasMassEmployees && (employeeCount > 0) && (disableOne || disableAll);

            const famTicks = minFamPer === 0 ? [[0, '0%'], [100, '100%']] : [[0, '0%'], [minFamPer, 'Min Employer Contribution'], [100, '100%']];
            const medTicks = minMedPer === 0 ? [[0, '0%'], [100, '100%']] : [[0, '0%'], [minMedPer, 'Min Employer Contribution'], [100, '100%']];

            const familyLeaveSliderProps = {
              id: 'family-leave',
              required: true,
              defaultValue: String(Math.round(famLeaveCont * 100)),
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
              defaultValue: String(Math.round(medLeaveCont * 100)),
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
                        <Input labelText="Family Leave" required>
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
                              defaultValue={Math.round(famLeaveCont * 100)}
                              unit="%"
                              required
                              max={100}
                              min={0}
                              step={1}
                              showButtons
                              onChange={(event, value) => onFamChange(event, value)}
                              // Remove onBlur event after integration of form context
                              onBlur={(event, value) => onFamBlur(event, value)}
                              // Remove key after integration of form context
                              key={`family-leave-input-number-${famLeaveCont}`}
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
                              defaultValue={Math.round((1 - famLeaveCont) * 100)}
                              unit="%"
                              required
                              disabled
                              showButtons
                              onChange={(event, value) => onFamChange(event, value)}
                              key={Math.random()}
                            />
                          </div>
                          <InputSlider {...familyLeaveSliderProps} />
                        </Input>
                        <Input labelText="Medical Leave" required>
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
                              defaultValue={Math.round(medLeaveCont * 100)}
                              unit="%"
                              required
                              step={1}
                              showButtons
                              onChange={(event, value) => onMedChange(event, value)}
                              // Remove onBlur event after integration of form context
                              onBlur={(event, value) => onMedBlur(event, value)}
                              // Remove key after integration of form context.
                              key={`medical-leave-input-number-${medLeaveCont}`}
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
                              defaultValue={Math.round((1 - medLeaveCont) * 100)}
                              unit="%"
                              required
                              disabled
                              showButtons
                              step={1}
                              onChange={(event, value) => onMedChange(event, value)}
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
                        selected={timePeriod || 'Year'}
                        onChangeCallback={({ selected }) => {
                          const value = getTimeValue(selected);
                          context.updateState({
                            timePeriod: selected,
                            timeValue: value
                          });
                          onChangeTimeValue(value);
                          onChangeTimePeriod(selected);
                        }}
                        className="ma__select-box js-dropdown"
                      />
                    </h2>
                  </React.Fragment>
                )}
                {disable && payrollBase === 'all' && (
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
                        <td>{toCurrency(medLeaveComp / timeValue)}</td>
                        <td>{toCurrency(famLeaveComp / timeValue)}</td>
                        <td>{toCurrency((medLeaveComp + famLeaveComp) / timeValue)}</td>
                      </tr>
                      <tr>
                        <td className="ma__td--group">Per Employee</td>
                        <td>{toCurrency((medLeaveComp) / employeeCount / timeValue)}</td>
                        <td>{toCurrency((famLeaveComp) / employeeCount / timeValue)}</td>
                        <td>{toCurrency((medLeaveComp + famLeaveComp) / employeeCount / timeValue)}</td>
                      </tr>
                      <tr>
                        <th rowSpan="2">Your Employees will pay:</th>
                        <td className="ma__td--group">Total</td>
                        <td>{toCurrency(medLeaveEmp / timeValue)}</td>
                        <td>{toCurrency(famLeaveEmp / timeValue)}</td>
                        <td>{toCurrency((medLeaveEmp + famLeaveEmp) / timeValue)}</td>
                      </tr>
                      <tr>
                        <td className="ma__td--group">Per Employee</td>
                        <td>{toCurrency(medLeaveEmp / employeeCount / timeValue)}</td>
                        <td>{toCurrency(famLeaveEmp / employeeCount / timeValue)}</td>
                        <td>{toCurrency((medLeaveEmp + famLeaveEmp) / employeeCount / timeValue)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {disable && payrollBase === 'one' && (
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
                        <td>{toCurrency(medLeaveComp / timeValue)}</td>
                        <td>{toCurrency(famLeaveComp / timeValue)}</td>
                        <td>{toCurrency((medLeaveComp + famLeaveComp) / timeValue)}</td>
                      </tr>
                      <tr>
                        <td>Your Employee will pay:</td>
                        <td>{toCurrency(medLeaveEmp / timeValue)}</td>
                        <td>{toCurrency(famLeaveEmp / timeValue)}</td>
                        <td>{toCurrency((medLeaveEmp + famLeaveEmp) / timeValue)}</td>
                      </tr>
                      <tr>
                        <td className="ma__td--group">Total payment:</td>
                        <td>{toCurrency(medLeave / timeValue)}</td>
                        <td>{toCurrency(famLeave / timeValue)}</td>
                        <td>{toCurrency((medLeave + famLeave) / timeValue)}</td>
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

Part3.propTypes = {
  /** Functions that push changed context props to the url. */
  onChangeMedCont: PropTypes.func,
  onChangeFamCont: PropTypes.func,
  onChangeTimePeriod: PropTypes.func,
  onChangeTimeValue: PropTypes.func
};

export default addUrlProps({ mapUrlChangeHandlersToProps })(Part3);
