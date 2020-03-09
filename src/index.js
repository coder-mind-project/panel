import React from 'react';
import ReactDOM from 'react-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { standard } from '@/config/themes';

// Redux imports
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import userReducer from './redux/userReducer';
import errorReducer from './redux/errorReducer';
import menuReducer from './redux/menuReducer';
import toastReducer from './redux/toastReducer';

import App from './App';

import './config/axios';

import './index.css';

const reducers = combineReducers({
  user: userReducer,
  error: errorReducer,
  menu: menuReducer,
  toast: toastReducer,
});

ReactDOM.render(
  <Provider store={createStore(reducers)}>
    <MuiThemeProvider theme={standard}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
