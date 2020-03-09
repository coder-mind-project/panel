import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
  Box,
  Divider,
  Icon,
} from '@material-ui/core';
import axios from 'axios';
import { ipinfo, ipinfoToken } from '../../config/backend';

function IpInfoDialog(props) {
  const {
    ipAddress,
    closeDialog,
    opened,
  } = props;

  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(false);
  const [reader, setReader] = useState(null);

  useEffect(() => {
    async function getGeolocalizationInfo(address) {
      const ip = address;
      const url = `${ipinfo}/${ip}?token=${ipinfoToken}`;

      setSearching(true);

      await axios(url).then((res) => {
        setReader(res.data);
      }).catch((err) => {
        setError(err);
      });

      setSearching(false);
    }

    if (!opened) {
      setReader(null);
      setError(false);
    }
    if (!searching && !reader && opened && !error) getGeolocalizationInfo(ipAddress);
  }, [ipAddress, searching, reader, opened, error]);

  return (
    <Dialog
      open={opened}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Sobre o leitor
      </DialogTitle>
      <DialogContent>
        { searching
          && (
            <Box p={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <CircularProgress color="primary" />
              <Box mt={1} mb={1}>
                <span>Carregando informações, por favor aguarde...</span>
              </Box>
            </Box>
          )}
        { !searching && !error && reader
          && (
            <Box p={1}>
              <DialogContentText>Informações de rede</DialogContentText>
              <TextField label="Endereço IP" fullWidth value={reader.ip || 'Não definido'} disabled margin="dense" />
              <TextField label="Hostname" fullWidth value={reader.hostname || 'Não definido'} disabled margin="dense" />
              <TextField label="Provedor de rede" fullWidth value={reader.org || 'Não definido'} disabled margin="dense" />
              <Box width="100%" mt={2} mb={1}>
                <Divider />
              </Box>
              <DialogContentText>Informações de localização</DialogContentText>
              <TextField label="País" fullWidth value={reader.country || 'Não definido'} disabled margin="dense" />
              <TextField label="Região" fullWidth value={reader.region || 'Não definido'} disabled margin="dense" />
              <TextField label="Cidade" fullWidth value={reader.city || 'Não definido'} disabled margin="dense" />
            </Box>
          )}
        {!searching && error
          && (
            <Box p={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <Icon fontSize="large" color="primary">clear</Icon>
              <Box mt={1} mb={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <span>Ops! Ocorreu um erro ao obter as informações...</span>
                <Box p={1}>
                  {typeof error === 'string' ? error : 'Erro interno da api, consulte o desenvolvedor.'}
                </Box>
              </Box>
            </Box>
          )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary" autoFocus>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

IpInfoDialog.propTypes = {
  ipAddress: PropTypes.string.isRequired,
  closeDialog: PropTypes.func.isRequired,
  opened: PropTypes.bool,
};

IpInfoDialog.defaultProps = {
  opened: false,
};

export default IpInfoDialog;
