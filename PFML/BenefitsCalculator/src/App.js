import React, { Component } from 'react';
import {
  Header, Footer, PageHeader, HelpTip
} from '@massds/mayflower-react';
import {
  decode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery, encode
} from 'react-url-query';
import UtilityNavData from './data/UtilityNav.data';
import MainNavData from './data/MainNav.data';
import HeaderSearchData from './data/HeaderSearch.data';
import FooterData from './data/Footer.data';
import SocialLinksLiveData from './data/SocialLinksLive.json';
import LeaveType from './components/LeaveType';
import WagesInput from './components/WagesInput';
import history from './components/History';
import BenefitsVariables from './data/BenefitsVariables.json';
import inputProps from './data/input.json';

import './index.css';

/**
 * Map from url query params to props. The values in `url` will still be encoded
 * as strings since we did not pass a `urlPropsQueryConfig` to addUrlProps.
 */
const mapUrlToProps = (url) => ({
  weeklyBenefit: decode(UrlQueryParamTypes.number, url.weeklyBenefit),
  leaveReason: decode(UrlQueryParamTypes.string, url.leaveReason)
});

/**
 * Manually specify how to deal with changes to URL query param props.
 * We do this since we are not using a urlPropsQueryConfig.
 */
const mapUrlChangeHandlersToProps = () => ({
  onChangeWeeklyBenefit: (value) => replaceInUrlQuery('weeklyBenefit', encode(UrlQueryParamTypes.string, value)),
  onChangeLeaveReason: (value) => replaceInUrlQuery('leaveReason', encode(UrlQueryParamTypes.string, value))
});

const validNumber = (num) => (num || (num !== null && num !== undefined));
const getDefaultNumber = (num) => ((validNumber(num)) ? Number(num) : null);

class App extends Component {
  constructor(props) {
    super(props);
    // const hasLocalStore = typeof localStorage !== 'undefined';
    const {
      weeklyBenefit, leaveReason
    } = props;
    /* eslint-disable no-undef */
    this.state = {
      qualified: false,
      weeklyBenefit: getDefaultNumber(weeklyBenefit),
      leaveReason
    };
    /* eslint-enable react/no-unused-state */
    this.footerProps = {
      footerLinks: FooterData.footerLinks,
      socialLinks: SocialLinksLiveData.socialLinks
    };
    this.headerProps = {
      utilityNav: UtilityNavData,
      headerSearch: HeaderSearchData,
      mainNav: MainNavData,
      hideHeaderSearch: true,
      hideBackTo: true,
      siteLogoDomain: { url: { domain: 'https://www.mass.gov/' } }
    };
  }

  componentDidMount() {
    // force an update if the URL changes
    history.listen(() => this.forceUpdate());
  }

  componentWillUnmount() {
    // remove force update on URL changes
    history.listen();
  }

  handleWagesSubmit = ({ qualified, weeklyBenefit }) => {
    this.setState({
      qualified,
      weeklyBenefit
    });
  };

  handleRadio = ({ selected }) => {
    this.setState({
      leaveReason: selected
    });
    const { onChangeLeaveReason } = this.props;
    onChangeLeaveReason(selected);
  }

  // handleBlur = (numberValue) => {
  //   if (numberValue < BenefitsVariables.baseVariables.minSalary) {
  //     this.setState({
  //       belowMinSalary: true
  //     });
  //   }
  // }

  render() {
    const {
      leaveReason, weeklyBenefit, qualified
    } = this.state;

    const leaveTypeProps = {
      qualified,
      weeklyBenefit,
      defaultSelected: leaveReason,
      onChange: this.handleRadio
    };

    return(
      <div className="App">
        {process.env.REACT_APP_IFRAME === 'true' ? (
          <div className="page-content">
            <hr />
            <HelpTip {...inputProps.inputTitle} {...this.helptipIframeProp} id="helptext-total-wages" />
            <WagesInput onSubmit={this.handleWagesSubmit} />
            <LeaveType {...leaveTypeProps} />
          </div>
        ) : (
          <div>
            <Header {...this.headerProps} />
            <main className="main-content">
              <PageHeader
                title={BenefitsVariables.title}
                optionalContents={[{
                  paragraph: {
                    text: BenefitsVariables.description
                  }
                }]}
              />
              <section className="main-content main-content--two">
                <div className="page-content">
                  <hr />
                  <h2>
                    <HelpTip {...inputProps.inputTitle} {...this.helptipIframeProp} id="helptext-total-wages" />
                  </h2>

                  <WagesInput onSubmit={this.handleWagesSubmit} />
                  <LeaveType {...leaveTypeProps} />
                </div>
              </section>
            </main>
            <Footer {...this.footerProps} />
          </div>
        )
      }
      </div>
    );
  }
}

export default addUrlProps({ mapUrlToProps, mapUrlChangeHandlersToProps })(App);
