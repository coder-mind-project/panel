import React, { useState, useEffect } from 'react';

import { Box } from '@material-ui/core';
import { Redirect, useLocation } from 'react-router-dom';

import ButtonMobileAppBar from './ButtonMobileAppBar';

import { AppBarBottom } from './styles';

function AppBarMobile() {
  const location = useLocation();
  const [redirect, setRedirect] = useState('');

  function setActiveLocation(intended) {
    setRedirect(intended);
  }

  function getActiveLocation(intended) {
    return location.pathname === intended ? 'primary' : 'inherit';
  }

  useEffect(() => {
    if (redirect) setRedirect('');
  }, [redirect]);

  return (
    <AppBarBottom
      position="fixed"
      color="inherit"
    >
      {redirect && <Redirect to={redirect} />}
      <Box display="flex" alignItems="center" justifyContent="center">
        <ButtonMobileAppBar
          onClick={() => setActiveLocation('/')}
          color={getActiveLocation('/')}
          icon="home"
          label="Artigos"
        />
        <ButtonMobileAppBar
          onClick={() => setActiveLocation('/stats')}
          color={getActiveLocation('/stats')}
          icon="assessment"
          label="Estatísticas"
        />
        <ButtonMobileAppBar
          onClick={() => setActiveLocation('/comments')}
          color={getActiveLocation('/comments')}
          icon="question_answer"
          label="Comentários"
        />
        <ButtonMobileAppBar
          onClick={() => setActiveLocation('/my-account')}
          color={getActiveLocation('/my-account')}
          icon="person_outlined"
          label="Conta"
        />
      </Box>
    </AppBarBottom>
  );
}

export default AppBarMobile;
