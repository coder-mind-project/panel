import React from 'react';
import PropTypes from 'prop-types';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from '@material-ui/core';

function HelperDialog(props) {
  const {
    open,
    onClose,
  } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        Mais informações
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" component="p">
          Caso nao saiba uma ou mais informações não tem problema!
        </Typography>
        <Typography variant="body1" component="p">
          Preencha o formulário com o máximo de informações possíveis, dependendo,
          estas informações poderão ser analisadas por uma pessoa.
        </Typography>
        <Typography variant="body1" component="p">
          Você receberá um feedback em até 48 horas.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained" size="small">
          Entendi
        </Button>
      </DialogActions>
    </Dialog>
  );
}

HelperDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

HelperDialog.defaultProps = {
  open: false,
};

export default HelperDialog;
