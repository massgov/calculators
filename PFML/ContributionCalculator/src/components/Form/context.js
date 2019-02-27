import React from 'react';

export const defaultState = {
  hasMassEmployees: null,
  value: {
    employeesW2: 0,
    employees1099: 0,
    payrollW2: 0,
    payroll1099: 0,
    payrollWages: 0
  },
  medLeaveCont: 0,
  famLeaveCont: 0,
  timePeriod: 'Year',
  timeValue: 1,
  med_leave: 0,
  fam_leave: 0,
  mass_employees: 'yes',
  over25: false
};

const FormContext = React.createContext(defaultState);

export default FormContext;
