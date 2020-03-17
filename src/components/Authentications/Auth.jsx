import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Box,
  LinearProgress,
  Button,
  Typography,
  useMediaQuery,
} from '@material-ui/core';

import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';

import axios from 'axios';

import Recaptcha from 'react-google-invisible-recaptcha';
import { CAPTCHA_SITE_KEY } from '@/config/dataProperties';

import { devices } from '@/config/devices';
import RedeemAccount from '@/components/Authentications/RedeemAccount.jsx';
import CustomButtonBase from '@/components/Authentications/AuthButton.jsx';
import PasswordField from '@/components/PasswordField.jsx';

import { backendUrl, defineErrorMsg } from '@/config/backend';

import LogoWhite from '@/assets/coder-mind-painelv1-branco.png';
import LogoBlack from '@/assets/coder-mind-painelv1-preto.png';
import LogoClean from '@/assets/Logo-coder-mind.png';

import {
  GridPresentation,
  AuthSection,
  LogoArea,
  FormArea,
  AuthTextField,
  SpecialButton,
  SubmitArea,
  CustomAlert,
  CustomFormControl,
} from './styles';

function Auth(props) {
  const {
    appError,
    theme,
  } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rescuePassword, setRescuePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState('');

  const matches = useMediaQuery(devices.mobileLarge);
  const isLightTheme = useMediaQuery(`(prefers-color-scheme: ${theme})`);
  const recaptchaRef = useRef(null);

  function toogleRescuePassword() {
    setError('');
    setRescuePassword(!rescuePassword);
  }

  function resolve(event) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    recaptchaRef.current.execute();
  }

  function captchaError() {
    recaptchaRef.current.reset();
    setError('Ocorreu um erro no recaptcha, se persistir reporte');
  }

  function handleChange(setAttr) {
    return (event) => {
      const { value } = event.target;
      setAttr(value);
    };
  }

  function authFormFocus() {
    const input = document.querySelector('#coder-mind-username');
    if (input) input.focus();
    if (!matches) {
      window.scrollTo(0, window.screen.height);
    }
  }

  function defineRef(ref) {
    recaptchaRef.current = ref;
  }

  useEffect(() => {
    async function verifyUser() {
      const user = localStorage.getItem('user');
      if (user && !appError) setRedirect(true);
    }

    verifyUser();
  }, [redirect, appError]);

  useEffect(() => {
    async function signIn() {
      const response = recaptchaToken;

      setRecaptchaToken('');

      const user = {
        email,
        password,
        response,
      };

      const url = `${backendUrl}/auth`;

      await axios.post(url, user).then(async (res) => {
        localStorage.setItem('user', JSON.stringify({ token: res.data.token }));
        window.open('/', '_self');
      }).catch(async (err) => {
        const msg = await defineErrorMsg(err);
        setError(msg);
        recaptchaRef.current.reset();
      });

      setLoading(false);
    }

    if (recaptchaToken) signIn();
  }, [email, loading, password, recaptchaToken]);

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap" height="100%">
      {redirect
          && <Redirect to="/" />
      }
      { !rescuePassword
          && (
            <GridPresentation item xs={12} md={4}>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <img src={LogoClean} alt="Coder Mind" />
                <Typography component="h2" variant="h5">Seja bem vindo ao nosso App!</Typography>
                <Typography component="h2" variant="h5">Aqui você poderá publicar seus artigos e acompanhar sua relevância.</Typography>
                <Box display="flex" alignItems="center" flexDirection="column" mt={2} mb={2}>
                  <Button color="inherit" variant="outlined" fullWidth>Criar conta</Button>
                  <SpecialButton onClick={authFormFocus} color="inherit" variant="outlined" fullWidth>Já tenho uma conta</SpecialButton>
                </Box>
              </Box>
            </GridPresentation>
          )
      }
      <Grid item xs={12} md={!rescuePassword ? 8 : 12}>
        { !rescuePassword
            && (
              <AuthSection>
                { loading && <LinearProgress color="primary" />}
                <LogoArea>
                  <img src={isLightTheme ? LogoBlack : LogoWhite} alt="Logo" width="200" />
                </LogoArea>
                <FormArea>
                  { Boolean(error)
                      && (
                      <CustomAlert severity="warning">
                        {error}
                      </CustomAlert>
                      )
                  }
                  <form onSubmit={resolve}>
                    <AuthTextField
                      label="E-mail"
                      onChange={handleChange(setEmail)}
                      inputProps={{ autoComplete: 'email', id: 'coder-mind-username' }}
                    />
                    <CustomFormControl>
                      <PasswordField
                        label="Senha"
                        inputId="cm-password"
                        inputAutoComplete="password"
                        value={password}
                        onChange={handleChange(setPassword)}
                        autoFocus
                      />
                    </CustomFormControl>
                    <Box mt={2} mb={3}>
                      <Button
                        size="small"
                        variant="text"
                        color="primary"
                        onClick={toogleRescuePassword}
                      >
                        Não consegue acessar sua conta?
                      </Button>
                    </Box>
                    <Recaptcha
                      sitekey={CAPTCHA_SITE_KEY}
                      ref={defineRef}
                      onResolved={((token) => setRecaptchaToken(token))}
                      style={{ zIndex: 1 }}
                      onError={() => captchaError()}
                      onExpired={() => captchaError()}
                      locale="pt-br"
                    />
                    <SubmitArea item xs={12}>
                      <CustomButtonBase
                        type="submit"
                        onClick={resolve}
                        fullWidth
                        disabledIcon
                        severity="primary"
                        loading={loading}
                        text={loading ? 'Entrando...' : 'Entrar'}
                      />
                    </SubmitArea>
                  </form>
                </FormArea>
              </AuthSection>
            )
        }
      </Grid>
      { rescuePassword
            && (
              <RedeemAccount back={() => toogleRescuePassword()} />
            )
        }
    </Box>

  );
}

Auth.propTypes = {
  appError: PropTypes.bool,
  theme: PropTypes.oneOf([
    'light',
    'dark',
  ]).isRequired,
};

Auth.defaultProps = {
  appError: false,
};

const mapStateToProps = (state) => ({ appError: state.error, theme: state.theme });

export default connect(mapStateToProps)(Auth);
