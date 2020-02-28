import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Box,
  Paper,
  Divider,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Icon,
  Typography,
} from '@material-ui/core';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { callToast as toastEmitter } from '../../redux/toastActions';
import { error } from '../../config/toasts';
import Header from '../../components/Header';

import { backendUrl, defineErrorMsg } from '../../config/backend';

import { CODER_MIND_URL } from '../../config/dataProperties';


import CustomButton from '../../components/Button';
import WhatIsTicketDialog from '../../components/Dialogs/Tickets/WhatIsTicket';
import AccountProblem from '../../components/pages-component/Ticket/AccountProblem';
import BugReport from '../../components/pages-component/Ticket/BugReport';
import ImprovementSuggestion from '../../components/pages-component/Ticket/ImprovementSuggestion';

import '../css/defaultPage.css';
import './css/Ticket.css';

function Ticket(props) {
  const { location, callToast, user } = { ...props };

  const [authenticated, setAutenticated] = useState(false);
  const [type, setType] = useState('menu');
  const [accountChanged, setAccountChanged] = useState({
    firstCode: '',
    secondCode: '',
    emailUser: '',
    date: '',
    msg: '',
  });
  const [sendingTicket, setSendingTicket] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeToCloseWindow, setTimeToCloseWindow] = useState(10);
  const [whatIsTicketFlag, setWhatIsTicketFlag] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');

  function handleAccountChanged(evt, attr) {
    const { value } = evt.target;
    setAccountChanged({
      ...accountChanged,
      [attr]: value,
    });
  }

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

  async function sendTicket() {
    setSendingTicket(true);

    const data = accountChanged;

    data.type = type;

    const url = `${backendUrl}/tickets/not-authenticated`;
    await axios.post(url, data).then(() => {
      setSuccess(true);
      if (!authenticated) {
        setInterval(() => {
          if (timeToCloseWindow === 0) {
            window.open(CODER_MIND_URL, '_self');
          } else {
            setTimeToCloseWindow(timeToCloseWindow - 1);
          }
        }, 1000);
      }
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });

    setSendingTicket(false);
  }

  function dispatchDialog(dialog = null, close = false) {
    if (!dialog) {
      /** Close all dialogs */
      setWhatIsTicketFlag(false);
    }

    if (dialog === 'what-is-ticket') setWhatIsTicketFlag(!close);
  }

  function defineTicketType(newType = false) {
    setType(newType || 'menu');
  }

  useEffect(() => {
    async function detectTicketType() {
      const searchUrl = location.search;

      setAutenticated(Boolean(user._id));

      if (!searchUrl && !user._id) setRedirectTo('auth');

      const params = formatParamsSearchUrl(searchUrl);

      if (params.aid && !authenticated) {
        setAccountChanged({
          firstCode: params.aid,
          secondCode: params.uid,
          emailUser: params.mail,
          date: params.date ? params.date.replace('%20', ' ') : null,
        });

        setType('account-changed');
      }
    }

    detectTicketType();
  });

  return (
    <Container id="component">
      <Header
        title="Ticket"
        description={authenticated ? 'Reporte um problema, bug ou sugira melhorias' : 'Reporte uma ocorrência, problema ou informações referêntes entre você e a plataforma Coder Mind.'}
        icon="feedback"
        noMarginTop={!authenticated}
      />
      { redirectTo && <Redirect to={`/${redirectTo}`} />}
      { whatIsTicketFlag
        && <WhatIsTicketDialog closeDialog={() => dispatchDialog('what-is-ticket', true)} />
      }
      <Paper className={success ? 'paper-container-success-area' : ''}>
        <Grid item xs={12}>
          { success
              && (
              <Box display="flex" alignItems="center" justifyContent="center" flexWrap="wrap" p={2}>
                <Box display="flex" alignItems="center" mr={2}>
                  <FontAwesomeIcon icon={faCheckCircle} size="5x" color="#28a745" />
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                  <h3 className="success-msg">Ticket enviado com sucesso! Agora basta aguardar, responderemos rapidinho ;)</h3>
                  <span className="text-explication">
                    Redirectionando em
                    {' '}
                    {timeToCloseWindow}
                    {' '}
                    ...
                  </span>
                </Box>
              </Box>
              )
          }
          {!authenticated && type === 'account-changed' && !success
              && (
              <Box display="flex" flexDirection="column" pl={4} pr={4} pt={1}>
                <Box>
                  <h4>Recuperação de conta</h4>
                </Box>
                <Box>
                  <p className="text-explication">
                    Descreva seu problema e caso o campo
                    {' '}
                    <strong>E-mail de contato</strong>
                    {' '}
                    não esteja preenchido inclua-o para solicitar a revisão
                    do seu problema. Prometemos responder rapidinho =D
                  </p>
                </Box>
              </Box>
              )
          }
          { !authenticated && type === 'account-changed' && !success && <Divider />}
          {authenticated && !success
              && (
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
                  <Button color="secondary" size="small" variant="text" onClick={() => dispatchDialog('what-is-ticket')}>
                    <Typography component="span" variant="button">O que é ticket?</Typography>
                  </Button>
                </Box>
              </Box>
              )
          }
          { type === 'account-changed' && !authenticated && !success
              && (
              <Box p={3} pt={0} display="flex" alignItems="center" flexWrap="wrap">
                <TextField
                  className="container-text-field"
                  label="Primeiro Código"
                  value={accountChanged.firstCode}
                  inputProps={{
                    className: 'text-field',
                  }}
                  InputLabelProps={{
                    className: 'text-field',
                  }}
                  disabled
                />
                <TextField
                  className="container-text-field"
                  label="Segundo Código"
                  value={accountChanged.secondCode}
                  inputProps={{
                    className: 'text-field',
                  }}
                  InputLabelProps={{
                    className: 'text-field',
                  }}
                  disabled
                />
                <TextField
                  className="container-text-field"
                  label="E-mail de contato"
                  value={accountChanged.emailUser}
                  onChange={(evt) => handleAccountChanged(evt, 'emailUser')}
                  inputProps={{
                    className: 'text-field',
                  }}
                  InputLabelProps={{
                    className: 'text-field',
                  }}
                />
                <TextField
                  className="container-text-field"
                  label="Data da ocorrência"
                  value={accountChanged.date}
                  disabled
                  inputProps={{
                    className: 'text-field',
                  }}
                  InputLabelProps={{
                    className: 'text-field',
                  }}
                />
                <TextField
                  className="container-text-field"
                  label="Descreva aqui o seu problema"
                  multiline
                  fullWidth
                  value={accountChanged.msg}
                  rows="10"
                  onChange={(evt) => handleAccountChanged(evt, 'msg')}
                  inputProps={{
                    className: 'text-field',
                  }}
                  InputLabelProps={{
                    className: 'text-field',
                  }}
                />
                <Box width="100%">
                  <p className="form-explication">Seu ticket será respondido através do e-mail de contato fornecido, é importante descrever o máximo possível de informações. Você receberá uma mensagem automática que recebemos o seu ticket após o envio, assim entraremos em contato o mais breve possível com a análise já realizada ou solicitando mais informações.</p>
                </Box>
                <Box width="100%" mt={4} mb={4}>
                  <CustomButton
                    color="default"
                    loading={sendingTicket}
                    disabled={sendingTicket}
                    fullWidth
                    icon="save"
                    text={sendingTicket ? 'Enviando ticket...' : 'Enviar ticket'}
                    onClick={() => sendTicket()}
                  />
                </Box>
              </Box>
              )
          }
          { authenticated && type === 'menu'
              && (
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
                  <Card className="card" variant="outlined">
                    <CardContent>
                      <h4>Alteraram os dados da minha conta!</h4>
                      <span className="text-explication">
                        Problemas relacionados a configurações da sua conta
                        na Coder Mind por terceiros.
                      </span>
                    </CardContent>
                    <CardActions className="card-actions">
                      <Button size="small" color="secondary" variant="outlined" onClick={() => defineTicketType('account-problem')}>Abrir Ticket</Button>
                    </CardActions>
                  </Card>
                  <Card className="card" variant="outlined">
                    <CardContent>
                      <h4>Reporte de bugs</h4>
                      <span className="text-explication">
                        Encontrou algum bug no painel ou em nosso website? reporte!
                      </span>
                    </CardContent>
                    <CardActions className="card-actions">
                      <Button size="small" color="secondary" variant="outlined" onClick={() => defineTicketType('bug-report')}>Abrir Ticket</Button>
                    </CardActions>
                  </Card>
                  <Card className="card" variant="outlined">
                    <CardContent>
                      <h4>Sugestão de melhorias</h4>
                      <span className="text-explication">
                        Encontrou algo que pode ficar melhor? por favor nos conte =D
                      </span>
                    </CardContent>
                    <CardActions className="card-actions">
                      <Button size="small" color="secondary" variant="outlined" onClick={() => defineTicketType('improvement-suggestion')}>Abrir Ticket</Button>
                    </CardActions>
                  </Card>
                </Box>
              </Box>
              )
          }
          { authenticated && type === 'account-problem'
              && <AccountProblem goBack={() => defineTicketType('menu')} />
          }
          { authenticated && type === 'bug-report'
              && <BugReport goBack={() => defineTicketType('menu')} />
          }
          { authenticated && type === 'improvement-suggestion'
              && <ImprovementSuggestion goBack={() => defineTicketType('menu')} changeType={(newType) => defineTicketType(newType)} />
          }
        </Grid>
      </Paper>
    </Container>
  );
}

const mapStateToProps = (state) => ({ user: state.user, menu: state.menu });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Ticket);
