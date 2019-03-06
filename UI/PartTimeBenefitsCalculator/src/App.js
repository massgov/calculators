import React, { Component } from 'react';
import { Header, Footer, PageHeader } from '@massds/mayflower-react';
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
        {process.env.REACT_APP_IFRAME === "false" && <Header {...this.headerProps} />}
        <main className="main-content">
          <PageHeader
            title="UI Benefits Calculator for Part-time Workers"
            optionalContents={[{
              paragraph: {
                text:
                'If you work part time, you may still qualify for unemployment benefits. The weekly benefit amount you receive may be adjusted based on how much you earn from your part-time job.'
              }
            }]}
          />
          <section className="main-content--two">
            <div className="ma__page-header__content">
              <hr />
              <Calculator />
            </div>
          </section>
        </main>
        {process.env.REACT_APP_IFRAME === "false" && <Footer {...this.footerProps} />}
      </div>
    );
  }
}

export default App;
