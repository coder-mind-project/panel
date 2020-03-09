import { createMuiTheme } from '@material-ui/core';

export const standard = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#8a05be',
    },
    secondary: {
      main: '#f44336',
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

/**
 * @description Not used, just simple template for add some themes.
 */
export const anotherTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#8a05be',
    },
    secondary: {
      main: '#f44336',
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
