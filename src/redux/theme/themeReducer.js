/* eslint-disable no-param-reassign */
const INITIAL_STATE = 'light';

export default function (state = INITIAL_STATE, action) {
  if (action.theme) {
    const theme = {
      type: action.theme === 'dark' ? 'dark' : 'light',
    };

    localStorage.setItem('coder-mind-app-theme', JSON.stringify(theme));

    state = action.theme;
  } else {
    const definedTheme = JSON.parse(localStorage.getItem('coder-mind-app-theme'));

    if (definedTheme && definedTheme.type === 'dark') {
      state = 'dark';
    }
  }


  return state;
}
