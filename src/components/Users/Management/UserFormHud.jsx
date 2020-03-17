import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { userType } from '@/types';

import {
  IconButton,
  Icon,
  Menu,
  MenuItem,
  Typography,
  Box,
  useMediaQuery,
} from '@material-ui/core';

import { devices } from '@/config/devices';
import CustomButton from '@/components/Buttons/Button.jsx';
import { FormHudButtons } from './styles';

function UserFormHud(props) {
  const {
    save,
    changePass,
    remove,
    toogleSendEmail,
    sendEmail,
    isSaving,
    user,
  } = props;

  const [anchorMenu, setAnchorMenu] = useState(null);
  const matches = useMediaQuery(devices.tablet);

  function showMenu(evt) {
    setAnchorMenu(evt.currentTarget);
  }

  function hideMenu() {
    setAnchorMenu(null);
  }

  function removeAndHideMenu() {
    remove();
    hideMenu();
  }

  function changePassAndHideMenu() {
    changePass();
    hideMenu();
  }

  return (
    <FormHudButtons>
      { matches && (
        <Box
          display="flex"
          justifyContent="flex-end"
          width="100%"
        >
          <IconButton
            onClick={showMenu}
            size="small"
          >
            <Icon>more_vert</Icon>
          </IconButton>
        </Box>
      )}
      <CustomButton
        color="primary"
        size="small"
        iconSize="small"
        icon="save"
        onClick={save}
        disabled={isSaving}
      />
      { user._id
        && (
          <CustomButton
            color="secondary"
            size="small"
            iconSize="small"
            icon="delete"
            onClick={remove}
            disabled={isSaving}
          />
        )
      }
      { user._id
        && (
          <CustomButton
            color="inherit"
            size="small"
            iconSize="small"
            icon="lock"
            onClick={changePass}
            disabled={isSaving}
          />
        )
      }

      { !matches && (
        <IconButton
          onClick={showMenu}
          size="small"
        >
          <Icon>more_vert</Icon>
        </IconButton>
      )}
      <Menu
        anchorEl={anchorMenu}
        keepMounted
        open={Boolean(anchorMenu)}
        onClose={hideMenu}
      >
        <MenuItem onClick={toogleSendEmail}>
          <Box display="flex" flexDirection="column" flexWrap="wrap">
            <Typography component="span" variant="body1">
              Notificar mudanças:
              {' '}
              {sendEmail ? 'ativado' : 'desativado'}
            </Typography>
            <Typography
              component="span"
              variant="caption"
              style={{
                maxWidth: '225px',
                whiteSpace: 'normal',
              }}
              align="center"
            >
              Ao realizar alterações no cadastro do usuário,
              o mesmo receberá notificação de mudança caso
              esteja habilitado a opção.
            </Typography>
          </Box>
        </MenuItem>
        { user._id && <MenuItem onClick={changePassAndHideMenu}>Alterar senha</MenuItem>}
        { user._id && <MenuItem onClick={removeAndHideMenu}>Remover conta</MenuItem>}
      </Menu>
    </FormHudButtons>
  );
}

UserFormHud.propTypes = {
  save: PropTypes.func.isRequired,
  changePass: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  toogleSendEmail: PropTypes.func.isRequired,
  sendEmail: PropTypes.bool,
  isSaving: PropTypes.bool,
  user: userType.isRequired,
};

UserFormHud.defaultProps = {
  sendEmail: false,
  isSaving: false,
};

export default UserFormHud;
