import React from 'react';

export const FormContext = React.createContext({
  has_mass_employees: true,
  employees_w2: null,
  employees_1099: null,
  med_leave_cont: 0,
  fam_leave_cont: 0,
  time_period: "Year",
  med_leave: 0,
  fam_leave: 0
});
