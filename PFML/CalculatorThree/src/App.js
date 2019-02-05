import React, { Component } from 'react';
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


class App extends Component {
  constructor(props) {
    super(props);
    const hasLocalStore = typeof localStorage !== 'undefined';
    /* eslint-disable no-undef */
    this.state = {
      yearIncome: (hasLocalStore) ? localStorage.getItem('yearIncome') : 0,
      maxWeeks: (hasLocalStore) ? localStorage.getItem('maxWeeks') : '',
      leaveReason: (hasLocalStore) ? localStorage.getItem('leaveReason') : '',
      belowMinSalary: (hasLocalStore) ? localStorage.getItem('belowMinSalary') : false
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
    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
    if (typeof window !== 'undefined') {
      window.addEventListener(
        'beforeunload',
        this.saveStateToLocalStorage.bind(this)
      );
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener(
        'beforeunload',
        this.saveStateToLocalStorage.bind(this)
      );
    }

    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
  }

  handleInput = (e, value) => {
    const numberValue = value;
    this.setState({
      yearIncome: numberValue
    });
    if (numberValue > CalculatorThreeVariables.baseVariables.minSalary) {
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
  }

  handleBlur = (numberValue) => {
    if (numberValue < CalculatorThreeVariables.baseVariables.minSalary) {
      this.setState({
        belowMinSalary: true
      });
    }
  }

  saveStateToLocalStorage() {
    // for every item in React state
    if (typeof localStorage !== 'undefined') {
      Object.keys(this.state).forEach(function (key) {
        // save to localStorage
        // eslint-disable-next-line react/destructuring-assignment
        localStorage.setItem(key, this.state[key]);
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

export default App;
