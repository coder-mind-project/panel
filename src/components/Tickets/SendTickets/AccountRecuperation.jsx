import React, { useState, useEffect } from 'react';

import {
  Container,
  Box,
  Divider,
  Typography,
} from '@material-ui/core';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import { error } from '../../../config/toasts';
import { callToast as toastEmitter } from '../../../redux/toastActions';


import { backendUrl, defineErrorMsg } from '../../../config/backend';

import { CODER_MIND_URL } from '../../../config/dataProperties';

import CustomButton from '../../Button';

import { CustomTextField, CustomBox, IconBox } from './styles';


function AccountRecuperation(props) {
  const { params, callToast } = { ...props };

  const [accountChanged, setAccountChanged] = useState({
    firstCode: '',
    secondCode: '',
    emailUser: '',
    date: '',
    msg: '',
    type: 'account-changed',
  });

  const [sendingTicket, setSendingTicket] = useState(false);
  const [success, setSuccess] = useState(true);
  const [timeToCloseWindow, setTimeToCloseWindow] = useState(10);

  function handleAccountChanged(evt, attr) {
    const { value } = evt.target;
    setAccountChanged({
      ...accountChanged,
      [attr]: value,
    });
  }

  async function sendTicket() {
    setSendingTicket(true);

    const url = `${backendUrl}/tickets/unauthenticated`;
    await axios.post(url, accountChanged).then(() => {
      setSuccess(true);

      let time = 10;
      setInterval(() => {
        if (time === 0) {
          window.open(CODER_MIND_URL, '_self');
        } else {
          setTimeToCloseWindow(--time);
        }
      }, 1000);
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });

    setSendingTicket(false);
  }

  useEffect(() => {
    if (!params) window.open(CODER_MIND_URL, '_self');

    function loadAccountChanged() {
      setAccountChanged({
        ...accountChanged,
        firstCode: params.aid,
        secondCode: params.uid,
        emailUser: params.mail,
        date: params.date ? params.date.replace('%20', ' ') : null,
      });
    }

    if (!accountChanged.firstCode) loadAccountChanged();
  }, [accountChanged, params]);

  return (
    <Container>
      { !success && (
        <Box display="flex" flexDirection="column" pl={4} pr={4} pt={4}>
          <Box mb={2}>
            <Typography component="h4" variant="h5">Recuperação de conta Coder Mind</Typography>
          </Box>
          <Divider />
          <Box mt={2}>
            <Typography component="p" variant="body2">
              Descreva seu problema o melhor possível, o campo &quot;E-mail de contato&quot;
              deverá ser um e-mail que você possa acessar, caso o mesmo esteja
              preenchido com um endereço que você não possui acesso
              apague-o e insira um e-mail que você tenha acesso.
            </Typography>
          </Box>
        </Box>
      )}
      { !success && (
        <Box p={3} pt={4} display="flex" alignItems="center" flexWrap="wrap">
          <CustomTextField
            label="Primeiro Código"
            value={accountChanged.firstCode}
            disabled
          />
          <CustomTextField
            label="Segundo Código"
            value={accountChanged.secondCode}
            disabled
          />
          <CustomTextField
            label="Data da ocorrência"
            value={accountChanged.date}
            disabled
          />
          <CustomTextField
            label="E-mail de contato"
            value={accountChanged.emailUser}
            onChange={(evt) => handleAccountChanged(evt, 'emailUser')}
            fullWidth
          />
          <CustomTextField
            label="Descreva aqui o seu problema"
            multiline
            fullWidth
            value={accountChanged.msg}
            rows="10"
            onChange={(evt) => handleAccountChanged(evt, 'msg')}
          />
          <Box width="100%">
            <Typography component="p" variant="body2">
              Seu ticket será respondido através do e-mail de contato fornecido,
              é importante descrever o máximo possível de informações.
              Você receberá uma mensagem automática que recebemos o seu ticket
              após o envio, assim entraremos em contato o mais breve possível
              com a análise já realizada ou solicitando mais informações.
            </Typography>
          </Box>
          <Box width="100%" mt={4} mb={4}>
            <CustomButton
              color="default"
              loading={sendingTicket}
              disabled={sendingTicket}
              fullWidth
              disabledIcon
              text={sendingTicket ? 'Enviando ticket...' : 'Enviar ticket'}
              onClick={sendTicket}
            />
          </Box>
        </Box>
      )}
      { success
        && (
        <CustomBox>
          <IconBox>
            <FontAwesomeIcon icon={faCheckCircle} size="5x" color="#28a745" />
          </IconBox>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Typography component="h4" variant="h6" align="center">
              Ticket enviado com sucesso!
              Agora basta aguardar, responderemos rapidinho ;)
            </Typography>
            <Typography component="p" variant="body2" align="center">
              Redirecionando em
              {' '}
              {timeToCloseWindow}
              {' '}
              ...
            </Typography>
          </Box>
        </CustomBox>
        )
      }
    </Container>
  );
}
const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AccountRecuperation);
