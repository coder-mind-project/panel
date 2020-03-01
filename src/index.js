import React from 'react';
import ReactDOM from 'react-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#8a05be',
    },
    secondary: {
      main: '#088FF6',
    },
    action: {
      disabled: 'rgb(0,0,0)',
      disabledBackground: 'rgb(190,190,190)',
    },
  },
  typography: {
    fontFamily: [
      'Quicksand',
      'sans-serif',
    ].join(','),
  },
});


ReactDOM.render(
  <Provider store={createStore(reducers)}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
