import React from 'react';
import { Button } from '@massds/mayflower-react';
import history from '../History';

const Reset = () => {
  const clearValues = (e) => {
    e.preventDefault();
    history.push('/');
    window.location.reload();
  };
  return(
    <Button
      usage="secondary" 
      text="reset"
      onClick={clearValues} 
    />
  );
};

export default Reset;
