import React from 'react';

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
  const { closeDialog } = { ...props };

  return (
    <Dialog
      open
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        O que é ticket?
      </DialogTitle>
      <DialogContent>
        <Grid item xs={12}>
          <Box width="100%" display="flex" alignItems="center" flexDirection="column">
            <Typography component="p" variant="body1">Ticket é a via de comunicação entre administradores e autores sobre quaisquer assuntos técnicos da plataforma.</Typography>
            <Typography component="p" variant="body1">Todo problema relacionado a plataforma, sugestão de melhorias, reporte de bugs devem ser comunicados aqui.</Typography>
            <Typography component="p" variant="body1">Informe o tipo de ticket e em seguida envie sua mensagem, você será respondido em breve!</Typography>
          </Box>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary" autoFocus>
          Entendi
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default WhatIsTicketDialog;
