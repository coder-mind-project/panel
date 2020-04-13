import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Scrollbars } from 'react-custom-scrollbars';

import {
  DialogContent,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Icon,
  Divider,
  Button,
  Tooltip,
} from '@material-ui/core';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success } from '@/config/toasts';

import SettingsDialogSearch from './SettingsDialogSearch';
import SettingsDialogCommunication from './SettingsDialogCommunication';
import SettingsDialogAppearance from './SettingsDialogAppearance';

import {
  SettingsContent,
  DialogSettingsTitle,
  CustomDialog,
  SettingsTitleContent,
  SettingsMenu,
  CustomDialogActions,
} from './styles';

function CommentSettingsDialog(props) {
  const {
    open,
    closeDialog,
    callToast,
  } = props;

  const [option, setOption] = useState('search');
  const [saving, setSaving] = useState(false);

  function changeOption(opt) {
    setOption(opt);
  }

  function close(event) {
    closeDialog(event);
  }

  function saveSettings() {
    setSaving(true);
  }

  function storeSettings(settings) {
    const currentConfig = JSON.parse(localStorage.getItem('cm-comments-settings'));
    const updatedSettings = currentConfig ? { ...currentConfig, ...settings } : settings;

    localStorage.setItem('cm-comments-settings', JSON.stringify(updatedSettings));
    callToast(success('Configurações salvas com sucesso'));

    setSaving(false);
  }

  return (
    <CustomDialog
      open={open}
      onClose={close}
      disableBackdropClick={saving}
      disableEscapeKeyDown={saving}
      maxWidth="lg"
    >
      <DialogSettingsTitle id="title" disableTypography>
        <SettingsTitleContent>
          <Box display="flex" alignItems="center">
            <Box mr={1}>
              <Icon color="action" fontSize="small">
                build
              </Icon>
            </Box>
            <Typography
              component="span"
              variant="body1"
            >
              Configurações
            </Typography>
          </Box>
          <IconButton onClick={close} size="small">
            <Icon>
              clear
            </Icon>
          </IconButton>
        </SettingsTitleContent>
        <Divider />
      </DialogSettingsTitle>
      <DialogContent>
        <Box width="100%" height="100%" display="flex">
          <SettingsMenu item sm={6} md={4}>
            <MenuItem onClick={() => changeOption('search')}>Pesquisa</MenuItem>
            <MenuItem onClick={() => changeOption('communication')}>Comunicação</MenuItem>
            <MenuItem onClick={() => changeOption('appearance')} disabled>Personalização</MenuItem>
          </SettingsMenu>
          <Scrollbars autoHide>
            <SettingsContent item sm={6} md={8}>
              { option === 'search' && <SettingsDialogSearch save={storeSettings} emitSettings={saving} /> }
              { option === 'communication' && <SettingsDialogCommunication save={storeSettings} emitSettings={saving} /> }
              { option === 'appearance' && <SettingsDialogAppearance save={storeSettings} /> }
            </SettingsContent>
          </Scrollbars>
        </Box>
      </DialogContent>
      <CustomDialogActions>
        <Tooltip
          title={(
            <Typography component="span" variant="caption">
              As configurações salvas terão efeito somente
              no próximo acesso a página de comentários
            </Typography>
          )}
          placement="right-start"
        >
          <IconButton size="small">
            <Icon>
              info
            </Icon>
          </IconButton>
        </Tooltip>
        <Button
          onClick={saveSettings}
          color="primary"
          variant="contained"
          size="small"
        >
          Salvar
        </Button>
      </CustomDialogActions>
    </CustomDialog>
  );
}

CommentSettingsDialog.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
};

CommentSettingsDialog.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => ({ toast: state.config });
const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CommentSettingsDialog);
