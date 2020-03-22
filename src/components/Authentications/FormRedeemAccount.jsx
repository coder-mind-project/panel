import React, { useState, useEffect } from 'react';
import { reactRouterParams, userType } from '@/types';

import {
  Grid,
  CircularProgress,
  Box,
  Button,
  Typography,
  LinearProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import ButtonBase from '@/components/Authentications/AuthButton.jsx';
import PasswordField from '@/components/PasswordField.jsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import Logo from '@/assets/coder-mind-painelv1-preto.png';

import axios from 'axios';
import { backendUrl, defineErrorMsg } from '@/config/backend';


import { connect } from 'react-redux';

import { LogoArea, RedeemAccountContainer, CustomLink } from './styles';

function FormRedeemAccount(props) {
  const {
    location,
    userLogged,
  } = props;

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState({});
  const [firstField, setFirstField] = useState('');
  const [secondField, setSecondField] = useState('');
  const [loaded, setLoaded] = useState(false);

  async function changePassword(evt) {
    if (confirming) return;
    if (evt) evt.preventDefault();

    const url = `${backendUrl}/auth/rescue?token=${token}&id=${user._id}`;
    const data = { firstField, secondField };

    setConfirming(true);

    await axios.patch(url, data).then(() => {
      setSuccess(true);
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      setError(msg);
    });

    setConfirming(false);
  }

  useEffect(() => {
    function collectToken() {
      if (!location.search || userLogged._id) {
        window.open('/auth', '_self');
        return null;
      }

      let search = location.search.replace('?', '');
      const match = search.match(/token/);

      if (!match) {
        window.open('/auth', '_self');
        return null;
      }

      search = search.replace('&', '=').split('=');

      let t = '';
      search.forEach((elem, index) => {
        if (elem === 'token') {
          t = search[index + 1];
        }
      });

      setToken(t);
      return t;
    }

    async function verifyToken() {
      setLoading(true);

      const tokenResulted = collectToken();
      if (!tokenResulted) {
        setError(true);
        setLoading(false);
        return;
      }

      const url = `${backendUrl}/auth/rescue?token=${tokenResulted}`;

      await axios.post(url).then(async (res) => {
        setUser(res.data);
        setAuthorized(true);
      }).catch((err) => {
        setError(err);
      });
      setLoading(false);
    }

    if (!loaded) {
      setLoaded(true);
      verifyToken();
    }
  }, [userLogged, loading, location, user, authorized, error, token, loaded]);

  return (
    <Box height="100%" width="100%" overflow="hidden">
      {confirming && <LinearProgress color="primary" />}
      <RedeemAccountContainer option="emailAndPassword">
        { !loading && authorized && !success
          && (
          <form onSubmit={changePassword}>
            <LogoArea>
              <img src={Logo} alt="Logo" width="200" />
            </LogoArea>
            <Grid item xs={12}>
              <Box width="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Typography component="h1" variant="h6">Recuperação de senha</Typography>
                <Typography component="p" variant="body2">
                  {`Olá ${user.name}, informe a nova senha`}
                </Typography>
              </Box>
              { Boolean(error)
                && (
                  <Box mt={3}>
                    <Alert severity="warning">{error}</Alert>
                  </Box>
                )
              }
              <PasswordField
                label="Insira sua nova senha"
                inputId="cm-new-password"
                inputAutoComplete="new-password"
                value={firstField}
                fullWidth
                margin="dense"
                onChange={(evt) => setFirstField(evt.target.value)}
              />
              <PasswordField
                label="Confirme a senha"
                inputId="cm-confirm-new-password"
                inputAutoComplete="new-password"
                value={secondField}
                fullWidth
                margin="dense"
                onChange={(evt) => setSecondField(evt.target.value)}
              />
            </Grid>
            <Box mt={2} mb={2}>
              <ButtonBase
                type="submit"
                onClick={changePassword}
                disabledIcon
                fullWidth
                text="Confirmar"
              />
            </Box>
          </form>
          )
        }
        { loading
          && (
            <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center" mt={2} mb={5}>
              <CircularProgress size={80} color="primary" />
              {loading.toString()}
            </Box>
          )
        }
        { (success || (error && !authorized))
          && (
            <Box height="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={3}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexWrap="wrap"
                mb={3}
              >
                <Box m={2}>
                  <FontAwesomeIcon
                    icon={error ? faTimesCircle : faCheckCircle}
                    size="4x"
                    color={error ? '#f44336' : '#218838'}
                  />
                </Box>
                <Typography component="h1" variant="h6">
                  {error
                    ? 'Ops, não foi possível recuperar o seu token. \n Tente solicitar uma nova recuperação de senha e tente novamente.'
                    : 'Senha alterada com sucesso'
                  }
                </Typography>
              </Box>
              <CustomLink to="/auth">
                <Button
                  color="primary"
                  variant="contained"
                >
                  Ir para o Login
                </Button>
              </CustomLink>
            </Box>
          )
        }
      </RedeemAccountContainer>
    </Box>
  );
}

FormRedeemAccount.propTypes = {
  location: reactRouterParams.isRequired,
  userLogged: userType,
};

FormRedeemAccount.defaultProps = {
  userLogged: {},
};

const mapStateToProps = (state) => ({ userLogged: state.user });

export default connect(mapStateToProps)(FormRedeemAccount);
