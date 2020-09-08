import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import 'core-js/features/object';
import 'core-js/features/array';
import 'core-js/features/number';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


// eslint-disable-next-line no-undef
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
