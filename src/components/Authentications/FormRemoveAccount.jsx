import React, { useState, useEffect } from 'react';
import { userType, reactRouterParams } from '@/types';

import {
  Box,
  CircularProgress,
  Typography,
} from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { connect } from 'react-redux';

import axios from 'axios';

import { RedeemAccountContainer } from './styles';

function FormRemoveAccount(props) {
  const {
    user,
    location,
  } = props;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    function formatParamsSearchUrl(search) {
      let s = search.replace('?', '');

      s = s.split('&');

      const params = {};

      for (let i = 0; i < s.length; i++) {
        const keyValue = s[i].split('=');
        const key = keyValue[0];
        const value = keyValue[1] || null;

        params[key] = value;
      }

      return params;
    }

    async function removeAccount() {
      const { search } = location;
      const params = formatParamsSearchUrl(search);

      if (!params.uid) {
        window.open('/auth', '_self');
        return null;
      }

      const token = await JSON.parse(localStorage.getItem('user'));

      if (token) {
        window.open('/', '_self');
        return null;
      }

      setLoading(true);

      const url = `/auth/rescue?id=${params.uid}`;

      await axios.delete(url).then(() => {
        setSuccess(true);
        if (!params.rt) localStorage.removeItem('user');
      }).catch(() => {
        setError(true);
      });

      setLoading(false);

      return true;
    }

    if (!error && !success && !loading) {
      removeAccount();
    }
  }, [user, location, loading, success, error]);

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
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
            p={2}
          >
            <Box display="flex" alignItems="center" mr={2}>
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
            >
              <Typography component="h1" variant="h6">
                { success ? 'Conta removida com sucesso, não será mais possível acessar nosso painel com estas credenciais!' : 'Ocorreu um erro desconhecido, se persistir reporte!' }
              </Typography>
            </Box>
          </Box>
        )
    }
    </RedeemAccountContainer>
  );
}

FormRemoveAccount.propTypes = {
  user: userType,
  location: reactRouterParams.isRequired,
};

FormRemoveAccount.defaultProps = {
  user: {},
};

const mapStateToProps = (state) => ({ user: state.user });
export default connect(mapStateToProps)(FormRemoveAccount);
