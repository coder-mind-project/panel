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
  Grow,
  Typography,
} from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import axios from 'axios';
import { defineErrorMsg } from '../../../config/backend';

import { callToast as toastEmitter } from '../../../redux/toast/toastActions';
import { error as toastError } from '../../../config/toasts';

import CustomButton from '../../Buttons/Button';

import { CustomTextField, CustomKeyboardDateTimePicker } from './styles';

function AccountProblem(props) {
  const {
    user,
    callToast,
    goBack,
    theme,
  } = props;

  const [ticket, setTicket] = useState({
    code: '',
    date: null,
    emailUser: '',
    msg: '',
    type: 'simple-account-problem',
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

  async function sendTicket() {
    setIsSending(true);
    const data = ticket;

    data.emailUser = user.email;
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
          <Button variant={theme === 'dark' ? 'contained' : 'text'} size="small" color="primary" onClick={goOut}>Voltar</Button>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" margin="25px">
          <Box width="100%" display="flex" alignItems="center">
            <Box display="flex" alignItems="center" mr={1}>
              <Icon color="action">security</Icon>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography component="h4" variant="h6">Alteraram os dados da minha conta</Typography>
            </Box>
          </Box>
          <Box width="100%">
            <Typography component="span" variant="body2">
              Este tipo de ticket deve ser enviado caso tenha recebido um e-mail
              informando que algum administrador alterou os dados de sua conta
              sem seu consentimento.
            </Typography>
          </Box>
          <Box width="100%" marginTop="20px">
            <Divider />
          </Box>
        </Box>
        {!success
            && (
              <Box padding="25px" paddingTop={0}>
                <Box display="flex" flexWrap="wrap" alignItems="flex-start">
                  <CustomTextField
                    fullWidth
                    label="Código *"
                    value={ticket.code}
                    onChange={(evt) => handleChangeTicket(evt, 'code')}
                  />
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <CustomKeyboardDateTimePicker
                      label="Data de alteração *"
                      ampm={false}
                      clearable
                      cancelLabel="Cancelar"
                      clearLabel="Limpar"
                      className="formInput"
                      value={ticket.date}
                      onChange={handleDateTicket}
                      mask="__/__/____ __:__:__"
                      maxDate={new Date()}
                      maxDateMessage="Data acima do permitido"
                      minDateMessage="Data abaixo do permitido"
                      format="DD/MM/YYYY HH:mm:ss"
                      invalidDateMessage="Formato de data inválido"
                      fullWidth
                    />
                  </MuiPickersUtilsProvider>
                </Box>
                <Box margin="10px">
                  <TextField
                    className="formInput"
                    fullWidth
                    multiline
                    rows="10"
                    label="Descreva seu problema *"
                    value={ticket.msg}
                    onChange={(evt) => handleChangeTicket(evt, 'msg')}
                  />
                </Box>
                <Box padding={0.5}>
                  <Typography variant="body2" component="p">* Informações obrigatórias</Typography>
                </Box>
                <Box width="100%" marginTop={4}>
                  <CustomButton onClick={() => sendTicket()} fullWidth color="primary" variant="contained" disabledIcon disabled={isSending} loading={isSending} text={isSending ? 'Enviando ticket...' : 'Enviar'} />
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

AccountProblem.propTypes = {
  user: userType.isRequired,
  goBack: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
  theme: appTheme.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user, toast: state.config, theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AccountProblem);
