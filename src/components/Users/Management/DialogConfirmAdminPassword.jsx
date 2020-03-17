import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Button,
} from '@material-ui/core';

import PasswordField from '@/components/PasswordField.jsx';

import axios from 'axios';
import { backendUrl, defineErrorMsg } from '@/config/backend';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { error as toastError } from '@/config/toasts';

function ConfirmAdminPassword(props) {
  const {
    open,
    closeDialog,
    callToast,
  } = props;

  const [validating, setValidating] = useState(false);
  const [password, setPassword] = useState('');

  function close(event) {
    closeDialog(event);
    setPassword('');
  }

  async function validatePassword(evt) {
    if (evt) evt.preventDefault();

    setValidating(true);

    const url = `${backendUrl}/auth/logged`;

    const payload = {
      password,
    };

    await axios.patch(url, payload).then(() => {
      close({ authorized: true });
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(toastError(msg));
    });

    setValidating(false);
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      disableBackdropClick={validating}
      disableEscapeKeyDown={validating}
    >
      <DialogTitle id="title">
        Informe sua senha de adminstrador
      </DialogTitle>
      <DialogContent>
        <Container>
          <form onSubmit={validatePassword}>
            <PasswordField
              label="Senha"
              inputProps={{ autoComplete: 'current-password' }}
              fullWidth
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
              autoFocus
            />
          </form>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={close}
          disabled={validating}
        >
          Fechar
        </Button>
        <Button
          color="primary"
          onClick={validatePassword}
          disabled={validating}
        >
          {validating ? 'Validando...' : 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmAdminPassword.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
};

ConfirmAdminPassword.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmAdminPassword);
