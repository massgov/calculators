import React from 'react';

const FormContext = React.createContext({
  hasMassEmployees: true,
  employeesW2: 0,
  employees1099: 0,
  medLeaveCont: 0,
  famLeaveCont: 0,
  timePeriod: 'Year',
  med_leave: 0,
  fam_leave: 0,
  mass_employees: 'yes'
});

const DisableInputContext = React.createContext({
  disabled: false,
  toggleDisabled: () => {}
});

export default DisableInputContext;
export const PartOneContext = React.createContext(null);


//export default FormContext;
