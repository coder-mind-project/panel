import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { userType } from '@/types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success, error as toastError } from '@/config/toasts';

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

function ConfirmRemoveUser(props) {
  const {
    open,
    closeDialog,
    callToast,
    user,
  } = props;

  const [removing, setRemoving] = useState(false);

  async function remove() {
    const { _id } = user;
    const url = `${backendUrl}/users/${_id}`;
    setRemoving(true);
    await axios.delete(url).then(() => {
      callToast(success('Usuário removido com sucesso'));
      closeDialog({ removed: true });
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      callToast(toastError(msg));
    });

    setRemoving(false);
  }

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      disableBackdropClick={removing}
      disableEscapeKeyDown={removing}
      maxWidth="md"
    >
      { removing && <LinearProgress color="primary" />}
      <DialogTitle>
        Remover usuário
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Tem certeza que deseja remover o usuário
          {' '}
          {` ${user.name} (${user.email}) ?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={closeDialog}
          disabled={removing}
        >
          Fechar
        </Button>
        <Button
          color="primary"
          disabled={removing}
          onClick={remove}
        >
          Remover
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmRemoveUser.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
  user: userType.isRequired,
};

ConfirmRemoveUser.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmRemoveUser);
