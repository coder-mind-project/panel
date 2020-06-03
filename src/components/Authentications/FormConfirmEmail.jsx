import React, { useState, useEffect } from 'react';
import { reactRouterParams } from '@/types';

import {
  Box,
  CircularProgress,
  Typography,
  Button,
  useMediaQuery,
} from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import { defineErrorMsg } from '@/config/backend';
import { devices } from '@/config/devices';

import { RedeemAccountContainer } from './styles';

function FormConfirmEmail(props) {
  const {
    location,
  } = props;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [params, setParams] = useState(null);
  const matches = useMediaQuery(devices.mobileLarge);

  function goToAuthScreen() {
    window.open('/auth', '_self');
  }

  useEffect(() => {
    function formatParamsSearchUrl(search) {
      let s = search.replace('?', '');

      s = s.split('&');

      const newParams = {};

      for (let i = 0; i < s.length; i++) {
        const keyValue = s[i].split('=');
        const key = keyValue[0];
        const value = keyValue[1] || null;

        newParams[key] = value;
      }

      setParams(newParams);
      return newParams;
    }

    async function confirmEmail() {
      const { search } = location;
      const newParams = formatParamsSearchUrl(search);

      setLoading(true);

      if (!newParams.token) {
        window.open('/auth', '_self');
      }

      const url = `/users/emails/${newParams.uid}?token=${newParams.token}`;

      const method = newParams.rt ? 'delete' : 'put';

      await axios[method](url).then(() => {
        setSuccess(true);
        if (!newParams.rt) {
          localStorage.removeItem('user');
        }
      }).catch((err) => {
        const msg = defineErrorMsg(err);
        setError(msg);
      });

      setLoading(false);
    }

    if (!error && !success && !loading) {
      confirmEmail();
    }
  }, [params, error, success, loading, location]);

  return (
    <RedeemAccountContainer>
      { loading
        && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
            height="350px"
          >
            <CircularProgress color="primary" size={80} />
          </Box>
        )
      }
      { (success || error)
        && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexWrap="wrap"
              p={2}
            >
              <Box display="flex" alignItems="center" mr={matches ? 0 : 2}>
                <FontAwesomeIcon
                  icon={success ? faCheckCircle : faTimesCircle}
                  size="5x"
                  color={success ? '#28a745' : '#dc3545'}
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                mt={matches ? 2 : 0}
              >
                <Typography component="h1" variant="h6" align="center">
                  { success ? `${params && params.rt ? 'Troca de e-mail cancelada com sucesso, é recomendável abrir um ticket nos informando sobre o ocorrido' : 'E-mail confirmado com sucesso!'}` : error || 'Ocorreu um erro desconhecido, se persistir reporte!' }
                </Typography>
              </Box>
            </Box>
            { success && !(params && params.rt)
                && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    mt={3}
                    mb={2}
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={goToAuthScreen}
                    >
                      Ir para o login
                    </Button>
                    <Box mt={1} display="flex" justifyContent="center">
                      <Typography
                        component="span"
                        variant="caption"
                        align="center"
                      >
                        Você redirecionado para a tela de login para realizar
                        o acesso com o novo e-mail
                      </Typography>
                    </Box>
                  </Box>
                )
              }
          </Box>
        )
    }
    </RedeemAccountContainer>
  );
}

FormConfirmEmail.propTypes = {
  location: reactRouterParams.isRequired,
};


export default FormConfirmEmail;
