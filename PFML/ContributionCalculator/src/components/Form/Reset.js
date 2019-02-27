import React from 'react';

const Reset = () => (
  <div className="ma__reset">
    <hr />
    <a href={process.env.ENV_VARIABLE ? `${process.env.ENV_VARIABLE}` : '/'}>Start Over</a>
  </div>
);

export default Reset;
