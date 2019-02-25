import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { decode, addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import { FormContext, Button } from '@massds/mayflower-react';
import ContributionVariables from '../../data/ContributionVariables.json';
import Part1 from '../Form/Part1';
import Part2 from '../Form/Part2';
import Part3 from '../Form/Part3';
import history from '../History';
import { defaultState } from '../Form/context';


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
