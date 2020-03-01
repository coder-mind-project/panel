import React from 'react';
import { Box, Typography } from '@material-ui/core';

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '@/components/Button.jsx';
import BrokenRobot from '@/assets/broken-robot-extra-small.png';

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
          <ErrorBox>
            <ErrorLogo>
              <Typography component="h1" variant="h5">
                Ops, algo deu errado :(
              </Typography>
            </ErrorLogo>
            <ErrorMsg>
              <Typography component="p" variant="body1">
                Aparentemente ocorreu algum erro, tente clicar no botão abaixo.
              </Typography>
              <Typography component="p" variant="body1">
                Se o problema persitir reporte-nos!
              </Typography>
            </ErrorMsg>
            <Box>
              <Button
                fullWidth
                icon="cached"
                text="Recarregar"
                onClick={redirect}
              />
            </Box>
          </ErrorBox>
          <Box display="flex" justifyContent="center" alignItems="center" p={3}>
            <img src={BrokenRobot} alt="Erro de sistema" />
          </Box>
        </ErrorPaper>
      </Box>
    </ErrorContainer>
  );
}

const mapStateToProps = (state) => ({ error: state.error });
export default connect(mapStateToProps)(Error);
