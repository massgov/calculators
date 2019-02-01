import React, { Component } from 'react';
import { Header, Footer } from '@massds/mayflower-react';
import UtilityNavData from './data/UtilityNav.data';
import MainNavData from './data/MainNav.data';
import HeaderSearchData from './data/HeaderSearch.data';
import FooterLinksLiveData from './data/FooterLinksLive.json';
import SocialLinksLiveData from './data/SocialLinksLive.json';
import ExampleForm from './components/ExampleForm';
import history from './components/History';

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
  componentDidMount() {
    // force an update if the URL changes
    history.listen(() => this.forceUpdate());
  }
  render() {
    return(
      <div className="App">
        <Header {...this.headerProps} />
        <main className="main-content">
          <section className="main-content main-content--two">
            <div className="ma__page-header__content">
              <h1 className="ma__page-header__title">Paid Family Medical Leave Contribution Caculator</h1>
              <ExampleForm />
            </div>
          </section>
        </main>
        <Footer {...this.footerProps} />
      </div>
    );
  }
}

export default App;
