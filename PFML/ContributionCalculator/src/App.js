import React, { Component } from 'react';
import { Header, Footer, PageHeader } from '@massds/mayflower-react';
import UtilityNavData from './data/UtilityNav.data';
import MainNavData from './data/MainNav.data';
import HeaderSearchData from './data/HeaderSearch.data';
import FooterData from './data/Footer.data';
import SocialLinksLiveData from './data/SocialLinksLive.json';
import ExampleForm from './components/ExampleForm';
import history from './components/History';
import ContributionVariables from './data/ContributionVariables.json';

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
  componentDidMount() {
    // force an update if the URL changes
    history.listen(() => this.forceUpdate());
  }
  render() {
    return(
      <div className="App">
        <Header {...this.headerProps} />
        <main className="main-content">
          <PageHeader
            title={ContributionVariables.title}
            optionalContents={[{ paragraph: { text: ContributionVariables.description } }]}
          />
          <section className="main-content main-content--two">
            <ExampleForm />
          </section>
        </main>
        <Footer {...this.footerProps} />
      </div>
    );
  }
}

export default App;
