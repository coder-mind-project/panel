import React from 'react';

import {
  Grid, Box, Dialog, DialogActions, DialogContent,
  DialogTitle, Button, TextField, Typography, Icon,
} from '@material-ui/core';


function TicketResponses(props) {
  const { opened, closeDialog, ticket } = { ...props };

  return (
    <Dialog
      open={opened}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
    >
      <DialogTitle id="alert-dialog-title">
        Respostas do ticket
        {' '}
        {ticket._id}
      </DialogTitle>
      <DialogContent>
        <Grid item xs={12}>
          { ticket && ticket.content && ticket.content.responses && (
            <Box width="100%" display="flex" alignItems="flex-start" flexDirection="column">
              { ticket.content.responses.map((response) => (
                <Box width="100%" p={1} display="flex" alignItems="flex-start" key={response.index}>
                  <Box mr={2} height="100%" display="flex" alignItems="flex-start">
                    {response.index}
                    .
                  </Box>
                  <Box width="100%" display="flex" flexDirection="column" justifyContent="center">
                    <TextField
                      label="Atendente"
                      value={response.adminId}
                      fullWidth
                    />
                    <TextField
                      label="Mensagem"
                      value={response.msg}
                      fullWidth
                      multiline
                      rows="5"
                    />
                  </Box>
                </Box>
              ))}
              {ticket.content.responses.length === 0
                && (
                  <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <Icon color="error" fontSize="large">
                      clear
                    </Icon>
                    <Typography component="p" variant="body1">Este ticket não possui respostas</Typography>
                  </Box>
                )}
            </Box>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="secondary" autoFocus>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TicketResponses;
