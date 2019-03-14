import React, { Component } from 'react';
import {
  Header, Footer, PageHeader, HelpTip, ButtonFixedFeedback
} from '@massds/mayflower-react';
import UtilityNavData from './data/UtilityNav.data';
import MainNavData from './data/MainNav.data';
import HeaderSearchData from './data/HeaderSearch.data';
import FooterData from './data/Footer.data';
import SocialLinksLiveData from './data/SocialLinksLive.json';
import Form from './components/Form';

import './index.css';

class App extends Component {
  constructor(props) {
    super(props);
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

  render() {
    return(
      <div className="App">
        {process.env.REACT_APP_IFRAME === 'false' && <Header {...this.headerProps} />}
        <main className="main-content">
          <PageHeader
            title="UI Claimants Benefits Calculator"
            optionalContents={[{
              paragraph: {
                text:
              'If you are eligible to receive unemployment benefits, you will receive a weekly benefit amount of approximately 50% of your average weekly wage, up to the maximum set by law. As of October 2018, the maximum weekly benefit amount is $795 per week.'
              }
            }]}
          />
          <section className="main-content main-content--two">
            <div className="page-content">
              <hr />
              <h2>
                <HelpTip
                  text="Enter your total wages for the last 4 quarters to estimate your benefits."
                  triggerText={['total wages']}
                  helpText={['Total wages means the gross amount that appears on your paycheck or W-2. Do not use wages net of tax or other deductions.']}
                  id="helptext-total-wages"
                />
              </h2>

              <Form />
            </div>
          </section>
          {process.env.REACT_APP_IFRAME === 'false' && <ButtonFixedFeedback href="https://www.mass.gov/feedback" />}
        </main>
        {process.env.REACT_APP_IFRAME === 'false' && <Footer {...this.footerProps} />}
      </div>
    );
  }
}

export default App;
