import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import {
  Grid,
  Fade,
  CircularProgress,
} from '@material-ui/core';

import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Error Boundary
import ErrorBoundary from '@/components/Errors/ErrorBoundary.jsx';


import { MuiThemeProvider } from '@material-ui/core/styles';
import { standard } from '@/config/themes';
import { WHITE_LIST_ROUTES } from './config/dataProperties';
// Requests imports
import { backendUrl } from './config/backend';


// Redux imports
import { setUser as defineUser } from './redux/user/userActions';
import { setError as dispatchError } from './redux/error/errorActions';
import { setMenu as callMenu } from './redux/menu/menuActions';
import { callToast as toastEmitter } from './redux/toast/toastActions';

import Menu from './components/Menu/Menu';
import Toast from './components/Toast';

import Themes from './components/Themes/Themes';
import Management from './components/Management/Management';
import Error from './components/Errors/Error';
import Auth from './components/Authentications/Auth';
import Ticket from './components/Tickets/SendTickets/Ticket';
import Tickets from './components/Tickets/ManageTickets/Tickets';
import RouteNotFound from './components/NotFound/RouteNotFound';
import Users from './components/Users/Management/Users';
import User from './pages/users-section/User';
import Articles from './pages/articles-section/Articles';
import Article from './pages/articles-section/Article';
import Stats from './pages/statistics-section/Stats';
import Categories from './pages/managements-section/Categories/Categories';
import Category from './pages/managements-section/Categories/Category';
import MyAccount from './components/Users/MyAccount/MyAccount';
import Comments from './pages/comments-section/Comments';
import Comment from './pages/comments-section/Comment';
import RedeemAccount from './pages/auth-section/RedeemAccount';
import ConfirmEmail from './pages/auth-section/ConfirmEmail';
import RemoveAccount from './pages/auth-section/RemoveAccount';


// Css imports
import './index.css';
import { AppContent } from './styles';


function App(props) {
  const {
    setMenu,
    setUser,
    setError,
    callToast,
    toast,
    error,
    user,
    theme,
  } = { ...props };

  const appTheme = standard(theme);

  const [validatingToken, setValidatingToken] = useState(true);
  const [path, setPath] = useState('');

  function validateRoutes() {
    let top = 0;
    for (let i = 0; i < WHITE_LIST_ROUTES.length; i++) {
      if (WHITE_LIST_ROUTES[i] !== path) top++;
    }

    return Boolean(top === WHITE_LIST_ROUTES.length);
  }

  function getPath() {
    const url = window.location.href;
    return `/${url.split('/')[3].split('?')[0]}`;
  }

  function closeToast() {
    const config = {
      type: 'success',
      msg: '',
      display: false,
    };

    callToast(config);
  }

  useEffect(() => {
    async function validateToken() {
      const token = await JSON.parse(localStorage.getItem('user'));

      if (token) {
        const url = `${backendUrl}/auth/logged`;
        await axios.post(url, token).then((res) => {
          if (res.data.user) {
            setUser(res.data);
            setMenu(true);
          } else {
            localStorage.removeItem('user');
            setUser(null);
            setMenu(false);
          }
        }).catch(() => {
          setError(true);
        });
      }

      setValidatingToken(false);
    }

    const currentPath = getPath();
    setPath(currentPath);
    if (validatingToken) validateToken();
  }, [setMenu, setUser, setError, validatingToken]);

  return (
    <MuiThemeProvider theme={appTheme}>
      <Grid>
        { !validatingToken
            && (
              <Router>
                <ErrorBoundary>
                  {getPath() !== '/confirm-email' && <Menu />}
                  <Toast
                    show={toast.display}
                    color={toast.type}
                    text={toast.msg}
                    closeToast={closeToast}
                  />
                  { !user._id && validateRoutes()
                    && (
                      <Redirect to="/auth" />
                    )
                  }
                  { error
                    && <Redirect to="/error" />
                  }
                  <AppContent user={user} isvalidating={validatingToken ? 'true' : ''}>
                    <Switch>
                      <Route path="/" exact component={Articles} />
                      <Route path="/auth" exact component={Auth} />
                      <Route path="/redeem-account" exact component={RedeemAccount} />
                      <Route path="/remove-account" exact component={RemoveAccount} />
                      <Route path="/ticket" exact component={Ticket} />
                      <Route path="/tickets" exact component={Tickets} />
                      <Route path="/confirm-email" exact component={ConfirmEmail} />
                      <Route path="/user" exact component={User} />
                      <Route path="/user/:id" exact component={User} />
                      <Route path="/users" exact component={Users} />
                      <Route path="/article" exact component={Article} />
                      <Route path="/article/:id" exact component={Article} />
                      <Route path="/articles" exact component={Articles} />
                      <Route path="/management" exact component={Management} />
                      <Route path="/themes" exact component={Themes} />
                      <Route path="/category" exact component={Category} />
                      <Route path="/category/:id" exact component={Category} />
                      <Route path="/categories" exact component={Categories} />
                      <Route path="/my-account" exact component={MyAccount} />
                      <Route path="/comments" exact component={Comments} />
                      <Route path="/comments/:id" exact component={Comment} />
                      <Route path="/error" exact component={Error} />
                      <Route path="/stats" exact component={Stats} />
                      <Route component={RouteNotFound} />
                    </Switch>
                  </AppContent>
                </ErrorBoundary>
              </Router>
            )
          }
        { validatingToken
            && (
            <Fade in={validatingToken}>
              <Grid item xs={12} className="loading-app-area">
                <CircularProgress size={70} />
              </Grid>
            </Fade>
            )
          }
      </Grid>
    </MuiThemeProvider>
  );
}


const mapStateToProps = (state) => ({
  user: state.user,
  error: state.error,
  menu: state.menu,
  toast: state.toast,
  theme: state.theme,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
  setUser: defineUser,
  setError: dispatchError,
  setMenu: callMenu,
  callToast: toastEmitter,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(App);
