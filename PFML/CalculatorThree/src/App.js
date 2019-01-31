import React, { Component } from 'react';
import { Header, Footer, Button } from '@massds/mayflower-react';
import UtilityNavData from './data/UtilityNav.data';
import MainNavData from './data/MainNav.data';
import HeaderSearchData from './data/HeaderSearch.data';
import FooterLinksLiveData from './data/FooterLinksLive.json';
import SocialLinksLiveData from './data/SocialLinksLive.json';
import QuestionOne from './components/QuestionOne';
import QuestionTwo from './components/QuestionTwo';
import Output from './components/Output';
import CalculatorThreeVariables from './data/CalculatorThreeVariables.json';

import './index.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yearIncome: localStorage.getItem('yearIncome') || 0,
      maxWeeks: localStorage.getItem('maxWeeks') || '',
      leaveReason: localStorage.getItem('leaveReason') || '',
      belowMinSalary: localStorage.getItem('belowMinSalary') || false
    };
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
    window.addEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    );

    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
  }

  saveStateToLocalStorage() {
    // for every item in React state
    for (const key in this.state) {
      // save to localStorage
      localStorage.setItem(key, this.state[key]);
    }
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

  handleRadio = ({ selected, maxWeeks, event }) => {
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
            <QuestionOne error={false} disabled={false} defaultSelected={leaveReason} onChange={this.handleRadio} />
            <QuestionTwo onChange={this.handleInput} onBlur={this.handleBlur} disabled={questTwoDisabled} defaultValue={yearIncome} belowMinSalary={belowMinSalaryConv} />
            <hr />
            {yearIncome > 0 && maxWeeks > 0 && !belowMinSalary && (
            <React.Fragment>
              <Output yearIncome={yearIncome} maxWeeks={maxWeeks} />
              <Button type="submit" size="small" info="Learn more about filing a claim." text="Learn about how to file a claim" href="https://www.mass.gov/info-details/paid-family-medical-leave-for-employees-faq" />
            </React.Fragment>
            )}
          </section>
        </main>
        <Footer {...this.footerProps} />
      </div>
    );
  }
}

export default App;
