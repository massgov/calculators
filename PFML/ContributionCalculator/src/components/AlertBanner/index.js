import React from 'react';
import PropTypes from 'prop-types';
import { EmergencyAlerts, DecorativeLink } from '@massds/mayflower-react';

const AlertBanner = (props) => (
  <EmergencyAlerts
    buttonClose
    // eslint-disable-next-line no-undef, no-loop-func
    onButtonCloseClick={({ close }) => sessionStorage.setItem(props.guid, close)}
    emergencyHeader={{
      icon: null,
      prefix: 'Notice',
      title: () => (<DecorativeLink text="PFML Statute Change – Contribution withholding date delayed until Oct. 1, 2019" href="https://www.mass.gov/news/notice-to-massachusetts-employers-about-pfml-delay" />)
    }}
    id={props.guid}
    theme="c-warning"
  />
);

AlertBanner.propTypes = {
  guid: PropTypes.string
};

export default AlertBanner;
