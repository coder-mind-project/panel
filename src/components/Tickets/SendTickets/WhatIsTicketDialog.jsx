import React from 'react';
import PropsTypes from 'prop-types';
import { appTheme } from '@/types';

import { connect } from 'react-redux';

import {
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@material-ui/core';

function WhatIsTicketDialog(props) {
  const { closeDialog, theme } = props;

  return (
    <Dialog
      open
      onClose={closeDialog}
    >
      <DialogTitle>
        O que é ticket?
      </DialogTitle>
      <DialogContent>
        <Grid item xs={12}>
          <Box width="100%" display="flex" alignItems="center" flexDirection="column">
            <Typography component="p" variant="body1">Ticket é a via de comunicação entre administradores e autores sobre quaisquer assuntos técnicos da plataforma.</Typography>
            <Typography component="p" variant="body1">
              Todo problema relacionado a
              {' '}
              <i>&copy; Coder Mind</i>
              , sugestão de melhorias, reporte de bugs devem ser comunicados aqui.
            </Typography>
            <Typography component="p" variant="body1">Informe o tipo de ticket e em seguida envie sua mensagem, você será respondido em breve!</Typography>
          </Box>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          color="primary"
          variant={theme === 'dark' ? 'contained' : 'text'}
          size="small"
          autoFocus
        >
          Entendi
        </Button>
      </DialogActions>
    </Dialog>
  );
}

WhatIsTicketDialog.propTypes = {
  closeDialog: PropsTypes.func.isRequired,
  theme: appTheme.isRequired,
};

const mapStateToProps = (state) => ({ theme: state.theme });

export default connect(mapStateToProps)(WhatIsTicketDialog);
