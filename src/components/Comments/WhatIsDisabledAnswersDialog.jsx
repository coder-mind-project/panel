import React from 'react';
import PropTypes from 'prop-types';
import { appTheme } from '@/types';

import {
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@material-ui/core';

import { connect } from 'react-redux';

function WhatIsDisabledAnswersDialog(props) {
  const {
    theme,
    open,
    closeDialog,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
    >
      <DialogTitle>
        O que são comentários desabilitados?
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Typography variant="body2" component="p">
          Algumas respostas podem ser inapropriadas ou até mesmo infringir as
          diretrizes da Coder Mind.
          Para isso é possivel desabilitar respostas, não ficando visiveis para outros leitores.
          Por segurança, não é possível excluir permanentemente as respostas.
          Caso ocorra a necessidade de remover as respostas basta desabilitá-las.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          variant={theme === 'dark' ? 'contained' : 'text'}
          color="primary"
          autoFocus
          size="small"
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

WhatIsDisabledAnswersDialog.propTypes = {
  theme: appTheme.isRequired,
  open: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
};

WhatIsDisabledAnswersDialog.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ theme: state.theme });

export default connect(mapStateToProps)(WhatIsDisabledAnswersDialog);
