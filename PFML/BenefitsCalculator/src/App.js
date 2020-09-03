import React, { Component } from 'react';
import HelpTip from '@massds/mayflower-react/es/components/organisms/HelpTip';
import PageHeader from '@massds/mayflower-react/es/components/organisms/PageHeader';
import Header from '@massds/mayflower-react/es/components/organisms/Header';
import Footer from '@massds/mayflower-react/es/components/organisms/Footer';
import UtilityNavData from './data/UtilityNav.data';
import MainNavData from './data/MainNav.data';
import HeaderSearchData from './data/HeaderSearch.data';
import FooterData from './data/Footer.data';
import SocialLinksLiveData from './data/SocialLinksLive.json';
import LeaveType from './components/LeaveType';
import WagesInput from './components/WagesInput';
import BenefitsVariables from './data/BenefitsVariables.json';
import inputProps from './data/wagesInput.json';

import './index.css';

class App extends Component {
  constructor(props) {
    super(props);
    /* eslint-disable no-undef */
    this.state = {
      qualified: false,
      weeklyBenefit: null,
      leaveReason: ''
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
  }

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

export default App;
