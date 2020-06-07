import React from 'react';
import { Box, Typography } from '@material-ui/core';

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '@/components/Buttons/Button.jsx';
import BrokenRobot from '@/assets/broken-robot-extra-small.png';

import { APP_REPORT_US } from '@/config/dataProperties';

import {
  ErrorBox,
  ErrorContainer,
  ErrorPaper,
  ErrorLogo,
  ErrorMsg,
} from './styles';

function Error(props) {
  const { error } = { ...props };

  function redirect() {
    window.open('/', '_self');
  }

  return (
    <ErrorContainer>
      { !error
        && <Redirect to="/" />
      }
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <ErrorPaper>
          <Box display="flex" justifyContent="center" alignItems="center" p={3}>
            <img src={BrokenRobot} alt="Erro de sistema" />
          </Box>
          <ErrorBox>
            <ErrorLogo>
              <Typography component="h1" variant="h5" align="center">
                Ops, algo deu errado :(
              </Typography>
            </ErrorLogo>
            <ErrorMsg>
              <Typography component="p" variant="body1" align="center">
                Aparentemente ocorreu algum erro, tente clicar no botão abaixo.
              </Typography>
            </ErrorMsg>
            <Box>
              <Box mb={2}>
                <Typography component="p" variant="body2" align="center">
                  Se o problema persitir
                  {' '}
                  <a href={APP_REPORT_US} target="_blank" rel="noopener noreferrer">reporte-nos!</a>
                </Typography>
              </Box>
              <Button
                fullWidth
                icon="cached"
                text="Recarregar"
                onClick={redirect}
              />
            </Box>
          </ErrorBox>
        </ErrorPaper>
      </Box>
    </ErrorContainer>
  );
}

const mapStateToProps = (state) => ({ error: state.error });
export default connect(mapStateToProps)(Error);
