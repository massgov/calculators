import React from 'react';

export const FormContext = React.createContext({
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
