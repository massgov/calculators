import React, { Component } from 'react';
import HelpTip from '@massds/mayflower-react/es/components/organisms/HelpTip';
import PageHeader from '@massds/mayflower-react/es/components/organisms/PageHeader';
import Paragraph from '@massds/mayflower-react/es/components/atoms/text/Paragraph';
import Header from '@massds/mayflower-react/es/components/organisms/Header';
import Footer from '@massds/mayflower-react/es/components/organisms/Footer';
import FeedbackForm from '@massds/mayflower-react/es/components/forms/FeedbackForm';
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

    const { helpText, ...helpTipProps } = inputProps.inputTitle;

    const getHelpTip = () => (
      <h2>
        <HelpTip {...helpTipProps} {...this.helptipIframeProp} id="helptext-total-wages">
          <div className="ma__help-text">
            {helpText.map((p) => (<Paragraph>{p}</Paragraph>))}
          </div>
        </HelpTip>
      </h2>
    );

    return(
      <div className="App">
        {process.env.REACT_APP_IFRAME === 'true' ? (
          <div className="page-content">
            <hr />
            {getHelpTip()}
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
                  {getHelpTip()}

                  <WagesInput onSubmit={this.handleWagesSubmit} />
                  <LeaveType {...leaveTypeProps} />
                  <hr />
                  {process.env.REACT_APP_IFRAME === 'false' && (
                    <div className="post-content">
                      <FeedbackForm
                        formId={2521317}
                        radioId={47054416}
                        yesFeedbackId={52940022}
                        noFeedbackId={47054414}
                        refererId={47056299}
                        nodeId={539571}
                        successMessage={() => <p>Thanks, your message has been sent to Department of Family and Medical Leave!</p>}
                      />
                    </div>
                  )
                }
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
