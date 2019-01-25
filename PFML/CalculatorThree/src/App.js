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

import './index.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yearIncome: null,
      maxWeeks: null
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

  handleInput = (numberValue, e) => {
    this.setState({
      yearIncome: numberValue
    });
  };

  handleRadio = ({selected, maxWeeks, event}) => {
    this.setState({
      maxWeeks
    });
  }

  render() {
    const questTwoDisabled = this.state.weeks > 0 ? false : true;
    return (
      <div className="App">
        <Header {...this.headerProps} />
          <main className="main-content">
            <section className="main-content--two">
              <div className="ma__page-header__content">
                <h1 className="ma__page-header__title">Paid Family Medical Leave Benefits Caculator</h1>
              </div>
              <QuestionOne error={false} disabled={false} defaultSelected="active-duty" onChange={this.handleRadio} />
              <QuestionTwo onChange={this.handleInput} disabled={questTwoDisabled} />
              <hr />
              {this.state.yearIncome > 0 && this.state.maxWeeks > 0 && (
                <React.Fragment>
                  <Output yearIncome={this.state.yearIncome} maxWeeks={this.state.maxWeeks}/>
                  <Button type="submit" size="small" info="Learn more about filing a claim." text="Learn about how to file a claim" href="https://www.mass.gov" />
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
