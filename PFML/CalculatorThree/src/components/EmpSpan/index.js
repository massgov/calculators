import React from 'react';
import PropTypes from 'prop-types';

const EmpSpan = (props) => {
  const { text } = props;
  return(
    <span className="ma__output-emphasized">{text}</span>
  );
};

EmpSpan.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default EmpSpan;
