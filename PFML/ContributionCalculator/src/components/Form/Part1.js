import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { InputRadioGroup, CalloutAlert, InputNumber, Collapse, Paragraph, Input, InputContext, FormContext, InputSync } from '@massds/mayflower-react';
import { encode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery } from 'react-url-query';
import ContributionVariables from '../../data/ContributionVariables.json';
import PartOneProps from '../../data/PartOne.json';
import { getHelpTip } from '../../utils';

import '../../css/index.css';

/**
 * Manually specify how to deal with changes to URL query param props.
 * We do this since we are not using a urlPropsQueryConfig.
 */
const mapUrlChangeHandlersToProps = () => ({
  onChangeMassEmp: (value) => replaceInUrlQuery('massEmp', encode(UrlQueryParamTypes.string, value)),
  onChangeW2: (value) => replaceInUrlQuery('w2', encode(UrlQueryParamTypes.number, value)),
  onChangeEmp1099: (value) => replaceInUrlQuery('emp1099', encode(UrlQueryParamTypes.number, value))
});

const Part1 = (props) => {
  const formContext = useContext(FormContext);
  const {
    minEmployees, emp1099Fraction
  } = ContributionVariables.baseVariables;
  const {
    questionOne, questionTwo, questionThree, output
  } = PartOneProps;
  const { onChangeMassEmp, onChangeW2, onChangeEmp1099 } = props;
  const calloutParagraphClass = 'ma__help-tip-many';
  const getDangerousParagraph = (text, key) => (<div className={calloutParagraphClass} dangerouslySetInnerHTML={{ __html: text }} key={key} />);

  const employeesW2 = formContext.getInputProviderValue('employeesW2') || 0;
  const employees1099 = formContext.getInputProviderValue('employees1099') || 0;
  const over50per = (Number(employees1099) / (Number(employeesW2) + Number(employees1099))) >= emp1099Fraction;
  const employeeCount = Number(employeesW2) + (Number(employees1099) / (Number(employees1099) + Number(employeesW2)) >= emp1099Fraction ? Number(employees1099) : 0);
  const mass_employees = formContext.getInputProviderValue('mass_employees');

  const getConditionsMessage = () => {
    let calloutMessage = null;
    let conditionEmpCount;
    const conditionEmp1099 = Number(employees1099);
    let conditionOver50;
    if (formContext.hasInputProviderIds(['employeesW2', 'employees1099'])) {
      conditionEmpCount = employeeCount;
      conditionOver50 = over50per;
    } else {
      conditionOver50 = ((conditionEmp1099 / employeesW2) + conditionEmp1099) >= emp1099Fraction;
      conditionEmpCount = conditionOver50 ? (employeesW2 + conditionEmp1099) : employeesW2;
    }
    const over25 = conditionEmpCount >= minEmployees;
    const conditions = new Map([
      ['overMinEmpOver1099', (over25 && conditionOver50)],
      ['overMinEmpUnder1099', (over25 && !conditionOver50 && conditionEmp1099 && conditionEmp1099 > 0)],
      ['overMinEmpNo1099', (over25 && !conditionOver50 && (!conditionEmp1099 || conditionEmp1099 <= 0 || conditionEmp1099 === 'NaN'))],
      ['underMinEmpOver1099', (!over25 && conditionOver50)],
      ['underMinEmpUnder1099', (!over25 && !conditionOver50 && conditionEmp1099 && conditionEmp1099 > 0)],
      ['underMinEmpNo1099', (!over25 && !conditionOver50 && (conditionEmp1099 <= 0 || !conditionEmp1099 || conditionEmp1099 === 'NaN'))]
    ]);
    conditions.forEach((condition, key) => {
      if (condition) {
        calloutMessage = (
          <Fragment>
            {output[key].map((message, messageIndex) => {
              // eslint-disable-next-line react/no-array-index-key
              const messageKey = `${key}-${messageIndex}`;
              if (message.paragraph.helpText) {
                return<div key={messageKey} className="ma__help-tip-many">{getHelpTip(message.paragraph, 'c-white', messageKey)}</div>;
              }
              return getDangerousParagraph(message.paragraph.content, messageKey);
            })}
          </Fragment>
        );
      }
    });
    return calloutMessage;
  };

  const partOneDefaults = {
    w2: props.w2 && !Number.isNaN(props.w2) ? Number(props.w2) : '',
    emp1099: props.emp1099 && !Number.isNaN(props.emp1099) ? Number(props.emp1099) : '',
    empCount: Number.isNaN(employeeCount) ? 0 : employeeCount,
    over50: over50per,
    over25: Number.isNaN(employeeCount) ? minEmployees <= 0 : employeeCount >= minEmployees,
    disableInputs: false
  };
  partOneDefaults.mass_employees = (!Object.prototype.hasOwnProperty.call(props, 'massEmp') || (props.massEmp === 'true')) ? 'yes' : 'no';
  return(
    <fieldset>
      <React.Fragment>
        <Input id="mass_employees" defaultValue={mass_employees || partOneDefaults.mass_employees} useOwnStateValue>
          <InputContext.Consumer>
            {
              (radioContext) => (
                <InputRadioGroup
                  title={questionOne.question.helpText ? getHelpTip(questionOne.question) : questionOne.question.content}
                  name="mass_employees"
                  outline
                  defaultSelected={partOneDefaults.mass_employees}
                  errorMsg={questionOne.errorMsg}
                  radioButtons={questionOne.options}
                  onChange={({ selected }) => {
                    radioContext.setOwnValue(selected, () => {
                        const hasEmployees = (formContext.getInputProviderValue('mass_employees') === 'yes');
                        onChangeMassEmp(hasEmployees);
                    });
                  }}
                />
              )
            }
          </InputContext.Consumer>
        </Input>
        <React.Fragment>
          <Collapse in={mass_employees === 'no'} dimension="height" className="ma__callout-alert">
            <div className="ma__collapse">
              <CalloutAlert theme={questionOne.options[1].theme}>
                <Paragraph text={questionOne.options[1].message} />
              </CalloutAlert>
            </div>
          </Collapse>
          <InputNumber
            labelText={questionTwo.question.helpText ? getHelpTip(questionTwo.question) : questionTwo.question.content}
            id="employeesW2"
            name="employeesW2"
            type="number"
            width={0}
            inline
            maxlength={0}
            min={0}
            placeholder="e.g. 50"
            errorMsg={questionTwo.errorMsg}
            defaultValue={partOneDefaults.w2}
            disabled={mass_employees === 'no'}
            required
            unit=""
            onChange={() => {
              const empW2 = Number(formContext.getInputProviderValue('employeesW2'));
              if (!Number.isNaN(empW2)) {
                onChangeW2(empW2);
              }
            }}
            showButtons
          />
          <InputNumber
            labelText={questionThree.question.helpText ? getHelpTip(questionThree.question) : questionThree.question.content}
            name="employees1099"
            id="employees1099"
            type="number"
            width={0}
            maxlength={0}
            min={0}
            placeholder="e.g. 50"
            inline
            errorMsg={questionThree.errorMsg}
            defaultValue={partOneDefaults.emp1099}
            disabled={mass_employees === 'no'}
            required
            onChange={() => {
              const current1099 = Number(formContext.getInputProviderValue('employees1099'));
              if (!Number.isNaN(current1099)) {
                onChangeEmp1099(current1099);
              }
            }}
            showButtons
          />
          <Collapse in={mass_employees === 'yes' && formContext.hasInputProviderId('employeesW2') && Number(employeesW2) > 0} dimension="height" className="ma__callout-alert">
            <div className="ma__collapse">
              <CalloutAlert theme="c-primary">
                { getConditionsMessage() }
              </CalloutAlert>
            </div>
          </Collapse>
        </React.Fragment>
      </React.Fragment>
    </fieldset>
  );
};

Part1.propTypes = {
  /** Functions that push changed context props to the url. */
  onChangeMassEmp: PropTypes.func,
  onChangeW2: PropTypes.func,
  onChangeEmp1099: PropTypes.func
};

export default addUrlProps({ mapUrlChangeHandlersToProps })(Part1);
