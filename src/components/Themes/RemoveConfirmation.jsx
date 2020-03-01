import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Container,
  DialogActions,
  Button,
  DialogContentText,
} from '@material-ui/core';

import axios from 'axios';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { error, success } from '../../config/toasts';
import { callToast as ToastEmitter } from '../../redux/toastActions';

import { defineErrorMsg, backendUrl } from '../../config/backend';

function RemoveConfirmation(props) {
  const {
    open,
    onClose,
    propTheme,
    themesQuantity,
    page,
    callToast,
  } = { ...props };

  const [loading, setLoading] = useState(false);

  function close(newPage) {
    onClose(newPage);
  }

  async function remove() {
    setLoading(true);
    const id = propTheme._id;
    const url = `${backendUrl}/themes/${id}`;
    let newPage = null;
    await axios
      .delete(url)
      .then(() => {
        callToast(success('Operação realizada com sucesso'));
        if (themesQuantity === 1) newPage = page - 1 === 0 ? 1 : page - 1;
      })
      .catch((err) => {
        const msg = defineErrorMsg(err);
        callToast(error(msg));
      });

    setLoading(false);
    close(newPage);
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      onEscapeKeyDown={close}
      onBackdropClick={close}
      aria-labelledby="title"
      aria-describedby="are_you_sure"
    >
      <DialogTitle id="title">
        {loading ? 'Removendo' : 'Excluir usuário'}
      </DialogTitle>
      <DialogContent>
        <Container>
          {!loading
            && (
              <DialogContentText id="are_you_sure">Tem certeza que deseja remover este tema?</DialogContentText>
            )}
          {loading
            && (
              <DialogContentText id="description">Removendo tema, por favor aguarde...</DialogContentText>
            )}
        </Container>
      </DialogContent>
      <DialogActions>
        {!loading && (
          <Button color="primary" onClick={close}>
            Fechar
          </Button>
        )}
        {!loading && (
        <Button color="primary" onClick={remove}>
          Sim, pode excluir
        </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

const mapStateToProps = (state) => ({ user: state.user, toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: ToastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RemoveConfirmation);
