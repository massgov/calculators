import React, { Component } from 'react';
import { decode, addUrlProps, UrlQueryParamTypes, replaceInUrlQuery, encode } from 'react-url-query';
import { Header, Footer } from '@massds/mayflower-react';
import UtilityNavData from './data/UtilityNav.data';
import MainNavData from './data/MainNav.data';
import HeaderSearchData from './data/HeaderSearch.data';
import FooterLinksLiveData from './data/FooterLinksLive.json';
import SocialLinksLiveData from './data/SocialLinksLive.json';
import Part1 from './components/Part1';
import Part2 from './components/Part2';
import Part3 from './components/Part3';
import CalculatorThreeVariables from './data/CalculatorThreeVariables.json';

import './index.css';


/**
 * Map from url query params to props. The values in `url` will still be encoded
 * as strings since we did not pass a `urlPropsQueryConfig` to addUrlProps.
 */
const mapUrlToProps = (url) => ({
  yearIncome: decode(UrlQueryParamTypes.number, url.yearIncome),
  maxWeeks: decode(UrlQueryParamTypes.number, url.maxWeeks),
  leaveReason: decode(UrlQueryParamTypes.string, url.leaveReason),
  belowMinSalary: decode(UrlQueryParamTypes.boolean, url.belowMinSalary)
});

/**
 * Manually specify how to deal with changes to URL query param props.
 * We do this since we are not using a urlPropsQueryConfig.
 */
const mapUrlChangeHandlersToProps = () => ({
  onChangeBelowMinSalary: (value) => replaceInUrlQuery('belowMinSalary', encode(UrlQueryParamTypes.boolean, value)),
  onChangeYearIncome: (value) => replaceInUrlQuery('yearIncome', encode(UrlQueryParamTypes.string, value)),
  onChangeMaxWeeks: (value) => replaceInUrlQuery('maxWeeks', encode(UrlQueryParamTypes.number, value)),
  onChangeLeaveReason: (value) => replaceInUrlQuery('leaveReason', encode(UrlQueryParamTypes.string, value))
});

const validNumber = (num) => (num || (num !== null && num !== undefined));
const getDefaultNumber = (num) => ((validNumber(num)) ? Number(num) : 0);

class App extends Component {
  constructor(props) {
    super(props);
    // const hasLocalStore = typeof localStorage !== 'undefined';
    const { yearIncome, maxWeeks, leaveReason, belowMinSalary } = props;
    /* eslint-disable no-undef */
    this.state = {
      yearIncome: getDefaultNumber(yearIncome),
      maxWeeks,
      leaveReason,
      belowMinSalary
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

  // componentDidMount() {
  //   // add event listener to save state to localStorage
  //   // when user leaves/refreshes the page
  //   if (typeof window !== 'undefined') {
  //     window.addEventListener(
  //       'beforeunload',
  //       this.saveStateToLocalStorage.bind(this)
  //     );
  //   }
  // }
  //
  // componentWillUnmount() {
  //   if (typeof window !== 'undefined') {
  //     window.removeEventListener(
  //       'beforeunload',
  //       this.saveStateToLocalStorage.bind(this)
  //     );
  //   }
  //
  //   // saves if component has a chance to unmount
  //   this.saveStateToLocalStorage();
  // }

  handleInput = (e, value) => {
    const numberValue = value;
    this.setState({
      yearIncome: numberValue
    });
    this.props.onChangeYearIncome(value);
    if (numberValue > CalculatorThreeVariables.baseVariables.minSalary) {
      this.setState({
        belowMinSalary: false
      });
      this.props.onChangeBelowMinSalary(false);
    }
  };

  handleRadio = ({ selected, maxWeeks }) => {
    this.setState({
      maxWeeks,
      leaveReason: selected
    });
    this.props.onChangeMaxWeeks(maxWeeks);
    this.props.onChangeLeaveReason(selected);
  }

  handleBlur = (numberValue) => {
    if (numberValue < CalculatorThreeVariables.baseVariables.minSalary) {
      this.setState({
        belowMinSalary: true
      });
      this.props.onChangeBelowMinSalary(true);
    }
  }

  // saveStateToLocalStorage() {
  //   // for every item in React state
  //   if (typeof localStorage !== 'undefined') {
  //     Object.keys(this.state).forEach(function (key) {
  //       // save to localStorage
  //       // eslint-disable-next-line react/destructuring-assignment
  //       localStorage.setItem(key, this.state[key]);
  //     });
  //   }
  // }

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
          <section className="main-content--two">
            <div className="ma__page-header__content">
              <h1 className="ma__page-header__title">Paid Family Medical Leave Benefits Caculator</h1>
            </div>
            <Part1 error={false} disabled={false} defaultSelected={leaveReason} onChange={this.handleRadio} />
            <Part2 onChange={this.handleInput} onBlur={this.handleBlur} disabled={questTwoDisabled} defaultValue={yearIncome} belowMinSalary={belowMinSalaryConv} />
            <hr />
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
