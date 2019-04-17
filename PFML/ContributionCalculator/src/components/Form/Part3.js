import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import TagManager from 'react-gtm-module';
import numbro from 'numbro';
import { SelectBox, Input, InputSlider, InputNumber, FormContext, InputContext, Table } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import { toCurrency, getHelpTip } from '../../utils';
import ContributionVariables from '../../data/ContributionVariables.json';
import PartThreeProps from '../../data/PartThree.json';
import AllTableData from '../../data/AllTable.data';
import SingleTableData from '../../data/SingleTable.data';
import { getEmpCount, hasMassEmployees, isOver25, isOver50, getTotalPayroll } from './form.utils';

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
    totContribution, totMedPercent, totFamPercent, largeCompFamCont, smallCompFamCont, empMedCont, largeCompMedCont, smallCompMedCont, minEmployees
  } = ContributionVariables.baseVariables;
  const empCount = getEmpCount(formContext);
  const famLeaveDefault = (empCount >= minEmployees) ? largeCompFamCont : smallCompFamCont;
  const medLeaveDefault = (empCount >= minEmployees) ? largeCompMedCont : smallCompMedCont;
  const leaveTableDefaults = {
    famCont: !Number.isNaN(Number(props.famCont)) ? Number(props.famCont) : Math.round(famLeaveDefault * 100),
    medCont: !Number.isNaN(Number(props.medCont)) ? Number(props.medCont) : Math.round(medLeaveDefault * 100),
    timeValue: props.timeValue && !Number.isNaN(props.timeValue) ? Number(props.timeValue) : 1,
    timePeriod: props.timePeriod && props.timePeriod !== '' ? props.timePeriod : 'Year'
  };
  const {
    payroll1099, payrollW2, payrollWages, payrollBase
  } = formContext.getInputProviderValues();

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
  leaveTableDefaults['family-leave'] = String(leaveTableDefaults.famCont);
  leaveTableDefaults['medical-leave'] = String(leaveTableDefaults.medCont);
  const over50 = isOver50(formContext);
  const over25 = isOver25(formContext);
  const minMed = over25 ? largeCompMedCont : smallCompMedCont;
  const maxMed = over25 ? (largeCompMedCont + empMedCont) : (smallCompMedCont + empMedCont);
  const minFam = over25 ? largeCompFamCont : smallCompFamCont;
  const minMedPer = Math.round(minMed * 100);
  const maxMedPer = Math.round(maxMed * 100);
  const minFamPer = Math.round(minFam * 100);
  if (leaveTableDefaults.medCont > maxMedPer) {
    leaveTableDefaults.medCont = minMedPer;
  }
  if (leaveTableDefaults.medCont < minMedPer) {
    leaveTableDefaults.medCont = minMedPer;
  }
  const medPercent = totContribution * totMedPercent;
  const famPercent = totContribution * totFamPercent;
  const getMaxMedPer = () => {
    const max = isOver25(formContext) ? (largeCompMedCont + empMedCont) : (smallCompMedCont + empMedCont);
    return Math.round(max * 100);
  };
  const getMinMedPer = () => {
    const min = isOver25(formContext) ? largeCompMedCont : smallCompMedCont;
    return Math.round(min * 100);
  };
  const getMinFamPer = () => {
    const min = isOver25(formContext) ? largeCompFamCont : smallCompFamCont;
    return Math.round(min * 100);
  };
  const getTableProps = () => {
    const pBase = formContext.getInputProviderValue('payrollBase');
    const localMedLeaveCont = Number(formContext.getInputProviderValue('medical-leave')) > getMinMedPer() ? Number(formContext.getInputProviderValue('medical-leave')) / 100 : getMinMedPer() / 100;
    const localFamLeaveCont = Number(formContext.getInputProviderValue('family-leave')) > getMinFamPer() ? Number(formContext.getInputProviderValue('family-leave')) / 100 : getMinFamPer() / 100;
    const localMedLeave = getTotalPayroll(formContext) * medPercent;
    const localFamLeave = getTotalPayroll(formContext) * famPercent;
    const localMedLeaveComp = localMedLeave * localMedLeaveCont;
    const localFamLeaveComp = localFamLeave * localFamLeaveCont;
    const localMedLeaveEmp = localMedLeave * (maxMed - localMedLeaveCont);
    const localFamLeaveEmp = localFamLeave * (1 - localFamLeaveCont);
    const thisTimeValue = getTimeValue(formContext.getInputProviderValue('payroll_frequency'));
    const localMedLeaveTotal = (localMedLeaveComp + localMedLeaveEmp) / thisTimeValue;
    const localFamLeaveTotal = (localFamLeaveComp + localFamLeaveEmp) / thisTimeValue;

    const tableProps = pBase === 'all' ? JSON.parse(JSON.stringify(AllTableData)) : JSON.parse(JSON.stringify(SingleTableData));
    const tRow1 = tableProps.bodies[0].rows[0];
    const tRow2 = tableProps.bodies[0].rows[1];
    const tRow3 = tableProps.bodies[0].rows[2];
    tRow1.cells[1].text = toCurrency(localMedLeaveComp / thisTimeValue);
    tRow1.cells[1].heading = false;
    tRow1.cells[2].text = toCurrency(localFamLeaveComp / thisTimeValue);
    tRow1.cells[2].heading = false;
    tRow1.cells[3].text = toCurrency((localMedLeaveComp + localFamLeaveComp) / thisTimeValue);
    tRow1.cells[3].heading = false;
    tRow2.cells[1].text = toCurrency(localMedLeaveEmp / thisTimeValue);
    tRow2.cells[1].heading = false;
    tRow2.cells[2].text = toCurrency(localFamLeaveEmp / thisTimeValue);
    tRow2.cells[2].heading = false;
    tRow2.cells[3].text = toCurrency((localMedLeaveEmp + localFamLeaveEmp) / thisTimeValue);
    tRow2.cells[3].heading = false;
    tRow3.cells[1].text = toCurrency(localMedLeaveTotal);
    tRow3.cells[1].heading = false;
    tRow3.cells[2].text = toCurrency(localFamLeaveTotal);
    tRow3.cells[2].heading = false;
    tRow3.cells[3].text = toCurrency(localMedLeaveTotal + localFamLeaveTotal);
    tRow3.cells[3].heading = false;
    return tableProps;
  };

  const enableAll = payrollBase === 'all' && (!!Number(employeesW2) && !!Number(numbro.unformat(payrollW2)) && !!Number(employees1099) && !!Number(numbro.unformat(payroll1099)) && (over50 ? !!Number(numbro.unformat(payroll1099)) : true));
  const enableOne = payrollBase === 'one' && !!Number(numbro.unformat(payrollWages));
  const enable = hasMassEmployees(formContext) && (!!empCount) && (payrollBase === 'all' ? enableAll : enableOne);
  const famTicks = minFamPer === 0 ? [[0, '0%'], [100, '100%']] : [[0, '0%'], [minFamPer, 'Min Employer Contribution'], [100, '100%']];

  const famSliderOnChange = (val, sourceInputId) => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'gtm.slider',
        sliderValue: val,
        sliderID: sourceInputId
      }
    });
    famOnChange(val, sourceInputId);
  };
  const famNumberOnChange = (event, val, sourceInputId) => {
    famOnChange(val, sourceInputId);
  };
  const famOnChange = (defaultVal, sourceInputId) => {
    const val = Number.isNaN(Number(defaultVal)) ? 0 : Number(defaultVal);
    const maxPer = 100;
    if (['family-leave', 'famEmployerCont'].indexOf(sourceInputId) > -1) {
      const newVal = Math.round(maxPer - val);
      const currentFamEmployee = Number(formContext.getInputProviderValue('famEmployeeCont'));
      if (currentFamEmployee !== newVal) {
        formContext.setInputProviderValue({
          id: 'famEmployeeCont',
          value: newVal
        }, () => {
          if (sourceInputId === 'family-leave') {
            if (Number(formContext.getInputProviderValue('famEmployerCont')) !== val) {
              formContext.setInputProviderValue({
                id: 'famEmployerCont',
                value: val
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
      const newVal = Math.round(maxPer - val);
      if (Number(formContext.getInputProviderValue('famEmployerCont')) !== newVal) {
        formContext.setInputProviderValue({
          id: 'famEmployerCont',
          value: newVal
        }, () => onChangeFamCont(newVal));
      }
      if (String(formContext.getInputProviderValue('family-leave')) !== String(newVal)) {
        formContext.setInputProviderValue({
          id: 'family-leave',
          value: String(newVal)
        }, () => onChangeFamCont(newVal));
      }
    }
  };
  const medNumberOnChange = (event, val, sourceInputId) => {
    medOnChange(val, sourceInputId);
  };
  const medSliderOnChange = (val, sourceInputId) => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'gtm.slider',
        sliderValue: val,
        sliderID: sourceInputId
      }
    });
    medOnChange(val, sourceInputId);
  };
  const medOnChange = (defaultVal, sourceInputId) => {
    const val = Number.isNaN(Number(defaultVal)) ? 0 : Number(defaultVal);
    const maxPer = getMaxMedPer();
    if (['medical-leave', 'medEmployerCont'].indexOf(sourceInputId) > -1) {
      const newVal = Math.round(maxPer - val);
      const currentMedEmployee = Number(formContext.getInputProviderValue('medEmployeeCont'));
      if (currentMedEmployee !== newVal) {
        formContext.setInputProviderValue({
          id: 'medEmployeeCont',
          value: newVal
        }, () => {
          if (sourceInputId === 'medical-leave') {
            if (Number(formContext.getInputProviderValue('medEmployerCont')) !== val) {
              formContext.setInputProviderValue({
                id: 'medEmployerCont',
                value: val
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
      const newVal = Math.round(maxPer - val);
      if (Number(formContext.getInputProviderValue('medEmployerCont')) !== newVal) {
        formContext.setInputProviderValue({
          id: 'medEmployerCont',
          value: newVal
        }, () => {
          if (String(formContext.getInputProviderValue('medical-leave')) !== String(newVal)) {
            formContext.setInputProviderValue({
              id: 'medical-leave',
              value: String(newVal)
            }, () => onChangeMedCont(newVal));
          }
        });
      } else if (String(formContext.getInputProviderValue('medical-leave')) !== String(newVal)) {
        formContext.setInputProviderValue({
          id: 'medical-leave',
          value: String(newVal)
        }, () => {
          if (Number(formContext.getInputProviderValue('medEmployerCont')) !== newVal) {
            formContext.setInputProviderValue({
              id: 'medEmployerCont',
              value: newVal
            }, () => onChangeMedCont(newVal));
          }
        });
      }
    }
  };
  // Ensures that the InputNumber and sliders reset when number of employees change.
  const medComponentUpdate = (defaultVal, sourceInputId) => {
    const maxPer = getMaxMedPer();
    const minPer = getMinMedPer();
    if (Number(defaultVal) > maxPer || minPer > Number(defaultVal)) {
      const newVal = minPer;
      if (String(newVal) !== String(formContext.getInputProviderValue(sourceInputId))) {
        formContext.setInputProviderValue({
          id: sourceInputId,
          value: (sourceInputId === 'medical-leave') ? String(newVal) : newVal
        }, () => {
          const newEmployeeCont = Math.round(maxPer - newVal);
          if (Number(newEmployeeCont) !== Number(formContext.getInputProviderValue('medEmployeeCont'))) {
            formContext.setInputProviderValue({
              id: 'medEmployeeCont',
              value: newEmployeeCont
            }, () => onChangeMedCont(newVal));
          }
        });
      }
    }
  };
  const famComponentUpdate = (defaultVal, sourceInputId) => {
    const maxPer = 100;
    const minPer = getMinFamPer();
    if (defaultVal > maxPer || minPer > defaultVal) {
      const newVal = minPer;
      formContext.setInputProviderValue({ id: sourceInputId, value: newVal }, () => {
        formContext.setInputProviderValue({ id: 'famEmployeeCont', value: Math.round(maxPer - newVal) }, () => onChangeFamCont(newVal));
      });
    }
  };
  let medTicks = [[0, '0%'], [empMedCont * 100, `${empMedCont * 100}%`]];
  if (isOver25(formContext)) {
    medTicks = getMinMedPer() === 0 ? [[0, '0%'], [100, '100%']] : [[0, '0%'], [getMinMedPer(), 'Min Employer Contribution'], [100, '100%']];
  }
  const medLeaveSliderProps = {
    id: 'medical-leave',
    labelText: '',
    required: true,
    axis: 'x',
    max: getMaxMedPer(),
    min: getMinMedPer(),
    step: 1,
    domain: [0, getMaxMedPer()],
    ticks: medTicks,
    skipped: true,
    disabled: !enable,
    defaultValue: String(leaveTableDefaults.medCont),
    onChange: medSliderOnChange,
    onComponentUpdate: medComponentUpdate
  };
  const familyLeaveSliderProps = {
    id: 'family-leave',
    labelText: '',
    required: true,
    axis: 'x',
    max: 100,
    min: getMinFamPer(),
    step: 1,
    ticks: famTicks,
    domain: [getMinFamPer(), 100],
    skipped: true,
    disabled: !enable,
    defaultValue: Number(leaveTableDefaults.famCont).toString(),
    onChange: famSliderOnChange,
    onComponentUpdate: famComponentUpdate
  };

  return(
    <Fragment>
      <fieldset>
        <legend className={`ma__label${enable ? '' : ' ma__label--disabled'}`}>
          {isOver25(formContext) ? getHelpTip(questionOne.over25) : getHelpTip(questionOne.under25)}
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
                  min={getMinFamPer()}
                  step={1}
                  showButtons={false}
                  disabled={!enable}
                  defaultValue={leaveTableDefaults.famCont}
                  onChange={famNumberOnChange}
                  onComponentUpdate={famComponentUpdate}
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
                  min={getMinFamPer()}
                  unit="%"
                  required
                  disabled={!enable}
                  showButtons={false}
                  defaultValue={(100 - leaveTableDefaults.famCont)}
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
                  max={getMaxMedPer()}
                  min={getMinMedPer()}
                  unit="%"
                  required
                  step={1}
                  showButtons={false}
                  disabled={!enable}
                  defaultValue={leaveTableDefaults.medCont}
                  onChange={medNumberOnChange}
                  onComponentUpdate={medComponentUpdate}
                />
                <InputNumber
                  labelText={questionOne.right.right}
                  name="medEmployeeCont"
                  id="medEmployeeCont"
                  width={0}
                  maxlength={0}
                  placeholder="e.g. 50"
                  inline={false}
                  max={getMaxMedPer() - getMinMedPer()}
                  min={0}
                  unit="%"
                  required
                  disabled={!enable}
                  showButtons={false}
                  step={1}
                  defaultValue={getMaxMedPer() - leaveTableDefaults.medCont}
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
            <Input id="payroll_frequency" defaultValue={leaveTableDefaults.timePeriod} useOwnStateValue>
              <InputContext.Consumer>
                {
                  (timeContext) => (
                    <div className="ma__table-heading">
                      <SelectBox
                        label={questionTwo.question}
                        stackLabel={false}
                        required
                        id="payroll_frequency"
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
            <Table {...getTableProps()} />
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
