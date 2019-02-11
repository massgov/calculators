import React, { Component } from 'react';
import { Header, Footer, PageHeader } from '@massds/mayflower-react';
import { decode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery, encode } from 'react-url-query';
import UtilityNavData from './data/UtilityNav.data';
import MainNavData from './data/MainNav.data';
import HeaderSearchData from './data/HeaderSearch.data';
import FooterLinksLiveData from './data/FooterLinksLive.json';
import SocialLinksLiveData from './data/SocialLinksLive.json';
import Part1 from './components/Part1';
import Part2 from './components/Part2';
import Part3 from './components/Part3';
import history from './components/History';
import BenefitsVariables from './data/BenefitsVariables.json';
import PartOneProps from './data/PartOne.json';

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
const getDefaultNumber = (num) => ((validNumber(num)) ? Number(num) : 0);

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
      belowMinSalary: getDefaultNumber(yearIncome) < BenefitsVariables.baseVariables.minSalary || false
    };
    /* eslint-enable react/no-unused-state */
    this.footerProps = {
      footerLinks: FooterLinksLiveData.footerLinks,
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

  handleInput = (e, value) => {
    const numberValue = value;
    this.setState({
      yearIncome: numberValue
    });
    this.props.onChangeYearIncome(value);
    if (numberValue > BenefitsVariables.baseVariables.minSalary) {
      this.setState({
        belowMinSalary: false
      });
    }
  };

  handleRadio = ({ selected, maxWeeks }) => {
    this.setState({
      maxWeeks,
      leaveReason: selected
    });
    this.props.onChangeLeaveReason(selected);
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
        <Header {...this.headerProps} />
        <main className="main-content">
          <PageHeader title={BenefitsVariables.title} optionalContents={[{ paragraph: { text: BenefitsVariables.description } }]} />
          <section className="main-content--two">
            <Part1 error={false} disabled={false} defaultSelected={leaveReason} onChange={this.handleRadio} />
            <hr />
            <Part2 onChange={this.handleInput} onBlur={this.handleBlur} disabled={questTwoDisabled} defaultValue={yearIncome} belowMinSalary={belowMinSalaryConv} />
            {yearIncome > 0 && maxWeeks > 0 && !belowMinSalaryConv && (
              <Part3 yearIncome={yearIncome} maxWeeks={maxWeeks} />
            )}
          </section>
        </main>
        <Footer {...this.footerProps} />
      </div>
    );
  }
}

export default addUrlProps({ mapUrlToProps, mapUrlChangeHandlersToProps })(App);
