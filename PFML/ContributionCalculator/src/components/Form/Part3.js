import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import { SelectBox, Input, InputSlider, InputNumber, FormContext, InputContext, Table } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import { toCurrency, getHelpTip } from '../../utils';
import ContributionVariables from '../../data/ContributionVariables.json';
import PartThreeProps from '../../data/PartThree.json';
import AllTableData from '../../data/AllTable.data';
import SingleTableData from '../../data/SingleTable.data';

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
    totContribution, totMedPercent, totFamPercent, largeCompFamCont, smallCompFamCont, empMedCont, largeCompMedCont, smallCompMedCont, socialSecCap
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
    timePeriod: props.timePeriod || 'Year'
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
                mass_employees, over50, over25, empCount, famLeaveCont, medLeaveCont, w2: employeesW2, emp1099
              } = formContext.getValue('part_one');
              const {
                payrollBase, pay1099, payW2, payWages
              } = formContext.getValue('part_two');
              let totalPayroll;
              if (payrollBase === 'all' && employeesW2 > 0) {
                totalPayroll = over50 ? (numbro.unformat(pay1099) + numbro.unformat(payW2)) : numbro.unformat(payW2);
              } else if (payrollBase === 'all' && !(employeesW2 > 0)) {
                totalPayroll = numbro.unformat(pay1099);
              } else {
                totalPayroll = numbro.unformat(payWages) > socialSecCap ? socialSecCap : numbro.unformat(payWages);
              }
              const minMed = over25 ? largeCompMedCont : smallCompMedCont;
              const maxMed = over25 ? (largeCompMedCont + empMedCont) : (smallCompMedCont + empMedCont);
              const minFam = over25 ? largeCompFamCont : smallCompFamCont;
              const minMedPer = Math.round(minMed * 100);
              const maxMedPer = Math.round(maxMed * 100);
              const minFamPer = Math.round(minFam * 100);
              const famTicks = minFamPer === 0 ? [[0, '0%'], [100, '100%']] : [[0, '0%'], [minFamPer, 'Min Employer Contribution'], [100, '100%']];
              let medTicks = [[0, '0%'], [empMedCont * 100, `${empMedCont * 100}%`]];
              if (over25) {
                medTicks = minMedPer === 0 ? [[0, '0%'], [100, '100%']] : [[0, '0%'], [minMedPer, 'Min Employer Contribution'], [100, '100%']];
              }
              const hasMassEmployees = (mass_employees) === 'yes';
              const disableAll = payrollBase === 'all' && ((employeesW2 > 0 && numbro.unformat(payW2) > 0) || (!(employeesW2 > 0) && emp1099 > 0 && numbro.unformat(pay1099) > 0)) && (over50 ? numbro.unformat(pay1099) > 0 : true);
              const disableOne = payrollBase === 'one' && numbro.unformat(payWages) > 0;
              const enable = hasMassEmployees && (empCount > 0) && (disableOne || disableAll);
              const medPercent = totContribution * totMedPercent;
              const famPercent = totContribution * totFamPercent;
              const medLeave = totalPayroll * medPercent;
              const famLeave = totalPayroll * famPercent;
              const medLeaveComp = medLeave * medLeaveCont;
              const famLeaveComp = famLeave * famLeaveCont;
              const medLeaveEmp = medLeave * (maxMed - medLeaveCont);
              const famLeaveEmp = famLeave * (1 - famLeaveCont);
              const timePeriod = formContext.getValue('leave_table').timePeriod;
              const timeValue = getTimeValue(timePeriod);
              const medLeaveTotal = (medLeaveComp + medLeaveEmp) / timeValue;
              const famLeaveTotal = (famLeaveComp + famLeaveEmp) / timeValue;
              const tBody = payrollBase === 'all' ? AllTableData.bodies[0] : SingleTableData.bodies[0];
              const tRow1 = tBody.rows[0];
              const tRow2 = tBody.rows[1];
              const tRow3 = tBody.rows[2];
              tRow1.cells[1].text = toCurrency(medLeaveComp / timeValue);
              tRow1.cells[2].text = toCurrency(famLeaveComp / timeValue);
              tRow1.cells[3].text = toCurrency((medLeaveComp + famLeaveComp) / timeValue);
              tRow2.cells[1].text = toCurrency(medLeaveEmp / timeValue);
              tRow2.cells[2].text = toCurrency(famLeaveEmp / timeValue);
              tRow2.cells[3].text = toCurrency((medLeaveEmp + famLeaveEmp) / timeValue);
              tRow3.cells[1].text = toCurrency(medLeaveTotal);
              tRow3.cells[2].text = toCurrency(famLeaveTotal);
              tRow3.cells[3].text = toCurrency(medLeaveTotal + famLeaveTotal);

              const onFamSliderChange = (value) => {
                const fracNum = value > minFamPer ? value / 100 : minFam;
                const newVal = Object.assign({}, leaveTableContext.getValue(), {
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
                const newVal = Object.assign({}, leaveTableContext.getValue(), {
                  medCont: fracNum,
                  'medical-leave': String(value)
                });
                const newPartOne = Object.assign({}, partOneContext.getValue(), {
                  medLeaveCont: fracNum
                });
                partOneContext.setValue(newPartOne, () => {
                  leaveTableContext.setValue(newVal, () => {
                    formContext.setValue({ id: 'medEmployerCont', value });
                    formContext.setValue({ id: 'medEmployeeCont', value: (maxMedPer - value) });
                    onChangeMedCont(fracNum);
                  });
                });
              };

              const onFamChange = (event, value, id) => {
                const fam = formContext.getValue(id);
                const fracNum = fam > minFamPer ? fam / 100 : minFam;
                const newVal = Object.assign({}, leaveTableContext.getValue(), {
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
                const newVal = Object.assign({}, leaveTableContext.getValue(), {
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
                defaultValue: String(leaveTableContext.getValue()['family-leave']),
                axis: 'x',
                max: 100,
                min: minFamPer,
                step: 1,
                ticks: famTicks,
                domain: [0, 100],
                skipped: true,
                disabled: !enable,
                onChange: onFamSliderChange
              };
              const medLeaveSliderProps = {
                id: 'medical-leave',
                labelText: '',
                required: true,
                defaultValue: String(leaveTableContext.getValue()['medical-leave']),
                axis: 'x',
                max: maxMedPer,
                min: minMedPer,
                step: 1,
                domain: [0, maxMedPer],
                ticks: medTicks,
                skipped: true,
                disabled: !enable,
                onChange: onMedSliderChange
              };

                return(
                  <Fragment>
                    <fieldset>
                      <legend className={`ma__label${enable ? '' : ' ma__label--disabled'}`}>
                        {over25 ? getHelpTip(questionOne.over25) : getHelpTip(questionOne.under25)}
                      </legend>
                      <div className="ma__input-group--two">
                        <div className="ma__input-group">
                          <label htmlFor="famEmployerCont" className={`ma__label ma__label--required${!enable ? ' ma__label--disabled' : ''}`}>Family Leave</label>
                          <div className="ma__input-group-right">
                            <div className="ma__input-group--ends">
                              <InputNumber
                                labelText={questionOne.left.left}
                                name="famEmployerCont"
                                id="famEmployerCont"
                                width={0}
                                maxlength={3}
                                placeholder="e.g. 50"
                                inline={false}
                                defaultValue={Math.round(famLeaveCont * 100)}
                                unit="%"
                                required
                                max={100}
                                min={minFamPer}
                                step={1}
                                showButtons={false}
                                disabled={!enable}
                                onChange={onFamChange}
                              />
                              <InputNumber
                                labelText={questionOne.left.right}
                                name="famEmployeeCont"
                                id="famEmployeeCont"
                                width={0}
                                maxlength={3}
                                placeholder="e.g. 50"
                                inline={false}
                                step={1}
                                max={100}
                                min={0}
                                defaultValue={Math.round((1 - famLeaveCont) * 100)}
                                unit="%"
                                required
                                disabled={!enable}
                                showButtons={false}
                                onChange={onFamChange}
                              />
                            </div>
                            <InputSlider {...familyLeaveSliderProps} />
                          </div>
                        </div>
                        <div className="ma__input-group">
                          <label htmlFor="medEmployerCont" className={`ma__label ma__label--required${!enable ? ' ma__label--disabled' : ''}`}>Medical Leave</label>
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
                                max={maxMedPer}
                                min={minMedPer}
                                defaultValue={Math.round(medLeaveCont * 100)}
                                unit="%"
                                required
                                step={1}
                                showButtons={false}
                                disabled={!enable}
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
                                max={maxMedPer - minMedPer}
                                min={0}
                                defaultValue={Math.round((maxMed - medLeaveCont) * 100)}
                                unit="%"
                                required
                                disabled={!enable}
                                showButtons={false}
                                step={1}
                                onChange={onMedChange}
                              />
                            </div>
                            <InputSlider {...medLeaveSliderProps} />
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    {
                      enable && (
                        <Fragment>
                          <div className="ma__table-heading">
                            <SelectBox
                              label={questionTwo.question}
                              stackLabel={false}
                              required
                              id="color-select"
                              options={questionTwo.options}
                              selected={timePeriod || 'Year'}
                              onChangeCallback={({ selected }) => {
                                const value = getTimeValue(selected);
                                const newVal = Object.assign({}, leaveTableContext.getValue(), {
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
                          </div>
                          <Table {...(payrollBase === 'all' ? AllTableData : SingleTableData)} />
                        </Fragment>
                      )
                    }
                  </Fragment>
                );
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
