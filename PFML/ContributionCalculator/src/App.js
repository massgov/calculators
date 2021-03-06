import React, { Component } from 'react';
import { Header, Footer, PageHeader, FeedbackForm } from '@massds/mayflower-react';
import UtilityNavData from './data/UtilityNav.data';
import MainNavData from './data/MainNav.data';
import HeaderSearchData from './data/HeaderSearch.data';
import FooterData from './data/Footer.data';
import SocialLinksLiveData from './data/SocialLinksLive.json';
import ExampleForm from './components/ExampleForm';
import history from './components/History';
import AlertBanner from './components/AlertBanner';
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
    const bannerGUID = 'pfmlcontributiondate10012019';
    const stopDate = new Date('07/18/2019 00:00');
    const currentDate = new Date();
    return(
      <div className="App">
        {process.env.REACT_APP_IFRAME === 'false' && <Header {...this.headerProps} />}
        {
          // eslint-disable-next-line no-undef
          typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(bannerGUID) && stopDate > currentDate && (
            <AlertBanner guid={bannerGUID} />
          )
        }
        <main className="main-content">
          <PageHeader
            title={ContributionVariables.title}
            optionalContents={[{ paragraph: { text: ContributionVariables.description } }]}
          />
          <section className="main-content main-content--two">
            <ExampleForm />
          </section>
          {process.env.REACT_APP_IFRAME === 'false' && (
            <div className="post-content">
              <FeedbackForm
                formId={2521317}
                radioId={47054416}
                yesFeedbackId={52940022}
                noFeedbackId={47054414}
                refererId={47056299}
                nodeId={444876}
                successMessage={() => <p>Thanks, your message has been sent to Department of Family and Medical Leave!</p>}
              />
            </div>
          )
        }
        </main>
        {process.env.REACT_APP_IFRAME === 'false' && <Footer {...this.footerProps} />}
      </div>
    );
  }
}

export default App;
