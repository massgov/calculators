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
  if (!formContext.hasInputProviderIds(['payrollBase', 'mass_employees'])) {
    return null;
  }
  const {
    totContribution, totMedPercent, totFamPercent, largeCompFamCont, smallCompFamCont, empMedCont, largeCompMedCont, smallCompMedCont, socialSecCap, emp1099Fraction, minEmployees
  } = ContributionVariables.baseVariables;
  const { questionOne, questionTwo } = PartThreeProps;
  const {
    onChangeMedCont, onChangeFamCont, onChangeTimeValue, onChangeTimePeriod
  } = props;

  const { employeesW2, employees1099 } = formContext.getInputProviderValues();

  const getTimeValue = (text) => {
    let value = null;
    questionTwo.options.forEach((period) => {
      if (period.text === text) {
        value = period.value;
      }
    });
    return value;
  };
  const empCount = Number(employeesW2) + (Number(employees1099) / (Number(employees1099) + Number(employeesW2)) >= emp1099Fraction ? Number(employees1099) : 0);

  const famLeaveDefault = (empCount >= minEmployees) ? largeCompFamCont : smallCompFamCont;
  const medLeaveDefault = (empCount >= minEmployees) ? largeCompMedCont : smallCompMedCont;
  const leaveTableDefaults = {
    famCont: props.famCont && !Number.isNaN(props.famCont) ? Number(props.famCont) : Math.round(famLeaveDefault * 100),
    medCont: props.medCont && !Number.isNaN(props.medCont) ? Number(props.medCont) : Math.round(medLeaveDefault * 100),
    timeValue: props.timeValue && !Number.isNaN(props.timeValue) ? Number(props.timeValue) : 1,
    timePeriod: props.timePeriod && props.timePeriod !== '' ? props.timePeriod : 'Year'
  };
  const {
    payroll1099, payrollW2, payrollWages, mass_employees, timePeriod = leaveTableDefaults.timePeriod, payrollBase
  } = formContext.getInputProviderValues();

  leaveTableDefaults['family-leave'] = String(leaveTableDefaults.famCont);
  leaveTableDefaults['medical-leave'] = String(leaveTableDefaults.medCont);
  const familyLeave = Number(formContext.getInputProviderValue('family-leave')) || Number(leaveTableDefaults.famCont);
  const medicalLeave = Number(formContext.getInputProviderValue('medical-leave')) || Number(leaveTableDefaults.medCont);
  const over50 = (Number(employees1099) / (Number(employeesW2) + Number(employees1099))) >= emp1099Fraction;
  const over25 = empCount >= minEmployees;
  let totalPayroll;
  if (payrollBase === 'all' && Number(employeesW2) > 0) {
    totalPayroll = over50 ? (Number(numbro.unformat(payroll1099)) + Number(numbro.unformat(payrollW2))) : Number(numbro.unformat(payrollW2));
  } else if (payrollBase === 'all' && !(Number(employeesW2) > 0)) {
    totalPayroll = Number(numbro.unformat(payroll1099));
  } else {
    totalPayroll = Number(numbro.unformat(payrollWages)) > socialSecCap ? socialSecCap : Number(numbro.unformat(payrollWages));
  }
  const minMed = over25 ? largeCompMedCont : smallCompMedCont;
  const maxMed = over25 ? (largeCompMedCont + empMedCont) : (smallCompMedCont + empMedCont);
  const minFam = over25 ? largeCompFamCont : smallCompFamCont;
  const minMedPer = Math.round(minMed * 100);
  const maxMedPer = Math.round(maxMed * 100);
  const minFamPer = Math.round(minFam * 100);
  const medLeaveCont = medicalLeave > minMedPer ? medicalLeave / 100 : minMed;
  const famLeaveCont = familyLeave > minFamPer ? familyLeave / 100 : minFam;
  const hasMassEmployees = mass_employees === 'yes';
  const medPercent = totContribution * totMedPercent;
  const famPercent = totContribution * totFamPercent;
  const medLeave = totalPayroll * medPercent;
  const famLeave = totalPayroll * famPercent;
  const medLeaveComp = medLeave * medLeaveCont;
  const famLeaveComp = famLeave * famLeaveCont;
  const medLeaveEmp = medLeave * (maxMed - medLeaveCont);
  const famLeaveEmp = famLeave * (1 - famLeaveCont);
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

  if (payrollBase === 'all' && !formContext.hasInputProviderIds(['payroll1099', 'payrollW2'])) {
    return null;
  }
  if (payrollBase === 'one' && !formContext.hasInputProviderId(['payrollWages'])) {
    return null;
  }
  const enableAll = payrollBase === 'all' && (Number(employeesW2) > 0 && Number(numbro.unformat(payrollW2)) > 0 && Number(employees1099) > 0 && Number(numbro.unformat(payroll1099)) > 0 && (over50 ? Number(numbro.unformat(payroll1099)) > 0 : true));
  const enableOne = payrollBase === 'one' && Number(numbro.unformat(payrollWages)) > 0;
  const enable = hasMassEmployees && (empCount > 0) && (payrollBase === 'all' ? enableAll : enableOne);
  const famTicks = minFamPer === 0 ? [[0, '0%'], [100, '100%']] : [[0, '0%'], [minFamPer, 'Min Employer Contribution'], [100, '100%']];
  let medTicks = [[0, '0%'], [empMedCont * 100, `${empMedCont * 100}%`]];
  if (over25) {
    medTicks = minMedPer === 0 ? [[0, '0%'], [100, '100%']] : [[0, '0%'], [minMedPer, 'Min Employer Contribution'], [100, '100%']];
  }
  const famSliderOnChange = (val, sourceInputId) => {
    famOnChange(val, sourceInputId);
  };
  const famNumberOnChange = (event, val, sourceInputId) => {
    famOnChange(val, sourceInputId);
  };
  const famOnChange = (val, sourceInputId) => {
    if (['family-leave', 'famEmployerCont'].indexOf(sourceInputId) > -1) {
      const newVal = Math.round(Math.abs(100 - val));
      if (Number(formContext.getInputProviderValue('famEmployeeCont')) !== Number(newVal)) {
        formContext.setInputProviderValue({
          id: 'famEmployeeCont',
          value: Number(newVal)
        }, () => {
          if (sourceInputId === 'family-leave') {
            if (Number(formContext.getInputProviderValue('famEmployerCont')) !== Number(val)) {
              formContext.setInputProviderValue({
                id: 'famEmployerCont',
                value: Number(val)
              }, () => onChangeFamCont(val));
            }
          }
          if (sourceInputId === 'famEmployerCont') {
            if (String(formContext.getInputProviderValue('family-leave')) !== String(val)) {
              formContext.setInputProviderValue({
                id: 'family-leave',
                value: String(val)
              }, () => onChangeFamCont(val));
            }
          }
        });
      }
    }
    if (sourceInputId === 'famEmployeeCont') {
      const newVal = Math.round(Math.abs(100 - val));
      if (Number(formContext.getInputProviderValue('famEmployerCont')) !== Number(newVal)) {
        formContext.setInputProviderValue({
          id: 'famEmployerCont',
          value: Number(newVal)
        });
      }
      if (String(formContext.getInputProviderValue('family-leave')) !== String(newVal)) {
        formContext.setInputProviderValue({
          id: 'family-leave',
          value: String(newVal)
        });
      }
    }
  };
  const familyLeaveSliderProps = {
    id: 'family-leave',
    labelText: '',
    required: true,
    axis: 'x',
    max: 100,
    min: minFamPer,
    step: 1,
    ticks: famTicks,
    domain: [minFamPer, 100],
    skipped: true,
    disabled: !enable,
    defaultValue: Number(familyLeave).toString(),
    onUpdate: famSliderOnChange
  };
  const medNumberOnChange = (event, val, sourceInputId) => {
    medOnChange(val, sourceInputId);
  };
  const medSliderOnChange = (val, sourceInputId) => {
    medOnChange(val, sourceInputId);
  };
  const medOnChange = (val, sourceInputId) => {
    if (['medical-leave', 'medEmployerCont'].indexOf(sourceInputId) > -1) {
      const newVal = Math.round(Math.abs(maxMedPer - val));
      if (Number(formContext.getInputProviderValue('medEmployeeCont')) !== Number(newVal)) {
        formContext.setInputProviderValue({
          id: 'medEmployeeCont',
          value: Number(newVal)
        }, () => {
          if (sourceInputId === 'medical-leave') {
            if (Number(formContext.getInputProviderValue('medEmployerCont')) !== Number(val)) {
              formContext.setInputProviderValue({
                id: 'medEmployerCont',
                value: Number(val)
              }, () => onChangeMedCont(val));
            }
          }
          if (sourceInputId === 'medEmployerCont') {
            if (String(formContext.getInputProviderValue('medical-leave')) !== String(val)) {
              formContext.setInputProviderValue({
                id: 'medical-leave',
                value: String(val)
              }, () => onChangeMedCont(val));
            }
          }
        });
      }
    }
    if (sourceInputId === 'medEmployeeCont') {
      const newVal = Math.round(Math.abs((maxMedPer) - val));
      if (Number(formContext.getInputProviderValue('medEmployerCont')) !== Number(newVal)) {
        formContext.setInputProviderValue({
          id: 'medEmployerCont',
          value: Number(newVal)
        });
      }
      if (String(formContext.getInputProviderValue('medical-leave')) !== String(newVal)) {
        formContext.setInputProviderValue({
          id: 'medical-leave',
          value: String(newVal)
        });
      }
    }
  };
  const medLeaveSliderProps = {
    id: 'medical-leave',
    labelText: '',
    required: true,
    axis: 'x',
    max: maxMedPer,
    min: minMedPer,
    step: 1,
    domain: [0, maxMedPer],
    ticks: medTicks,
    skipped: true,
    disabled: !enable,
    defaultValue: Number(medicalLeave).toString(),
    useOwnStateValue: true,
    onUpdate: medSliderOnChange
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
                  unit="%"
                  required
                  max={100}
                  min={minFamPer}
                  step={1}
                  showButtons={false}
                  disabled={!enable}
                  defaultValue={Number(familyLeave)}
                  onChange={famNumberOnChange}
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
                  unit="%"
                  required
                  disabled={!enable}
                  showButtons={false}
                  defaultValue={(100 - Number(familyLeave))}
                  onChange={famNumberOnChange}
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
                  unit="%"
                  required
                  step={1}
                  showButtons={false}
                  disabled={!enable}
                  defaultValue={medicalLeave}
                  onChange={medNumberOnChange}
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
                  unit="%"
                  required
                  disabled={!enable}
                  showButtons={false}
                  step={1}
                  defaultValue={Math.round((maxMed - medLeaveCont) * 100)}
                  onChange={medNumberOnChange}
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
            <Input id="timePeriod" defaultValue={timePeriod} useOwnStateValue>
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
};

Part3.propTypes = {
  /** Functions that push changed context props to the url. */
  onChangeMedCont: PropTypes.func,
  onChangeFamCont: PropTypes.func,
  onChangeTimePeriod: PropTypes.func,
  onChangeTimeValue: PropTypes.func
};

export default addUrlProps({ mapUrlChangeHandlersToProps })(Part3);
