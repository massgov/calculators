import React from 'react';
import { FormContext, Button } from '@massds/mayflower-react';
import history from '../History';
// import { defaultState } from '../Form/context';


const Reset = () => (
  <FormContext.Consumer>
    {
      (context) => {
        const clearValues = (e) => {
          e.preventDefault();
          context.updateState({
            value: {
              employeesW2: 0
            }
          });
          history.push('/');
        };
        return(
          <Button text="reset" onClick={clearValues} />
        );
      }
    }
  </FormContext.Consumer>
);

export default Reset;
