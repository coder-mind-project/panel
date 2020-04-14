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
  FormControl,
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
import CustomButton from '../../Buttons/Button';

import { callToast as toastEmitter } from '../../../redux/toast/toastActions';
import { error as toastError } from '../../../config/toasts';

import { backendUrl, defineErrorMsg } from '../../../config/backend';

function ImprovementSuggestion(props) {
  const {
    user,
    callToast,
    goBack,
    changeType,
    theme,
  } = props;

  const [ticket, setTicket] = useState({
    emailUser: '',
    msg: '',
    type: 'improvement-suggestion',
    software: '',
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

  function goOut() {
    if (!isSending) goBack();
  }

  async function sendTicket() {
    setIsSending(true);
    const data = ticket;

    data.emailUser = user.email;

    const url = `${backendUrl}/tickets`;

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
            variant={theme === 'dark' ? 'contained' : 'text'}
            color="primary"
            onClick={goOut}
            size="small"
          >
            Voltar
          </Button>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" margin="25px">
          <Box width="100%" display="flex" alignItems="center">
            <Box display="flex" alignItems="center">
              <Icon>bug_report</Icon>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography component="h4" variant="h6">Sugestão de melhorias</Typography>
            </Box>
          </Box>
          <Box width="100%">
            <Typography component="p" variant="body2">Este tipo de ticket deve ser enviado caso tenha encontrado alguma funcionalidade que pode ser melhorada de alguma forma. </Typography>
            <Typography component="p" variant="body2">
              Caso a melhoria envolva a correção de algum erro por favor envie um ticket de
              {' '}
              <Button
                color="primary"
                variant="text"
                onClick={() => changeType('bug-report')}
                size="small"
              >
                Bugs / erros
              </Button>
            </Typography>
          </Box>
          <Box width="100%" marginTop="20px">
            <Divider />
          </Box>
        </Box>
        {!success
            && (
            <Box padding="25px">
              <Box display="flex" flexWrap="wrap" alignItems="flex-start">
                <Grid item xs={12} md={5} className="formInput">
                  <FormControl fullWidth>
                    <InputLabel>Qual software? *</InputLabel>
                    <Select
                      value={ticket.software}
                      onChange={(evt) => handleChangeTicket(evt, 'software')}
                    >
                      <MenuItem value="site">Site Coder Mind - codermind.com.br</MenuItem>
                      <MenuItem value="panel">Painel Coder Mind - painel.codermind.com.br</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Box>
              <TextField
                className="formInput"
                fullWidth
                multiline
                rows="10"
                label="O que gostaria que melhorasse? *"
                value={ticket.msg}
                onChange={(evt) => handleChangeTicket(evt, 'msg')}
              />
              <Box width="100%" marginTop="15px">
                <CustomButton onClick={sendTicket} fullWidth color="primary" variant="contained" disabled={isSending} icon="save" loading={isSending} text={isSending ? 'Enviando ticket...' : 'Enviar'} />
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

ImprovementSuggestion.propTypes = {
  user: userType.isRequired,
  goBack: PropTypes.func.isRequired,
  changeType: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
  theme: appTheme.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user, toast: state.config, theme: state.theme });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ImprovementSuggestion);
