import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import numbro from 'numbro';
import { SelectBox, Input, InputSlider, InputNumber, FormContext, Table } from '@massds/mayflower-react';
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
  const {
    smallMedPercent, smallFamPercent, largeMedPercent, largeFamPercent, largeCompFamCont, smallCompFamCont, empMedCont, largeCompMedCont, smallCompMedCont, socialSecCap
  } = ContributionVariables.baseVariables;
  const { questionOne, questionTwo } = PartThreeProps;
  const {
    onChangeMedCont, onChangeFamCont, onChangeTimeValue, onChangeTimePeriod
  } = props;
  return(
    <FormContext.Consumer>
      {
          (context) => {
            const {
              over25,
              over50per,
              employeeCount,
              hasMassEmployees,
              payrollBase,
              famLeaveCont,
              medLeaveCont,
              timeValue,
              timePeriod,
              value: {
                payrollW2, payroll1099, payrollWages, employeesW2, employees1099
              }
            } = context;

            const medPercent = over25 ? largeMedPercent : smallMedPercent;
            const famPercent = over25 ? largeFamPercent : smallFamPercent;

            let totalPayroll;
            if (payrollBase === 'all' && employeesW2 > 0) {
              totalPayroll = over50per ? (numbro.unformat(payroll1099) + numbro.unformat(payrollW2)) : numbro.unformat(payrollW2);
            } else if (payrollBase === 'all' && !(employeesW2 > 0)) {
              totalPayroll = numbro.unformat(payroll1099);
            } else {
              totalPayroll = numbro.unformat(payrollWages) > socialSecCap ? socialSecCap : numbro.unformat(payrollWages);
            }
            const medLeave = totalPayroll * medPercent;
            const famLeave = totalPayroll * famPercent;

            const minMed = over25 ? largeCompMedCont : smallCompMedCont;
            const maxMed = over25 ? (largeCompMedCont + empMedCont) : (smallCompMedCont + empMedCont);
            const minFam = over25 ? largeCompFamCont : smallCompFamCont;
            const minMedPer = Math.round(minMed * 100);
            const maxMedPer = Math.round(maxMed * 100);
            const minFamPer = Math.round(minFam * 100);

            // Remove this function after integrating form context.
            const onMedBlur = (event, value, reverse) => {
              let fracNum;
              if (!reverse) {
                if (value < 0) {
                  // employee lower boundary
                  fracNum = 0;
                } else if (value > maxMedPer) {
                  // employer upper boundary
                  fracNum = maxMed;
                } else {
                  fracNum = value > minMedPer ? value / 100 : minMed;
                }
              } else {
                const reverseMax = maxMedPer - minMedPer;
                if (value < 0) {
                  // employee lower boundary
                  fracNum = maxMed;
                } else if (value > reverseMax) {
                  // employee upper boundary
                  fracNum = 0;
                } else {
                  fracNum = (maxMedPer - value) / 100;
                }
              }
              context.updateState({ medLeaveCont: fracNum });
              onChangeMedCont(fracNum);
            };
            const onMedChange = (event, value, reverse) => {
              // If statement should be removed after porting form context in.
              if (event.target.type === 'button') {
                onMedBlur(event, value, reverse);
              }
            };

            // Remove this function after integrating form context.
            const onFamBlur = (event, value, reverse) => {
              let fracNum = value > minFamPer ? value / 100 : minFam;
              if (reverse) {
                fracNum = (100 - value) / 100;
              }
              context.updateState({ famLeaveCont: fracNum });
              onChangeFamCont(fracNum);
            };
            const onFamChange = (event, value, reverse) => {
              // If statement should be removed after porting form context in.
              if (event.target.type === 'button') {
                onFamChange(event, value, reverse);
              }
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
              questionTwo.options.forEach((period) => {
                if (period.text === text) {
                  value = period.value;
                }
              });
              return value;
            };

            const medLeaveComp = medLeave * medLeaveCont;
            const famLeaveComp = famLeave * famLeaveCont;
            const medLeaveEmp = medLeave * (maxMed - medLeaveCont);
            const famLeaveEmp = famLeave * (1 - famLeaveCont);

            const enableAll = payrollBase === 'all' && ((employeesW2 > 0 && numbro.unformat(payrollW2) > 0) || (!(employeesW2 > 0) && employees1099 > 0 && numbro.unformat(payroll1099) > 0)) && (over50per ? numbro.unformat(payroll1099) > 0 : true);
            const enableOne = payrollBase === 'one' && numbro.unformat(payrollWages) > 0;
            const enable = hasMassEmployees && (employeeCount > 0) && (enableOne || enableAll);

            const famTicks = minFamPer === 0 ? [[0, '0%'], [100, '100%']] : [[0, '0%'], [minFamPer, 'Min Employer Contribution'], [100, '100%']];
            let medTicks = [[0, '0%'], [empMedCont * 100, `${empMedCont * 100}%`]];
            if (over25) {
              medTicks = minMedPer === 0 ? [[0, '0%'], [100, '100%']] : [[0, '0%'], [minMedPer, 'Min Employer Contribution'], [100, '100%']];
            }

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
              disabled: !enable,
              onChange: (value) => onFamSliderChange(value)
            };
            const medLeaveSliderProps = {
              id: 'medical-leave',
              required: true,
              defaultValue: String(Math.round(medLeaveCont * 100)),
              axis: 'x',
              max: maxMedPer,
              min: minMedPer,
              step: 1,
              domain: [0, maxMedPer],
              ticks: medTicks,
              skipped: true,
              disabled: !enable,
              onChange: (value) => onMedSliderChange(value)
            };

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

            return(
              <Fragment>
                <fieldset>
                  <legend className={`ma__label${enable ? '' : ' ma__label--disabled'}`}>
                    {over25 ? getHelpTip(questionOne.over25) : getHelpTip(questionOne.under25)}
                  </legend>
                  <div className="ma__input-group--two">
                    <Input labelText={questionOne.left.main} required disabled={!enable}>
                      <div className="ma__input-group--ends">
                        <InputNumber
                          labelText={questionOne.left.left}
                          name="famEmployerCont"
                          id="famEmployerCont"
                          type="number"
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
                          onChange={(event, value) => onFamChange(event, value)}
                              // Remove onBlur event after integration of form context
                          onBlur={(event, value) => onFamBlur(event, value)}
                              // Remove key after integration of form context
                          key={famLeaveCont < minFam ? `family-leave-input-number-${famLeaveCont}-${Math.random()}` : `family-leave-input-number-${famLeaveCont}`}
                        />
                        <InputNumber
                          labelText={questionOne.left.right}
                          name="famEmployeeCont"
                          id="famEmployeeCont"
                          type="number"
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
                          onChange={(event, value) => onFamChange(event, value, true)}
                              // Remove onBlur event after integration of form context
                          onBlur={(event, value) => onFamBlur(event, value, true)}
                          key={Math.random()}
                        />
                      </div>
                      <InputSlider {...familyLeaveSliderProps} key={Math.random()} />
                    </Input>
                    <Input labelText={questionOne.right.main} required disabled={!enable}>
                      <div className="ma__input-group--ends">
                        <InputNumber
                          labelText={questionOne.right.left}
                          name="medEmployerCont"
                          id="medEmployerCont"
                          type="number"
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
                          onChange={(event, value) => onMedChange(event, value)}
                          // Remove onBlur event after integration of form context
                          onBlur={(event, value) => onMedBlur(event, value)}
                          // Remove key after integration of form context.
                          key={medLeaveCont < minMed ? `medical-leave-input-number-${medLeaveCont}-${Math.random()}` : `medical-leave-input-number-${medLeaveCont}`}
                        />
                        <InputNumber
                          labelText={questionOne.right.right}
                          name="medEmployeeCont"
                          id="medEmployeeCont"
                          type="number"
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
                          onChange={(event, value) => onMedChange(event, value, true)}
                          // Remove onBlur event after integration of form context
                          onBlur={(event, value) => onMedBlur(event, value, true)}
                          key={Math.random()}
                        />
                      </div>
                      <InputSlider {...medLeaveSliderProps} key={Math.random()} />
                    </Input>
                  </div>
                </fieldset>
                {enable && (
                  <Fragment>
                    <h2 className="ma__table-heading">
                      <SelectBox
                        label={questionTwo.question}
                        stackLabel={false}
                        required
                        id="color-select"
                        options={questionTwo.options}
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
                    {payrollBase === 'all' ? <Table {...AllTableData} /> : <Table {...SingleTableData} />}
                  </Fragment>
                )}
              </Fragment>
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
