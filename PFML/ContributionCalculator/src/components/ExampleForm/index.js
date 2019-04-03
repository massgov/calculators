import React from 'react';
import PropTypes from 'prop-types';
import { decode, addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import { Form, FormProvider } from '@massds/mayflower-react';
import Part1 from '../Form/Part1';
import Part2 from '../Form/Part2';
import Part3 from '../Form/Part3';
import Reset from '../Form/Reset';

import '../../css/index.css';

/**
 * Map from url query params to props. The values in `url` will still be encoded
 * as strings since we did not pass a `urlPropsQueryConfig` to addUrlProps.
 */
const mapUrlToProps = (url) => ({
  massEmp: decode(UrlQueryParamTypes.string, url.massEmp),
  w2: decode(UrlQueryParamTypes.number, url.w2),
  emp1099: decode(UrlQueryParamTypes.number, url.emp1099),
  option: decode(UrlQueryParamTypes.string, url.option),
  payW2: decode(UrlQueryParamTypes.number, url.payW2),
  pay1099: decode(UrlQueryParamTypes.number, url.pay1099),
  payWages: decode(UrlQueryParamTypes.number, url.payWages),
  medCont: decode(UrlQueryParamTypes.number, url.medCont),
  famCont: decode(UrlQueryParamTypes.number, url.famCont),
  timeValue: decode(UrlQueryParamTypes.string, url.timeValue),
  timePeriod: decode(UrlQueryParamTypes.string, url.timePeriod)
});

const ExampleForm = () => (
  <FormProvider>
    <div className="page-content">
      <Part1 />
      <hr />
      <Part2 />
    </div>
    <Part3 />
    <Reset />
  </FormProvider>
);

ExampleForm.propTypes = {
  massEmp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  w2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  emp1099: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  option: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  payW2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pay1099: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  payWages: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  timeValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  timePeriod: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  famCont: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  medCont: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default addUrlProps({ mapUrlToProps })(ExampleForm);
