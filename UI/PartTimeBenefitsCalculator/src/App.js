import React, { Component, Fragment } from 'react';
import {
  Header, Footer, PageHeader, ButtonFixedFeedback
} from '@massds/mayflower-react';
import UtilityNavData from './data/UtilityNav.data';
import MainNavData from './data/MainNav.data';
import HeaderSearchData from './data/HeaderSearch.data';
import FooterData from './data/Footer.data';
import SocialLinksLiveData from './data/SocialLinksLive.json';

import './index.css';
import Calculator from './components/Calculator';


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
        {process.env.REACT_APP_IFRAME === 'true' ? (
          <div className="page-content">
            <Calculator />
          </div>
        ) : (
          <Fragment>
            <Header {...this.headerProps} />
            <main className="main-content">
              <PageHeader
                title="UI Benefits Calculator for Part-time Workers"
                optionalContents={[{
                  paragraph: {
                    text:
                    'If you work part time, you may still qualify for unemployment benefits. The weekly benefit amount you receive may be adjusted based on how much you earn from your part-time job. This calculator helps you estimate your situation. It is only advisory, and actual adjustments may vary depending on your specific situation.'
                  }
                }]}
              />
              <section className="main-content--two">
                <div className="ma__page-header__content">
                  <hr />
                  <Calculator />
                </div>
              </section>
              <ButtonFixedFeedback href="https://www.mass.gov/feedback" />
            </main>
            <Footer {...this.footerProps} />
          </Fragment>
        )}
      </div>
    );
  }
}

export default App;
