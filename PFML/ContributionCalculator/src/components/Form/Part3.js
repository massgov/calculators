import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import { SelectBox, Input, InputSlider, InputNumber, FormContext, InputContext } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import { toCurrency, getHelpTip } from '../../utils';
import ContributionVariables from '../../data/ContributionVariables.json';
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
  const partOneContext = props.partOneContext;
  const formContext = useContext(FormContext);
  const {
    smallMedPercent, smallFamPercent, largeMedPercent, largeFamPercent, largeCompFamCont, smallCompFamCont, largeCompMedCont, smallCompMedCont, socialSecCap
  } = ContributionVariables.baseVariables;
  const { questionOne, questionTwo } = PartThreeProps;
  const {
    onChangeMedCont, onChangeFamCont, onChangeTimeValue, onChangeTimePeriod
  } = props;

  const famLeaveDefault = partOneContext.getValue().famLeaveCont;
  const medLeaveDefault = partOneContext.getValue().medLeaveCont;

  const getTimeValue = (text) => {
    let value;
    questionTwo.options.forEach((period) => {
      if (period.text === text) {
        value = period.value;
      }
    });
    return value;
  };

  const leaveTableDefaults = {
    famCont: props.famCont ? Number(props.famCont) : medLeaveDefault,
    medCont: props.medCont ? Number(props.medCont) : famLeaveDefault,
    timeValue: props.timeValue ? Number(props.timeValue) : 1,
    timePeriod: props.timePeriod || 'Year',
  };
  leaveTableDefaults['family-leave'] = String(Math.round(leaveTableDefaults.famCont * 100));
  leaveTableDefaults['medical-leave'] = String(Math.round(leaveTableDefaults.medCont * 100));
  return(
    <React.Fragment>
      <Input id="leave_table" defaultValue={leaveTableDefaults}>
        <InputContext.Consumer>
          {
            (leaveTableContext) => {
              const {
                mass_employees, over50, over25, empCount, famLeaveCont, medLeaveCont
              } = formContext.getValue('part_one');
              const { payrollBase, pay1099, payW2, payWages } = formContext.getValue('payrollBase');
              let totalPayroll;
              if (payrollBase === 'all') {
                totalPayroll = over50 ? (numbro.unformat(pay1099) + numbro.unformat(payW2)) : numbro.unformat(payW2);
              } else {
                totalPayroll = numbro.unformat(payWages) > socialSecCap ? socialSecCap : numbro.unformat(payWages);
              }
              const minMed = over25 ? largeCompMedCont : smallCompMedCont;
              const minFam = over25 ? largeCompFamCont : smallCompFamCont;
              const minMedPer = Math.round(minMed * 100);
              const minFamPer = Math.round(minFam * 100);
              const famTicks = minFamPer === 0 ? [[0, '0%'], [100, '100%']] : [[0, '0%'], [minFamPer, 'Min Employer Contribution'], [100, '100%']];
              const medTicks = minMedPer === 0 ? [[0, '0%'], [100, '100%']] : [[0, '0%'], [minMedPer, 'Min Employer Contribution'], [100, '100%']];
              const hasMassEmployees = (mass_employees) === 'yes';
              const disableAll = payrollBase === 'all' && numbro.unformat(payW2) > 0 && (over50 ? numbro.unformat(pay1099) > 0 : true);
              const disableOne = payrollBase === 'one' && numbro.unformat(payWages) > 0;
              const show = hasMassEmployees && (empCount > 0) && (disableOne || disableAll);
              const medPercent = over25 ? largeMedPercent : smallMedPercent;
              const famPercent = over25 ? largeFamPercent : smallFamPercent;
              const medLeave = totalPayroll * medPercent;
              const famLeave = totalPayroll * famPercent;
              const medLeaveComp = medLeave * medLeaveCont;
              const famLeaveComp = famLeave * famLeaveCont;
              const medLeaveEmp = medLeave * (1 - medLeaveCont);
              const famLeaveEmp = famLeave * (1 - famLeaveCont);
              const timePeriod = formContext.getValue('leave_table').timePeriod;
              const timeValue = getTimeValue(timePeriod);
              const onFamSliderChange = (value) => {
                const fracNum = value > minFamPer ? value / 100 : minFam;
                const newVal = Object.assign({}, formContext.getValue('leave_table'), {
                  famCont: fracNum,
                  'family-leave': String(value)
                });
                const newPartOne = Object.assign({}, partOneContext.getValue(), {
                  famLeaveCont: fracNum
                });
                partOneContext.setValue(newPartOne, () => {
                  leaveTableContext.setValue(newVal, () => {
                    formContext.setValue({ id: 'famEmployerCont', value });
                    formContext.setValue({ id: 'famEmployeeCont', value: (100 - value) });
                    onChangeFamCont(fracNum);
                  });
                });
              };
              const onMedSliderChange = (value) => {
                const fracNum = value > minMedPer ? value / 100 : minMed;
                const newVal = Object.assign({}, formContext.getValue('leave_table'), {
                  medCont: fracNum,
                  'medical-leave': String(value)
                });
                const newPartOne = Object.assign({}, partOneContext.getValue(), {
                  medLeaveCont: fracNum
                });
                partOneContext.setValue(newPartOne, () => {
                  leaveTableContext.setValue(newVal, () => {
                    formContext.setValue({ id: 'medEmployerCont', value });
                    formContext.setValue({ id: 'medEmployeeCont', value: (100 - value) });
                    onChangeMedCont(fracNum);
                  });
                });
              };

              const onFamChange = (event, value, id) => {
                const fam = formContext.getValue(id);
                const fracNum = fam > minFamPer ? fam / 100 : minFam;
                const newVal = Object.assign({}, formContext.getValue('leave_table'), {
                  famCont: fracNum,
                  'family-leave': String(value)
                });

                const newPartOne = Object.assign({}, partOneContext.getValue(), {
                  famLeaveCont: fracNum
                });
                // Update part one content...
                partOneContext.setValue(newPartOne, () => {
                  // Then update the leave table content...
                  leaveTableContext.setValue(newVal, () => {
                    // Then keep the inputs in sync...
                    formContext.setValue({ id: 'family-leave', value: String(fam) });
                    const updateId = (id === 'famEmployeeCont') ? 'famEmployerCont' : 'famEmployeeCont';
                    formContext.setValue({
                      id: updateId,
                      value: (updateId === 'famEmployeeCont') ? (100 - fam) : fam
                    });
                    onChangeFamCont(fracNum);
                  });
                });
              };
              const onMedChange = (event, value, id) => {
                const med = formContext.getValue(id);
                const fracNum = med > minMedPer ? med / 100 : minMed;
                const newVal = Object.assign({}, formContext.getValue('leave_table'), {
                  famCont: fracNum,
                  'medical-leave': String(value)
                });

                const newPartOne = Object.assign({}, partOneContext.getValue(), {
                  medLeaveCont: fracNum
                });
                // Update part one content...
                partOneContext.setValue(newPartOne, () => {
                  // Then update the leave table content...
                  leaveTableContext.setValue(newVal, () => {
                    // Then keep the inputs in sync...
                    formContext.setValue({ id: 'medical-leave', value: String(med) });
                    const updateId = (id === 'medEmployeeCont') ? 'medEmployerCont' : 'medEmployeeCont';
                    formContext.setValue({
                      id: updateId,
                      value: (updateId === 'medEmployeeCont') ? (100 - med) : med
                    });
                    onChangeMedCont(fracNum);
                  });
                });
              };

              const familyLeaveSliderProps = {
                id: 'family-leave',
                labelText: '',
                required: true,
                defaultValue: String(formContext.getValue('leave_table')['family-leave']),
                axis: 'x',
                max: 100,
                min: minFamPer,
                step: 1,
                ticks: famTicks,
                domain: [0, 100],
                skipped: true,
                onChange: onFamSliderChange
              };
              const medLeaveSliderProps = {
                id: 'medical-leave',
                labelText: '',
                required: true,
                defaultValue: String(formContext.getValue('leave_table')['medical-leave']),
                axis: 'x',
                max: 100,
                min: minMedPer,
                step: 1,
                domain: [0, 100],
                ticks: medTicks,
                skipped: true,
                onChange: onMedSliderChange
              };
              if (show) {
                return(
                  <Fragment>
                    <fieldset>
                      <legend className="ma__label">
                        {over25 ? getHelpTip(questionOne.over25) : getHelpTip(questionOne.under25)}
                      </legend>
                      <div className="ma__input-group--two">
                        <div className="ma__input-group">
                          <label htmlFor="famEmployerCont" className="ma__label ma__label--required">Family Leave</label>
                          <div className="ma__input-group-right">
                            <div className="ma__input-group--ends">
                              <InputNumber
                                labelText={questionOne.left.left}
                                name="famEmployerCont"
                                id="famEmployerCont"
                                width={0}
                                maxlength={0}
                                placeholder="e.g. 50"
                                inline={false}
                                defaultValue={Math.round(famLeaveCont * 100)}
                                unit="%"
                                required
                                max={100}
                                min={minFamPer}
                                step={1}
                                showButtons
                                onChange={onFamChange}
                              />
                              <InputNumber
                                labelText={questionOne.left.right}
                                name="famEmployeeCont"
                                id="famEmployeeCont"
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
                                onChange={onFamChange}
                              />
                            </div>
                            <InputSlider {...familyLeaveSliderProps} />
                          </div>
                        </div>
                        <div className="ma__input-group">
                          <label htmlFor="medEmployerCont" className="ma__label ma__label--required">Medical Leave</label>
                          <div className="ma__input-group-right">
                            <div className="ma__input-group--ends">
                              <InputNumber
                                labelText={questionOne.right.left}
                                name="medEmployerCont"
                                id="medEmployerCont"
                                width={0}
                                maxlength={0}
                                placeholder="e.g. 50"
                                inline={false}
                                max={100}
                                min={minMedPer}
                                defaultValue={Math.round(medLeaveCont * 100)}
                                unit="%"
                                required
                                step={1}
                                showButtons
                                onChange={onMedChange}
                              />
                              <InputNumber
                                labelText={questionOne.right.right}
                                name="medEmployeeCont"
                                id="medEmployeeCont"
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
                                onChange={onMedChange}
                              />
                            </div>
                            <InputSlider {...medLeaveSliderProps} />
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    <h2 className="ma__table-heading">
                      <SelectBox
                        label={questionTwo.question}
                        stackLabel={false}
                        required
                        id="colorSelect"
                        options={questionTwo.options}
                        selected={timePeriod}
                        onChangeCallback={({ selected }) => {
                          const value = getTimeValue(selected);
                          const newVal = Object.assign({}, formContext.getValue('leave_table'), {
                            timePeriod: selected,
                            timeValue: value
                          });
                          leaveTableContext.setValue(newVal, () => {
                            onChangeTimeValue(value);
                            onChangeTimePeriod(selected);
                          });
                        }}
                        className="ma__select-box js-dropdown"
                      />
                      {show && payrollBase === 'all' && (
                        <table className="ma__table">
                          <tbody>
                          <tr className="ma__table-headers">
                            <th>Contribution</th>
                            <th>Medical Leave</th>
                            <th>Family Leave</th>
                            <th>Total</th>
                          </tr>
                          <tr>
                            <th rowSpan="1">You will pay:</th>
                            <td>{toCurrency(medLeaveComp / timeValue)}</td>
                            <td>{toCurrency(famLeaveComp / timeValue)}</td>
                            <td>{toCurrency((medLeaveComp + famLeaveComp) / timeValue)}</td>
                          </tr>
                          <tr>
                            <th rowSpan="1">Your Employees will pay:</th>
                            <td>{toCurrency(medLeaveEmp / timeValue)}</td>
                            <td>{toCurrency(famLeaveEmp / timeValue)}</td>
                            <td>{toCurrency((medLeaveEmp + famLeaveEmp) / timeValue)}</td>
                          </tr>
                          </tbody>
                        </table>
                      )}
                      {show && payrollBase === 'one' && (
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
                    </h2>
                  </Fragment>
                );
              }
              return null;
            }
          }
        </InputContext.Consumer>
      </Input>
    </React.Fragment>
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
