import 'react-app-polyfill/ie9';
import 'core-js/es6/number';
import 'core-js/es6/object';
import 'core-js/es6/array';
import React from 'react';
import ReactDOM from 'react-dom';
import { configureUrlQuery } from 'react-url-query';
import TagManager from 'react-gtm-module';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import history from './components/History';


// link the history used in our app to url-query so it can update the URL with it.
configureUrlQuery({ history });

const tagManagerArgs = {
  gtmId: 'GTM-PJ224LR',
  events: {
    slider: 'slider'
  }
};

TagManager.initialize(tagManagerArgs);

// eslint-disable-next-line no-undef
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
