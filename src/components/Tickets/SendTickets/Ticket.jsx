import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userType, reactRouterParams } from '@/types';

import {
  Container,
  Box,
  Divider,
  CardContent,
  CardHeader,
  Button,
  Grid,
  Icon,
  Typography,
  useMediaQuery,
} from '@material-ui/core';

import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

import Header from '@/components/Header.jsx';
import { devices } from '@/config/devices';
import { scrollToTop } from '@/config/ScrollToTop';


import WhatIsTicketDialog from './WhatIsTicketDialog';
import AccountProblem from './AccountProblem';
import BugReport from './BugReport';
import ImprovementSuggestion from './ImprovementSuggestion';
import AccountRecuperation from './AccountRecuperation';


import { CustomCard, CustomCardActions, CustomPaper } from './styles';

function Ticket(props) {
  const {
    location,
    user,
    theme,
  } = props;

  const matches = useMediaQuery(devices.mobileMedium);

  const [authenticated, setAutenticated] = useState(false);
  const [type, setType] = useState('menu');
  const [whatIsTicketFlag, setWhatIsTicketFlag] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');
  const [params, setParams] = useState(null);

  function formatParamsSearchUrl(search) {
    let s = search.replace('?', '');

    s = s.split('&');

    const parameters = {};

    for (let i = 0; i < s.length; i++) {
      const keyValue = s[i].split('=');
      const key = keyValue[0];
      const value = keyValue[1] || null;

      parameters[key] = value;
    }

    return parameters;
  }

  function toogleDialogs(dialog = null, close = false) {
    if (!dialog) {
      setWhatIsTicketFlag(false);
    }

    if (dialog === 'what-is-ticket') setWhatIsTicketFlag(!close);
  }

  function defineTicketType(newType = 'menu') {
    scrollToTop();
    setType(newType);
  }

  useEffect(() => {
    async function detectTicketType() {
      const searchUrl = location.search;

      setAutenticated(Boolean(user._id));

      if (!searchUrl && !user._id) setRedirectTo('auth');

      const parameters = formatParamsSearchUrl(searchUrl);
      setParams(parameters);

      if (parameters.aid && !authenticated) setType('account-changed');
    }

    if (type === 'menu' && !authenticated && !params) detectTicketType();
  }, [type, params, user, location, authenticated]);

  return (
    <Container id="component">
      { authenticated
        && (
          <Header
            title="Ticket"
            description="Reporte um problema, bug ou sugira melhorias"
            icon="feedback"
          />
        )
      }
      { redirectTo && <Redirect to={`/${redirectTo}`} />}
      { whatIsTicketFlag
        && <WhatIsTicketDialog closeDialog={() => toogleDialogs('what-is-ticket', true)} />
      }
      <CustomPaper>
        { authenticated && type === 'menu'
          && (
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
                <Box display="flex" alignItems="center" justifyContent="center" flexWrap="wrap">
                  <Box display="flex" flexDirection="column">
                    <Typography component="span" variant="body1">
                      Olá
                      {' '}
                      {user.name}
                      , aqui você pode gerar tickets para os
                      administradores do sistema.
                    </Typography>
                    <Typography component="span" variant="body1">
                      Informe o tipo de problema e descreva o ocorrido,
                      respostas serão enviadas ao seu e-mail de cadastro
                      na plataforma.
                    </Typography>
                  </Box>
                </Box>
                <Box mt={2}>
                  <Button
                    color="primary"
                    size="small"
                    variant={theme === 'dark' ? 'contained' : 'text'}
                    onClick={() => toogleDialogs('what-is-ticket')}
                  >
                    O que é ticket?
                  </Button>
                </Box>
              </Box>
              <Box p={3}>
                <Divider />
                <Box width="100%" display="flex" alignItems="center" mt={2} mb={2}>
                  <Typography component="h4" variant="h6">Selecione o tipo de ticket que deseja enviar</Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center" flexWrap="wrap">
                  <CustomCard>
                    <CardHeader
                      avatar={!matches ? (<Icon fontSize="large" color="action">lock_open</Icon>) : null}
                      title="Alteraram os dados da minha conta!"
                      titleTypographyProps={{ component: 'h4', variant: 'h6' }}
                    />
                    <CardContent>
                      <Typography component="span" variant="body2">
                        Problemas relacionados a configurações da sua conta
                        na Coder Mind por terceiros.
                      </Typography>
                    </CardContent>
                    <CustomCardActions>
                      <Button color="primary" size="small" variant="contained" onClick={() => defineTicketType('account-problem')}>Abrir Ticket</Button>
                    </CustomCardActions>
                  </CustomCard>
                  <CustomCard>
                    <CardHeader
                      avatar={!matches ? (<Icon fontSize="large" color="action">bug_report</Icon>) : null}
                      title="Reporte de bugs/erros"
                      titleTypographyProps={{ component: 'h4', variant: 'h6' }}
                    />
                    <CardContent>
                      <Typography component="span" variant="body2">
                        Encontrou algum bug no painel ou em nosso blog?
                        {' '}
                        <br />
                        Reporte-nos!
                      </Typography>
                    </CardContent>
                    <CustomCardActions>
                      <Button color="primary" size="small" variant="contained" onClick={() => defineTicketType('bug-report')}>Abrir Ticket</Button>
                    </CustomCardActions>
                  </CustomCard>
                  <CustomCard>
                    <CardHeader
                      avatar={!matches ? (<Icon fontSize="large" color="action">extension</Icon>) : null}
                      title="Sugestão de melhorias"
                      titleTypographyProps={{ component: 'h4', variant: 'h6' }}
                    />
                    <CardContent>
                      <Typography component="span" variant="body2">
                        Encontrou algo que pode ficar melhor? por favor nos conte =D
                      </Typography>
                    </CardContent>
                    <CustomCardActions>
                      <Button color="primary" size="small" variant="contained" onClick={() => defineTicketType('improvement-suggestion')}>Abrir Ticket</Button>
                    </CustomCardActions>
                  </CustomCard>
                </Box>
              </Box>
            </Grid>
          )
        }
        { authenticated && type === 'account-problem'
            && <AccountProblem goBack={defineTicketType} />
        }
        { authenticated && type === 'bug-report'
            && <BugReport goBack={defineTicketType} />
        }
        { authenticated && type === 'improvement-suggestion'
            && <ImprovementSuggestion goBack={defineTicketType} changeType={defineTicketType} />
        }
        { !authenticated && type === 'account-changed'
          && <AccountRecuperation params={params} />
        }
      </CustomPaper>
    </Container>
  );
}

Ticket.propTypes = {
  user: userType.isRequired,
  location: reactRouterParams.isRequired,
  theme: PropTypes.string.isRequired,
};
const mapStateToProps = (state) => ({ user: state.user, menu: state.menu, theme: state.theme });

export default connect(mapStateToProps)(Ticket);
