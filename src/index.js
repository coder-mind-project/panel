import React from 'react';
import ReactDOM from 'react-dom';


// Redux imports
import { Provider } from 'react-redux';
import store from './redux';

import App from './App';

import './config/axios';
import './index.css';


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
