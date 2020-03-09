import React from 'react';
import ReactDOM from 'react-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { standard } from '@/config/themes';

// Redux imports
import { Provider } from 'react-redux';
import store from './redux';

import App from './App';

import './config/axios';
import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={standard}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
