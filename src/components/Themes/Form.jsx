import React, { useState, useEffect } from 'react';

import {
  Icon,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  Box,
  Divider,
  Typography,
  Button,
  LinearProgress,
} from '@material-ui/core';

import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { backendUrl, defineErrorMsg } from '../../config/backend';

import '../../pages/css/defaultPage.css';
import '../../pages/css/forms.css';

import { callToast as toastEmitter } from '../../redux/toastActions';
import { success, error as toastError } from '../../config/toasts';

function ThemeForm(props) {
  const {
    callToast, propTheme, open, onClose,
  } = { ...props };

  const [theme, setTheme] = useState({
    name: '',
    alias: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  function handleChange(event, attr) {
    const { value } = { ...event.target };
    setTheme({
      ...theme,
      [attr]: value,
    });
  }

  function close(saved = false) {
    if (loading) return;
    onClose(saved);
  }

  async function save() {
    if (loading) return;

    const method = theme._id ? 'put' : 'post';
    const url = method === 'post' ? `${backendUrl}/themes` : `${backendUrl}/themes/${theme._id}`;
    setLoading(true);

    await axios[method](url, theme).then(() => {
      callToast(success('Operação realizada com sucesso'));
      close(true);
    }).catch((err) => {
      const msg = defineErrorMsg(err);
      setError(err.response.data);
      callToast(toastError(msg));
    });

    setLoading(false);
  }

  useEffect(() => {
    if (open) {
      if (!propTheme) setTheme({ name: '', alias: '', description: '' });
      else setTheme(propTheme);
    }
  }, [open, propTheme]);

  return (
    <Dialog
      open={open}
      onClose={() => close()}
      onEscapeKeyDown={() => close()}
      onBackdropClick={() => close()}
    >
      {loading && <LinearProgress color="primary" /> }
      <Box mb={3} p={2}>
        <Box display="flex" alignItems="center">
          <Icon style={{ marginRight: 3, color: '#444' }}>bookmark</Icon>
          <Typography variant="h5" component="h1">{theme._id ? 'Atualizar tema' : 'Inserir tema'}</Typography>
        </Box>
        <Divider style={{ marginTop: 10 }} />
      </Box>
      <DialogContent>
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <Grid item xs={12} md={6} className="formGroup">
            <TextField
              label="Tema"
              error={Boolean(error.name)}
              helperText={error.name
                ? error.msg : ''}
              fullWidth
              onBlur={() => setError({})}
              value={theme.name}
              onChange={(event) => handleChange(event, 'name')}
            />
          </Grid>
          <Grid item xs={12} md={6} className="formGroup">
            <TextField
              label="Apelido"
              error={Boolean(error.alias)}
              helperText={error.alias
                ? error.msg
                : ''}
              onBlur={() => setError({})}
              value={theme.alias}
              fullWidth
              onChange={(event) => handleChange(event, 'alias')}
            />
          </Grid>
          <Grid item xs={12} className="formGroup">
            <TextField
              label="Descrição"
              error={Boolean(error.description)}
              helperText={error.description
                ? error.msg
                : ''}
              onBlur={() => setError({})}
              fullWidth
              value={theme.description}
              multiline
              rows={3}
              onChange={(event) => handleChange(event, 'description')}
            />
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions style={{ margin: 10 }}>
        <Button variant="contained" onClick={() => close()}>
          Fechar
        </Button>
        <Button variant="contained" color="primary" onClick={save}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}


const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ThemeForm);
