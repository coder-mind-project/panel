import { createStore, combineReducers } from 'redux';

import userReducer from './user/userReducer';
import errorReducer from './error/errorReducer';
import menuReducer from './menu/menuReducer';
import toastReducer from './toast/toastReducer';
import themeReducer from './theme/themeReducer';

const reducers = combineReducers({
  user: userReducer,
  error: errorReducer,
  menu: menuReducer,
  toast: toastReducer,
  theme: themeReducer,
});

export default createStore(reducers);
