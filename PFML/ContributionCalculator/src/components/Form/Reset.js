import React from 'react';

const Reset = () => (
  <div className="ma__reset">
    <hr />
    <a href={`${process.env.PUBLIC_URL}/` || '/'}>Start Over</a>
  </div>
);


export default Reset;
