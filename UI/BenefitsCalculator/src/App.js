import React, { Component } from 'react';
import { Header, Footer, PageHeader } from '@massds/mayflower-react';
import UtilityNavData from './data/UtilityNav.data';
import MainNavData from './data/MainNav.data';
import HeaderSearchData from './data/HeaderSearch.data';
import FooterLinksLiveData from './data/FooterLinksLive.json';
import SocialLinksLiveData from './data/SocialLinksLive.json';
import Form from './components/Form';

import './index.css';


class App extends Component {
  constructor(props) {
    super(props);
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

  render() {
    return(
      <div className="App">
        <Header {...this.headerProps} />
        <main className="main-content">
          <PageHeader
            title="UI Claimants Benefits Calculator"
            optionalContents={[{paragraph: {text:
              'If you are eligible to receive unemployment benefits, you will receive a weekly benefit amount of approximately 50% of your average weekly wage, up to the maximum set by law. As of October 2018, the maximum weekly benefit amount is $795 per week. Enter your earnings below to estimate your benefits.'
            }}]}
          />
          <section className="main-content main-content--two">
            <div className="page-content">
              <hr />
              <Form />
            </div>
          </section>
        </main>
        <Footer {...this.footerProps} />
      </div>
    );
  }
}

export default App;
