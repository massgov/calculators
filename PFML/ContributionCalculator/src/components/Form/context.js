import React from 'react';

const FormContext = React.createContext({
  hasMassEmployees: true,
  employeesW2: null,
  employees1099: null,
  medLeaveCont: 0,
  famLeaveCont: 0,
  timePeriod: 'Quarter',
  med_leave: 0,
  fam_leave: 0,
  mass_employees: 'yes'
});

export default FormContext;
