export default {
  items: [{
    text: 'State Organizations',
    ariaLabelText: '',
    icon: 'building',
    closeText: 'Close',
    panel: {
      description: {
        text: 'The <a href="https://www.mass.gov/state-organization-index">A-Z Organizations page</a> provides an alphabetical listing of government organizations, including commissions, departments, and bureaus.'
      }
    }
  }, {
    text: 'Log in to...',
    ariaLabelText: 'Log in to the most requested services',
    icon: 'login',
    closeText: 'Close',
    panel: {
      description: {
        text: 'These are the top requested sites you can log in to access state provided services'
      },
      links: [{
        text: 'Unemployment Online',
        href: 'https://uionline.detma.org/Claimant/Core/Login.ASPX',
        type: 'external'
      }, {
        text: 'Virtual Gateway',
        href: 'https://sso.hhs.state.ma.us/',
        type: 'external'
      }, {
        text: 'Child Support Enforcement',
        href: 'https://ecse.cse.state.ma.us/ECSE/Login/login.asp',
        type: 'external'
      }]
    }
  }]
};
