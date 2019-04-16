import numbro from 'numbro';
import ContributionVariables from '../../data/ContributionVariables';

const {
  totContribution, totMedPercent, totFamPercent, largeCompFamCont, smallCompFamCont, empMedCont, largeCompMedCont, smallCompMedCont, socialSecCap, emp1099Fraction, minEmployees
} = ContributionVariables.baseVariables;
export const getEmpCount = (formContext) => {
  const { employeesW2, employees1099 } = formContext.getInputProviderValues();
  return Number(employeesW2) + (Number(employees1099) / (Number(employees1099) + Number(employeesW2)) >= emp1099Fraction ? Number(employees1099) : 0);
};
export const isOver25 = (formContext) => getEmpCount(formContext) >= minEmployees;
export const isOver50 = (formContext) => {
  const { employeesW2, employees1099 } = formContext.getInputProviderValues();
  return(Number(employees1099) / (Number(employeesW2) + Number(employees1099))) >= emp1099Fraction;
};
export const getMaxMedPer = (formContext) => {
  const max = isOver25(formContext) ? (largeCompMedCont + empMedCont) : (smallCompMedCont + empMedCont);
  return Math.round(max * 100);
};
export const getMinMedPer = (formContext) => {
  const min = isOver25(formContext) ? largeCompMedCont : smallCompMedCont;
  return Math.round(min * 100);
};
export const hasMassEmployees = (formContext) => {
  const { mass_employees } = formContext.getInputProviderValues();
  return mass_employees === 'yes';
};
export const getTotalPayroll = (formContext) => {
  const {
    employeesW2, payroll1099, payrollW2, payrollBase, payrollWages
  } = formContext.getInputProviderValues();
  let totalPayroll = 0;
  if (payrollBase === 'all' && Number(employeesW2) > 0) {
    totalPayroll = isOver50(formContext) ? (Number(numbro.unformat(payroll1099)) + Number(numbro.unformat(payrollW2))) : Number(numbro.unformat(payrollW2));
  } else if (payrollBase === 'all' && !(Number(employeesW2) > 0)) {
    totalPayroll = Number(numbro.unformat(payroll1099));
  } else {
    totalPayroll = Number(numbro.unformat(payrollWages)) > socialSecCap ? socialSecCap : Number(numbro.unformat(payrollWages));
  }
  return totalPayroll;
};
