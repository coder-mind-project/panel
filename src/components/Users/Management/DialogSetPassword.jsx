/**
 * @description This component is similar to "DialogConfirmAdminPassword",
 * but it changes the password of any account without confirmation
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userType } from '@/types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success, error } from '@/config/toasts';

import axios from 'axios';
import { backendUrl, defineErrorMsg } from '@/config/backend';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  LinearProgress,
} from '@material-ui/core';

import PasswordField from '@/components/PasswordField.jsx';

function DialogSetPassword(props) {
  const {
    open,
    closeDialog,
    user,
    callToast,
  } = props;

  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  async function changePassword(evt) {
    if (saving) return;
    if (evt) evt.preventDefault();

    setSaving(true);
    const url = `${backendUrl}/users/configs/${user._id}`;

    await axios.post(url, { password }).then(() => {
      callToast(success('Senha alterada com sucesso!'));
      setPassword('');
      closeDialog();
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(error(msg));
    });

    setSaving(false);
  }

  useEffect(() => {
    if (!user || (user && !user.tagAdmin)) closeDialog();
  }, [user, closeDialog]);

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      disableBackdropClick={saving}
      disableEscapeKeyDown={saving}
    >
      { saving && <LinearProgress color="primary" />}
      <DialogTitle>
        Alterar senha
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="change_password">
          Informe a nova senha
        </DialogContentText>
        <form onSubmit={changePassword}>
          <PasswordField
            label="Senha"
            inputId="new-password"
            inputAutoComplete="new-password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={closeDialog}
          disabled={saving}
        >
          Fechar
        </Button>
        <Button
          color="primary"
          onClick={changePassword}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogSetPassword.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
  user: userType.isRequired,
  callToast: PropTypes.func.isRequired,
};

DialogSetPassword.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DialogSetPassword);
