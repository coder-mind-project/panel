import React, { useState, useEffect } from 'react';
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
  LinearProgress,
} from '@material-ui/core';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { success, error as toastError } from '@/config/toasts';

import axios from 'axios';
import { backendUrl, defineErrorMsg } from '@/config/backend';

import SettingsDialogComments from './SettingsDialogComments';
import SettingsDialogAnswers from './SettingsDialogAnswers';
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

  /**
   * @description Data states
   */
  const [settings, setSettings] = useState({});
  const [option, setOption] = useState('comments');

  /**
   * @description Controller states
   */
  const [saving, setSaving] = useState(false);
  const [load, setLoad] = useState(false);

  function changeOption(opt) {
    setOption(opt);
  }

  function close(event) {
    changeOption('comments');
    closeDialog(event);
  }

  function handleSettings(changedSetting) {
    setSettings({ ...settings, ...changedSetting });
  }

  async function saveSettings() {
    setSaving(true);

    const currentSettings = JSON.parse(localStorage.getItem('cm-comments-settings'));
    const updatedSettings = currentSettings ? { ...currentSettings, ...settings } : { ...settings };

    const url = `${backendUrl}/comments/settings`;

    await axios.post(url, updatedSettings).then((response) => {
      const latestSettings = response.data;

      localStorage.setItem('cm-comments-settings', JSON.stringify(latestSettings));
      callToast(success('Configurações salvas com sucesso'));
    }).catch((error) => {
      const msg = defineErrorMsg(error);
      callToast(toastError(msg));
    });


    setSaving(false);
  }

  // Called for get current settings
  useEffect(() => {
    function getSettings() {
      const currentSettings = JSON.parse(localStorage.getItem('cm-comments-settings'));
      const url = `${backendUrl}/comments/settings`;

      // Time to leave to implement using data stored locally
      const options = currentSettings ? {
        headers: {
          'CM-TTL-Comments': currentSettings.ttl,
        },
      } : null;

      axios(url, options).then((response) => {
        const actualSettings = response.data;

        if (!currentSettings) {
          actualSettings.ttl = Date.now() + (1000 * 60 * 60 * 24 * 30);
          localStorage.setItem('cm-comments-settings', JSON.stringify(actualSettings));
        }

        setSettings(actualSettings);
      }).catch(() => {
        // Calls when the response is 304 or some error

        // Store local settings
        if (currentSettings) {
          setSettings(currentSettings);
        }
      });
    }

    if (!load) {
      setLoad(true);
      getSettings();
    }
  }, [settings, load]);

  return (
    <CustomDialog
      open={open}
      onClose={close}
      disableBackdropClick={saving}
      disableEscapeKeyDown={saving}
      maxWidth="lg"
    >
      { saving && <LinearProgress color="primary" /> }
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
            <MenuItem
              selected={option === 'comments'}
              onClick={() => changeOption('comments')}
            >
              Comentários
            </MenuItem>
            <MenuItem
              selected={option === 'answers'}
              onClick={() => changeOption('answers')}
            >
              Respostas
            </MenuItem>
            <MenuItem
              selected={option === 'appearance'}
              onClick={() => changeOption('appearance')}
              disabled
            >
              Personalização
            </MenuItem>
          </SettingsMenu>
          <Scrollbars autoHide>
            <SettingsContent item sm={6} md={8}>
              <SettingsDialogComments
                open={option === 'comments'}
                settings={settings}
                emitSettings={handleSettings}
              />
              <SettingsDialogAnswers
                open={option === 'answers'}
                settings={settings}
                emitSettings={handleSettings}
              />
              <SettingsDialogAppearance
                open={option === 'appearance'}
                settings={settings}
                emitSettings={handleSettings}
              />
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
