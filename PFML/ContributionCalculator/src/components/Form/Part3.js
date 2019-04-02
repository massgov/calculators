import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import { SelectBox, Input, InputSlider, InputNumber, FormContext, InputContext, Table, InputSync } from '@massds/mayflower-react';
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
  const formContext = useContext(FormContext);
  const {
    totContribution, totMedPercent, totFamPercent, largeCompFamCont, smallCompFamCont, empMedCont, largeCompMedCont, smallCompMedCont, socialSecCap, emp1099Fraction, minEmployees
  } = ContributionVariables.baseVariables;
  const { questionOne, questionTwo } = PartThreeProps;
  const {
    onChangeMedCont, onChangeFamCont, onChangeTimeValue, onChangeTimePeriod
  } = props;

  const getTimeValue = (text) => {
    let value = null;
    questionTwo.options.forEach((period) => {
      if (period.text === text) {
        value = period.value;
      }
    });
    return value;
  };
  const {
    payroll1099, payrollW2, payWages, mass_employees, employeesW2, employees1099, timePeriod = props.timePeriod || 'Year'
  } = formContext.getInputProviderValues();

  let payrollBase = formContext.getInputProviderValue('payrollBase');
  const empCount = employeesW2 + (employees1099 / (employees1099 + employeesW2) >= emp1099Fraction ? employees1099 : 0);
  const famLeaveDefault = (empCount >= minEmployees) ? largeCompFamCont : smallCompFamCont;
  const medLeaveDefault = (empCount >= minEmployees) ? largeCompMedCont : smallCompMedCont;
  const leaveTableDefaults = {
    famCont: props.famCont && !Number.isNaN(props.famCont) ? Number(props.famCont) : famLeaveDefault,
    medCont: props.medCont && !Number.isNaN(props.medCont) ? Number(props.medCont) : medLeaveDefault,
    timeValue: props.timeValue && !Number.isNaN(props.timeValue) ? Number(props.timeValue) : 1,
    timePeriod
  };
  leaveTableDefaults['family-leave'] = String(Math.round(Number(leaveTableDefaults.famCont) * 100));
  leaveTableDefaults['medical-leave'] = String(Math.round(Number(leaveTableDefaults.medCont) * 100));
  let familyLeave = formContext.getInputProviderValue('family-leave') || leaveTableDefaults.famCont;
  let medicalLeave = formContext.getInputProviderValue('medical-leave') || leaveTableDefaults.medCont;
  let over50 = (Number(employees1099) / (Number(employeesW2) + Number(employees1099))) >= emp1099Fraction;
  let over25 = empCount >= minEmployees;
  let totalPayroll;
  if (payrollBase === 'all' && Number(employeesW2) > 0) {
    totalPayroll = over50 ? (Number(numbro.unformat(payroll1099)) + Number(numbro.unformat(payrollW2))) : Number(numbro.unformat(payrollW2));
  } else if (payrollBase === 'all' && !(employeesW2 > 0)) {
    totalPayroll = Number(numbro.unformat(payroll1099));
  } else {
    totalPayroll = Number(numbro.unformat(payWages)) > socialSecCap ? socialSecCap : Number(numbro.unformat(payWages));
  }
  let minMed = over25 ? largeCompMedCont : smallCompMedCont;
  let maxMed = over25 ? (largeCompMedCont + empMedCont) : (smallCompMedCont + empMedCont);
  let minFam = over25 ? largeCompFamCont : smallCompFamCont;
  let minMedPer = Math.round(minMed * 100);
  let maxMedPer = Math.round(maxMed * 100);
  let minFamPer = Math.round(minFam * 100);
  let medLeaveCont = medicalLeave > minMedPer ? medicalLeave / 100 : minMed;
  let famLeaveCont = familyLeave > minFamPer ? familyLeave / 100 : minFam;
  let hasMassEmployees = mass_employees === 'yes';
  let medPercent = totContribution * totMedPercent;
  let famPercent = totContribution * totFamPercent;
  let medLeave = totalPayroll * medPercent;
  let famLeave = totalPayroll * famPercent;
  let medLeaveComp = medLeave * medLeaveCont;
  let famLeaveComp = famLeave * famLeaveCont;
  let medLeaveEmp = medLeave * (maxMed - medLeaveCont);
  let famLeaveEmp = famLeave * (1 - famLeaveCont);
  let timeValue = getTimeValue(timePeriod);
  let medLeaveTotal = (medLeaveComp + medLeaveEmp) / timeValue;
  let famLeaveTotal = (famLeaveComp + famLeaveEmp) / timeValue;
  let tBody = payrollBase === 'all' ? AllTableData.bodies[0] : SingleTableData.bodies[0];
  let tRow1 = tBody.rows[0];
  let tRow2 = tBody.rows[1];
  let tRow3 = tBody.rows[2];
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
    // const fracNum = value > minFamPer ? value / 100 : minFam;
    // const newVal = Object.assign({}, leaveTableContext.getValue(), {
    //   famCont: fracNum,
    //   'family-leave': String(value)
    // });
    // const newPartOne = Object.assign({}, partOneContext.getValue(), {
    //   famLeaveCont: fracNum
    // });
    // partOneContext.setValue(newPartOne, () => {
    //   leaveTableContext.setValue(newVal, () => {
    //     formContext.setValue({ id: 'famEmployerCont', value });
    //     formContext.setValue({ id: 'famEmployeeCont', value: (100 - value) });
    //     onChangeFamCont(fracNum);
    //   });
    // });
  };
  const onMedSliderChange = (value) => {
    // const fracNum = value > minMedPer ? value / 100 : minMed;
    // const newVal = Object.assign({}, leaveTableContext.getValue(), {
    //   medCont: fracNum,
    //   'medical-leave': String(value)
    // });
    // const newPartOne = Object.assign({}, partOneContext.getValue(), {
    //   medLeaveCont: fracNum
    // });
    // partOneContext.setValue(newPartOne, () => {
    //   leaveTableContext.setValue(newVal, () => {
    //     formContext.setValue({ id: 'medEmployerCont', value });
    //     formContext.setValue({ id: 'medEmployeeCont', value: (maxMedPer - value) });
    //     onChangeMedCont(fracNum);
    //   });
    // });
  };

  const onFamChange = (event, value, id) => {
    // const fam = formContext.getValue(id);
    // const fracNum = fam > minFamPer ? fam / 100 : minFam;
    // const newVal = Object.assign({}, leaveTableContext.getValue(), {
    //   famCont: fracNum,
    //   'family-leave': String(value)
    // });
    //
    // const newPartOne = Object.assign({}, partOneContext.getValue(), {
    //   famLeaveCont: fracNum
    // });
    // // Update part one content...
    // partOneContext.setValue(newPartOne, () => {
    //   // Then update the leave table content...
    //   leaveTableContext.setValue(newVal, () => {
    //     // Then keep the inputs in sync...
    //     formContext.setValue({ id: 'family-leave', value: String(fam) });
    //     const updateId = (id === 'famEmployeeCont') ? 'famEmployerCont' : 'famEmployeeCont';
    //     formContext.setValue({
    //       id: updateId,
    //       value: (updateId === 'famEmployeeCont') ? (100 - fam) : fam
    //     });
    //     onChangeFamCont(fracNum);
    //   });
    // });
  };
  const onMedChange = (event, value, id) => {
    // const med = formContext.getValue(id);
    // const fracNum = med > minMedPer ? med / 100 : minMed;
    // const newVal = Object.assign({}, leaveTableContext.getValue(), {
    //   famCont: fracNum,
    //   'medical-leave': String(value)
    // });
    //
    // const newPartOne = Object.assign({}, partOneContext.getValue(), {
    //   medLeaveCont: fracNum
    // });
    // // Update part one content...
    // partOneContext.setValue(newPartOne, () => {
    //   // Then update the leave table content...
    //   leaveTableContext.setValue(newVal, () => {
    //     // Then keep the inputs in sync...
    //     formContext.setValue({ id: 'medical-leave', value: String(med) });
    //     const updateId = (id === 'medEmployeeCont') ? 'medEmployerCont' : 'medEmployeeCont';
    //     formContext.setValue({
    //       id: updateId,
    //       value: (updateId === 'medEmployeeCont') ? (100 - med) : med
    //     });
    //     onChangeMedCont(fracNum);
    //   });
    // });
  };

  if (payrollBase === 'all' && !formContext.hasInputProviderIds(['payroll1099', 'payrollW2'])) {
    return null;
  }
  if (payrollBase === 'one' && !formContext.hasInputProviderId(['payrollWages'])) {
    return null;
  }
  const medEmployerContOverride = (sourceInputId, val) => {
    if (['medEmployeeCont'].indexOf(sourceInputId) > -1) {
      return String(Math.round(100 - Number(val)));
    }
    return String(val);
  };
  const medEmployeeContOverride = (sourceInputId, val) => {
    if (['medEmployerCont', 'medical-leave'].indexOf(sourceInputId) > -1) {
      return String(Math.round(100 - Number(val)));
    }
    return String(val);
  };
  return(
    <InputSync

      inputProviderIds={['payrollBase', 'payrollWages', 'employeesW2', 'employees1099', 'payroll1099', 'payrollW2', 'family-leave', 'famEmployerCont', 'famEmployeeCont', 'medEmployerCont', 'medical-leave', 'medEmployeeCont', 'timePeriod']}
    >
      {() => {
        const empw2 = Number(formContext.getInputProviderValue('employeesW2'));
        const emp1099 = Number(formContext.getInputProviderValue('employees1099'));
        const employeeCount = Number(empw2) + (Number(emp1099) / (Number(emp1099) + Number(empw2)) >= emp1099Fraction ? Number(emp1099) : 0);
        over25 = employeeCount >= minEmployees;
        minMed = over25 ? largeCompMedCont : smallCompMedCont;
        maxMed = over25 ? (largeCompMedCont + empMedCont) : (smallCompMedCont + empMedCont);
        minFam = over25 ? largeCompFamCont : smallCompFamCont;
        minMedPer = Math.round(minMed * 100);
        maxMedPer = Math.round(maxMed * 100);
        minFamPer = Math.round(minFam * 100);
        familyLeave = formContext.getInputProviderValue('family-leave') || leaveTableDefaults.famCont;
        medicalLeave = formContext.getInputProviderValue('medical-leave') || leaveTableDefaults.medCont;
        medLeaveCont = medicalLeave > minMedPer ? medicalLeave / 100 : minMed;
        famLeaveCont = familyLeave > minFamPer ? familyLeave / 100 : minFam;
        hasMassEmployees = formContext.getInputProviderValue('mass_employees') === 'yes';
        over50 = (Number(emp1099) / (Number(empw2) + Number(emp1099))) >= emp1099Fraction;
        payrollBase = formContext.getInputProviderValue('payrollBase');
        const pay1099 = formContext.getInputProviderValue('payroll1099') || '';
        const pWages = formContext.getInputProviderValue('payrollWages') || '';
        const payW2 = formContext.getInputProviderValue('payrollW2') || '';
        if (payrollBase === 'all' && Number(empw2) > 0) {
          totalPayroll = over50 ? (Number(numbro.unformat(pay1099)) + Number(numbro.unformat(payW2))) : Number(numbro.unformat(payW2));
        } else if (payrollBase === 'all' && (Number(empw2) <= 0)) {
          totalPayroll = Number(numbro.unformat(pay1099));
        } else {
          totalPayroll = Number(numbro.unformat(pWages)) > socialSecCap ? socialSecCap : Number(numbro.unformat(pWages));
        }
        medPercent = totContribution * totMedPercent;
        famPercent = totContribution * totFamPercent;
        medLeave = totalPayroll * medPercent;
        famLeave = totalPayroll * famPercent;
        medLeaveComp = medLeave * medLeaveCont;
        famLeaveComp = famLeave * famLeaveCont;
        medLeaveEmp = medLeave * (maxMed - medLeaveCont);
        famLeaveEmp = famLeave * (1 - famLeaveCont);
        timeValue = Number(getTimeValue(formContext.getInputProviderValue('timePeriod')));
        medLeaveTotal = (medLeaveComp + medLeaveEmp) / timeValue;
        famLeaveTotal = (famLeaveComp + famLeaveEmp) / timeValue;
        tBody = payrollBase === 'all' ? AllTableData.bodies[0] : SingleTableData.bodies[0];
        tRow1 = tBody.rows[0];
        tRow2 = tBody.rows[1];
        tRow3 = tBody.rows[2];

        tRow1.cells[1].text = toCurrency(medLeaveComp / timeValue);
        tRow1.cells[2].text = toCurrency(famLeaveComp / timeValue);
        tRow1.cells[3].text = toCurrency((medLeaveComp + famLeaveComp) / timeValue);
        tRow2.cells[1].text = toCurrency(medLeaveEmp / timeValue);
        tRow2.cells[2].text = toCurrency(famLeaveEmp / timeValue);
        tRow2.cells[3].text = toCurrency((medLeaveEmp + famLeaveEmp) / timeValue);
        tRow3.cells[1].text = toCurrency(medLeaveTotal);
        tRow3.cells[2].text = toCurrency(famLeaveTotal);
        tRow3.cells[3].text = toCurrency(medLeaveTotal + famLeaveTotal);
        const enableAll = payrollBase === 'all' && (Number(empw2) <= 0 || Number(numbro.unformat(payW2)) <= 0 || Number(emp1099) <= 0 || Number(numbro.unformat(pay1099)) <= 0 || (over50 ? Number(numbro.unformat(pay1099)) <= 0 : false));
        const enableOne = payrollBase === 'one' && Number(numbro.unformat(pWages)) <= 0;
        const enable = hasMassEmployees && (employeeCount > 0) && (payrollBase === 'all' ? !enableOne : !enableAll);
        const famTicks = minFamPer === 0 ? [[0, '0%'], [100, '100%']] : [[0, '0%'], [minFamPer, 'Min Employer Contribution'], [100, '100%']];
        let medTicks = [[0, '0%'], [empMedCont * 100, `${empMedCont * 100}%`]];
        if (over25) {
          medTicks = minMedPer === 0 ? [[0, '0%'], [100, '100%']] : [[0, '0%'], [minMedPer, 'Min Employer Contribution'], [100, '100%']];
        }
        const familyLeaveSliderProps = {
          id: 'family-leave',
          labelText: '',
          required: true,
          defaultValue: String(leaveTableDefaults['family-leave']),
          axis: 'x',
          max: 100,
          min: minFamPer,
          step: 1,
          ticks: famTicks,
          domain: [0, 100],
          skipped: true,
          disabled: !enable,
          overrideLinkedValue: (sourceInputId, val) => {
            if (sourceInputId === 'famEmployeeCont') {
              return(String(Math.round(100 - Number(val))));
            }
            return String(val);
          }
        };
        const medLeaveSliderProps = {
          id: 'medical-leave',
          labelText: '',
          required: true,
          defaultValue: String(leaveTableDefaults['medical-leave']),
          axis: 'x',
          max: maxMedPer,
          min: minMedPer,
          step: 1,
          domain: [0, maxMedPer],
          ticks: medTicks,
          skipped: true,
          disabled: !enable,
          overrideLinkedValue: (sourceInputId, val) => {
            if (['medEmployeeCont'].indexOf(sourceInputId) > -1) {
              return(Math.round(100 - Number(val)).toString());
            }
            return val;
          }
        };
        console.log('medLeaveCont', medLeaveCont);
        console.log('minMedPer', minMedPer);
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
                        linkedInputProviders={['family-leave', 'famEmployeeCont']}
                        overrideLinkedValue={(sourceInputId, val) => {
                          if (sourceInputId === 'famEmployeeCont') {
                            return(100 - Number(val));
                          }
                          return Number(val);
                        }}
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
                        defaultValue={Math.round((1 - Number(famLeaveCont)) * 100)}
                        unit="%"
                        required
                        disabled={!enable}
                        showButtons={false}
                        overrideLinkedValue={(sourceInputId, val) => {
                          if (['family-leave', 'famEmployerCont'].indexOf(sourceInputId) > -1) {
                            return(100 - Number(val));
                          }
                          return Number(val);
                        }}
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
                        defaultValue={minMedPer}
                        unit="%"
                        required
                        step={1}
                        showButtons={false}
                        disabled={!enable}
                        linkedInputProviders={['medEmployeeCont', 'medical-leave']}
                        overrideLinkedValue={medEmployerContOverride}
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
                        overrideLinkedValue={medEmployeeContOverride}
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
                  <Input id="timePeriod" defaultValue={timePeriod || 'Year'} useOwnStateValue>
                    <InputContext.Consumer>
                      {
                        (timeContext) => (
                          <div className="ma__table-heading">
                            <SelectBox
                              label={questionTwo.question}
                              stackLabel={false}
                              required
                              id="timePeriod"
                              options={questionTwo.options}
                              selected={timeContext.getOwnValue()}
                              onChangeCallback={({ selected }) => {
                                const value = getTimeValue(selected);
                                // const newVal = Object.assign({}, leaveTableContext.getValue(), {
                                //   timePeriod: selected,
                                //   timeValue: value
                                // });
                                timeContext.setOwnValue(selected, () => {
                                  onChangeTimeValue(value);
                                  onChangeTimePeriod(selected);
                                });
                              }}
                              className="ma__select-box js-dropdown"
                            />
                          </div>
                        )
                      }
                    </InputContext.Consumer>
                  </Input>
                  <Table {...(formContext.getInputProviderValue('payrollBase') === 'all' ? AllTableData : SingleTableData)} />
                </Fragment>
              )
            }
          </Fragment>
        );
      }}
    </InputSync>
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
