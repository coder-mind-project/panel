import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { userType, appTheme } from '@/types';

import {
  Grid,
  Box,
  Icon,
  Divider,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Grow,
  Typography,
} from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { error as toastError } from '@/config/toasts';

import { defineErrorMsg } from '@/config/backend';

import CustomButton from '@/components/Buttons/Button.jsx';

import {
  CustomFormControl,
  CustomKeyboardDateTimePicker,
  CustomTextField,
} from './styles';

function BugReport(props) {
  const {
    callToast,
    user,
    goBack,
    theme,
  } = props;

  const [ticket, setTicket] = useState({
    date: null,
    emailUser: '',
    msg: '',
    type: 'bug-report',
    software: '',
    device: '',
    browser: '',
    anotherBrowser: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChangeTicket(evt, attr) {
    const { value } = evt.target;

    setTicket({
      ...ticket,
      [attr]: value,
    });
  }

  function handleDateTicket(date) {
    setTicket({
      ...ticket,
      date,
    });
  }

  function goOut() {
    if (!isSending) goBack();
  }

  function formatData() {
    const data = ticket;

    if (data.device !== 'celphone - webapp' && data.device !== 'computer') {
      delete data.browser;
      delete data.anotherBrowser;
    }

    if (data.browser && data.browser !== 'other') delete data.anotherBrowser;

    data.emailUser = user.email;

    return data;
  }

  async function sendTicket() {
    setIsSending(true);
    const data = formatData();
    const url = '/tickets';

    await axios.post(url, data).then(() => {
      setSuccess(true);
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(toastError(msg));
    });

    setIsSending(false);
  }

  return (
    <Grow in>
      <Grid item xs={12}>
        <Box width="100%" marginLeft="25px" marginRight="25px" marginTop="15px">
          <Button
            color="primary"
            variant={theme === 'dark' ? 'contained' : 'text'}
            onClick={goOut}
            size="small"
          >
            Voltar
          </Button>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" margin="25px">
          <Box width="100%" display="flex" alignItems="center">
            <Box display="flex" alignItems="center" mr={1}>
              <Icon color="action">bug_report</Icon>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography component="h4" variant="h6">Reporte de bugs / erros</Typography>
            </Box>
          </Box>
          <Box width="100%">
            <Typography component="span" variant="body2">Este tipo de ticket deve ser enviado caso tenha encontrado algum comportamento da plataforma que julgue ser um bug/erro. </Typography>
          </Box>
          <Box width="100%" marginTop="20px">
            <Divider />
          </Box>
        </Box>
        {!success
            && (
            <Box padding="25px" paddingTop={0}>
              <Box display="flex" flexWrap="wrap" alignItems="flex-start">
                <CustomFormControl>
                  <InputLabel>Onde ocorreu o bug? *</InputLabel>
                  <Select
                    value={ticket.software}
                    onChange={(evt) => handleChangeTicket(evt, 'software')}
                  >
                    <MenuItem value="site">Site Coder Mind - codermind.com.br</MenuItem>
                    <MenuItem value="panel">Painel Coder Mind - painel.codermind.com.br</MenuItem>
                  </Select>
                </CustomFormControl>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <CustomKeyboardDateTimePicker
                    label="Data da ocorrência (opcional)"
                    ampm={false}
                    clearable
                    cancelLabel="Cancelar"
                    clearLabel="Limpar"
                    value={ticket.date}
                    onChange={handleDateTicket}
                    mask="__/__/____ __:__:__"
                    maxDate={new Date()}
                    maxDateMessage="Data acima do permitido"
                    minDateMessage="Data abaixo do permitido"
                    format="DD/MM/YYYY HH:mm:ss"
                    invalidDateMessage="Formato de data inválido"
                  />
                </MuiPickersUtilsProvider>
                <CustomFormControl>
                  <InputLabel>Qual dispositivo você estava utilizando? *</InputLabel>
                  <Select
                    value={ticket.device}
                    onChange={(evt) => handleChangeTicket(evt, 'device')}
                  >
                    <MenuItem value="celphone - webapp">Celular - Pelo site</MenuItem>
                    <MenuItem value="computer">Computador</MenuItem>
                  </Select>
                </CustomFormControl>
                { Boolean(ticket.device === 'celphone - webapp' || ticket.device === 'computer')
                        && (
                          <CustomFormControl>
                            <InputLabel>
                              Qual o navegador utilizado? *
                            </InputLabel>
                            <Select
                              value={ticket.browser}
                              onChange={(evt) => handleChangeTicket(evt, 'browser')}
                            >
                              <MenuItem value="google-chrome">Google Chrome</MenuItem>
                              <MenuItem value="mozilla-firefox">Mozilla Firefox</MenuItem>
                              <MenuItem value="microsoft-edge">Microsoft Edge</MenuItem>
                              <MenuItem value="vivaldi">Vivaldi</MenuItem>
                              <MenuItem value="opera">Opera</MenuItem>
                              <MenuItem value="other">Outro</MenuItem>
                            </Select>
                          </CustomFormControl>
                        )
                    }
                { ticket.browser === 'other'
                        && (
                        <Grid item xs={12} md={5}>
                          <CustomTextField
                            label="Especifique o browser *"
                            value={ticket.anotherBrowser}
                            onChange={(evt) => handleChangeTicket(evt, 'anotherBrowser')}
                          />
                        </Grid>
                        )
                    }
              </Box>
              <Box margin="10px">
                <TextField

                  fullWidth
                  multiline
                  rows="10"
                  label="Se possível detalhe o acontecimento *"
                  value={ticket.msg}
                  onChange={(evt) => handleChangeTicket(evt, 'msg')}
                />
              </Box>
              <Box padding={0.5}>
                <Typography variant="body2" component="p">* Informações obrigatórias</Typography>
              </Box>
              <Box width="100%" marginTop={4}>
                <CustomButton onClick={sendTicket} fullWidth color="primary" variant="contained" disabled={isSending} icon="save" disabledIcon loading={isSending} text={isSending ? 'Enviando ticket...' : 'Enviar'} />
              </Box>
            </Box>
            )
        }
        { success
            && (
            <Box display="flex" alignItems="center" justifyContent="center" flexWrap="wrap" p={5} m={3}>
              <Box display="flex" alignItems="center" mr={2}>
                <FontAwesomeIcon icon={faCheckCircle} size="5x" color="#28a745" />
              </Box>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Typography component="h4" variant="h6">
                  Ticket enviado com sucesso, agora é só aguardar.
                  Já já retornaremos contato ;)
                </Typography>
              </Box>
            </Box>
            )
        }
      </Grid>
    </Grow>
  );
}

BugReport.propTypes = {
  user: userType.isRequired,
  goBack: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
  theme: appTheme.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user, toast: state.config, theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BugReport);
