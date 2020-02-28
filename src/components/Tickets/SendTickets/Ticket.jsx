import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Divider,
  CardContent,
  Button,
  Grid,
  Icon,
  Typography,
} from '@material-ui/core';

import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

import { scrollToTop } from '../../../config/ScrollToTop';

import Header from '../../Header';


import WhatIsTicketDialog from './WhatIsTicketDialog';
import AccountProblem from './AccountProblem';
import BugReport from './BugReport';
import ImprovementSuggestion from './ImprovementSuggestion';
import AccountRecuperation from './AccountRecuperation';

import { CustomCard, CustomCardActions } from './styles';

// import './css/Ticket.css';

function Ticket(props) {
  const {
    location,
    user,
  } = { ...props };

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
      /** Close all dialogs */
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
      <Paper>
        { authenticated && type === 'menu'
          && (
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" pl={2} pr={2} pt={3}>
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
                  <Button color="secondary" size="small" variant="text" onClick={() => toogleDialogs('what-is-ticket')}>
                    <Typography component="span" variant="button">O que é ticket?</Typography>
                  </Button>
                </Box>
              </Box>
              <Box p={3}>
                <Divider />
                <Box width="100%" display="flex" alignItems="center">
                  <Box display="flex" alignItems="center" mr={1}>
                    <Icon>label</Icon>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <h4>Selecione o tipo de ticket que deseja enviar</h4>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center" flexWrap="wrap">
                  <CustomCard variant="outlined">
                    <CardContent>
                      <h4>Alteraram os dados da minha conta!</h4>
                      <span className="text-explication">
                        Problemas relacionados a configurações da sua conta
                        na Coder Mind por terceiros.
                      </span>
                    </CardContent>
                    <CustomCardActions className="card-actions">
                      <Button size="small" color="secondary" variant="outlined" onClick={() => defineTicketType('account-problem')}>Abrir Ticket</Button>
                    </CustomCardActions>
                  </CustomCard>
                  <CustomCard variant="outlined">
                    <CardContent>
                      <h4>Reporte de bugs</h4>
                      <span className="text-explication">
                        Encontrou algum bug no painel ou em nosso website? reporte!
                      </span>
                    </CardContent>
                    <CustomCardActions className="card-actions">
                      <Button size="small" color="secondary" variant="outlined" onClick={() => defineTicketType('bug-report')}>Abrir Ticket</Button>
                    </CustomCardActions>
                  </CustomCard>
                  <CustomCard variant="outlined">
                    <CardContent>
                      <h4>Sugestão de melhorias</h4>
                      <span className="text-explication">
                        Encontrou algo que pode ficar melhor? por favor nos conte =D
                      </span>
                    </CardContent>
                    <CustomCardActions className="card-actions">
                      <Button size="small" color="secondary" variant="outlined" onClick={() => defineTicketType('improvement-suggestion')}>Abrir Ticket</Button>
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
      </Paper>
    </Container>
  );
}

const mapStateToProps = (state) => ({ user: state.user, menu: state.menu });

export default connect(mapStateToProps)(Ticket);
