import React, { Component } from 'react';
import {
  Header, Footer, PageHeader, Collapse, HelpTip
} from '@massds/mayflower-react';
import {
  decode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery, encode
} from 'react-url-query';
import UtilityNavData from './data/UtilityNav.data';
import MainNavData from './data/MainNav.data';
import HeaderSearchData from './data/HeaderSearch.data';
import FooterData from './data/Footer.data';
import SocialLinksLiveData from './data/SocialLinksLive.json';
import Part1 from './components/Part1';
import Part2 from './components/Part2';
import Part3 from './components/Part3';
import WagesInput from './components/WagesInput';
import history from './components/History';
import BenefitsVariables from './data/BenefitsVariables.json';
import PartOneProps from './data/PartOne.json';
import inputProps from './data/input.json';

import './index.css';

/**
 * Map from url query params to props. The values in `url` will still be encoded
 * as strings since we did not pass a `urlPropsQueryConfig` to addUrlProps.
 */
const mapUrlToProps = (url) => ({
  yearIncome: decode(UrlQueryParamTypes.number, url.yearIncome),
  leaveReason: decode(UrlQueryParamTypes.string, url.leaveReason)
});

/**
 * Manually specify how to deal with changes to URL query param props.
 * We do this since we are not using a urlPropsQueryConfig.
 */
const mapUrlChangeHandlersToProps = () => ({
  onChangeYearIncome: (value) => replaceInUrlQuery('yearIncome', encode(UrlQueryParamTypes.string, value)),
  onChangeLeaveReason: (value) => replaceInUrlQuery('leaveReason', encode(UrlQueryParamTypes.string, value))
});

const validNumber = (num) => (num || (num !== null && num !== undefined));
const getDefaultNumber = (num) => ((validNumber(num)) ? Number(num) : null);

const getWeeks = (qOneProps, selected) => {
  let maxWeeks;
  qOneProps.options.forEach((option) => {
    if (option.value === selected) {
      maxWeeks = option.weeks;
    }
  });
  return maxWeeks;
};

class App extends Component {
  constructor(props) {
    super(props);
    // const hasLocalStore = typeof localStorage !== 'undefined';
    const {
      yearIncome, leaveReason
    } = props;
    /* eslint-disable no-undef */
    this.state = {
      yearIncome: getDefaultNumber(yearIncome),
      maxWeeks: getWeeks(PartOneProps, leaveReason),
      leaveReason,
      belowMinSalary: !!((getDefaultNumber(yearIncome) && getDefaultNumber(yearIncome) < BenefitsVariables.baseVariables.minSalary))
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

  // handleInput = (value, id, type) => {
  //   const numberValue = value;
  //   this.setState({
  //     yearIncome: numberValue
  //   });
  //   const { onChangeYearIncome } = this.props;
  //   onChangeYearIncome(value);
  //   if (numberValue >= BenefitsVariables.baseVariables.minSalary) {
  //     this.setState({
  //       belowMinSalary: false
  //     });
  //   }
  //   // Allow rendering belowMinSalary callout on inputCurrency up/down button click.
  //   if (type === 'click') {
  //     if (numberValue < BenefitsVariables.baseVariables.minSalary) {
  //       this.setState({
  //         belowMinSalary: true
  //       });
  //     }
  //   }
  // };

  handleRadio = ({ selected, maxWeeks }) => {
    this.setState({
      maxWeeks,
      leaveReason: selected
    });
    const { onChangeLeaveReason } = this.props;
    onChangeLeaveReason(selected);
  }

  handleBlur = (numberValue) => {
    if (numberValue < BenefitsVariables.baseVariables.minSalary) {
      this.setState({
        belowMinSalary: true
      });
    }
  }

  render() {
    const {
      leaveReason, yearIncome, maxWeeks, belowMinSalary
    } = this.state;
    let belowMinSalaryConv;
    if (typeof belowMinSalary === 'string') {
      belowMinSalaryConv = belowMinSalary === 'true';
    } else { belowMinSalaryConv = belowMinSalary; }

    const questTwoDisabled = !(maxWeeks > 0);
    return(
      <div className="App">
        {process.env.REACT_APP_IFRAME === 'true' ? (
          <div className="page-content">
            <hr />
            <HelpTip {...inputProps.inputTitle} {...this.helptipIframeProp} id="helptext-total-wages" />
            <WagesInput />
            <Part1 error={false} disabled={false} defaultSelected={leaveReason} onChange={this.handleRadio} />
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

                  <WagesInput />
                  <Part1 error={false} disabled={false} defaultSelected={leaveReason} onChange={this.handleRadio} />
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
