import React from 'react';
import ReactDOM from 'react-dom';
import { configureUrlQuery } from 'react-url-query';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import history from './components/History';

// link the history used in our app to url-query so it can update the URL with it.
configureUrlQuery({ history });

// eslint-disable-next-line no-undef
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
