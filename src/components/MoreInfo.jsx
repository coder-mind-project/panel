import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userType } from '@/types';

import {
  Grid,
  Box,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@material-ui/core';

import { Link } from 'react-router-dom';
import { APP_VERSION, APP_BUILD, APP_DEPENDENCIES } from '@/config/dataProperties';

import Logo from '@/assets/coder-mind-painelv1-preto.png';

import { CustomLink } from './styles';

function MoreInfo(props) {
  const { opened, closeDialog, user } = props;

  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
    closeDialog();
  }

  useEffect(() => {
    setOpen(opened);
  }, [opened, open]);

  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Box width="100%" display="flex" justifyContent="center" alignItems="center">
          <img src={Logo} width="225px" alt="Coder Mind" />
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid item xs={12}>
          <Box mb={2} width="100%" display="flex" alignItems="center">
            <Box>
              <Typography variant="body1" component="p">
                Usuário autenticado:&nbsp;
                <strong>{user.name}</strong>
              </Typography>
              <Typography variant="body1" component="p">
                Perfil do usuário:&nbsp;
                <strong>{user.tagAdmin ? 'Administrador' : 'Autor'}</strong>
              </Typography>
            </Box>
          </Box>
          <Box width="100%" display="flex" alignItems="center">
            <Box>
              <Typography variant="body1" component="p">
                Versão da aplicação:&nbsp;
                <strong>{APP_VERSION}</strong>
              </Typography>
              <Typography variant="body1" component="p">
                Build:&nbsp;
                <strong>{APP_BUILD}</strong>
              </Typography>
              <Typography variant="body1" component="p">
                Dependências:&nbsp;
                <a href={APP_DEPENDENCIES} target="_blank" rel="noopener noreferrer" style={{ textWeigth: 800 }}>Visualizar dependências</a>
              </Typography>
            </Box>
          </Box>
          <Box mt={3} mb={1} width="100%" display="flex" justifyContent="center" alignItems="center">
            <CustomLink to="/ticket">
              <Button
                variant="contained"
                color="primary"
                onClick={close}
              >
                Preciso de ajuda
              </Button>
            </CustomLink>
          </Box>
        </Grid>
        <Box width="100%" display="flex" flexDirection="column" alignItems="center">
          <Typography component="p" variant="body2" align="center">
            &copy; Coder Mind &#38; Colaboradores | Licenciado sobre a licença BSD 3
          </Typography>
          <Link
            to="https://opensource.org/licenses/BSD-3-Clause"
          >
            <Typography component="p" variant="body2" align="center">
              https://opensource.org/licenses/BSD-3-Clause
            </Typography>
          </Link>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary" autoFocus>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

MoreInfo.propTypes = {
  opened: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
  user: userType.isRequired,
};

MoreInfo.defaultProps = {
  opened: false,
};

export default MoreInfo;
