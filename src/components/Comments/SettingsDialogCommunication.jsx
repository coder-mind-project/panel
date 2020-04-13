import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  FormHelperText,
  Switch,
} from '@material-ui/core';

import SettingsDialogContentHeader from './SettingsDialogContentHeader';

import { CustomInputLabel } from './styles';

function SettingsDialogCommunication(props) {
  const {
    emitSettings,
    save,
  } = props;

  const [notify, setNotify] = useState(false);
  const [emitted, setEmitted] = useState(false);
  const [load, setLoad] = useState(false);

  function handleChange(evt) {
    const { checked } = evt.target;

    setNotify(checked);
  }

  useEffect(() => {
    if (emitSettings && !emitted) {
      const settings = {
        notify,
      };

      save(settings);
      setEmitted(true);
    }

    if (!emitSettings) {
      setEmitted(false);
    }
  }, [save, emitSettings, emitted, notify]);

  useEffect(() => {
    function getStoredSettings() {
      const currentSettings = JSON.parse(localStorage.getItem('cm-comments-settings'));
      if (currentSettings) {
        setNotify(Boolean(currentSettings.notify));
      }
    }

    if (!load) {
      setLoad(true);
      getStoredSettings();
    }
  }, [notify, load]);

  return (
    <Box>
      <SettingsDialogContentHeader icon="question_answer" title="Comunicação" />
      <Box
        mb={2}
      >
        <Box
          display="flex"
          alignItems="center"
        >
          <CustomInputLabel htmlFor="comments-notify">
            Notificar o leitor
          </CustomInputLabel>
          <Switch
            checked={notify}
            onChange={handleChange}
            color="primary"
            inputProps={{ id: 'comments-notify' }}
          />
        </Box>
        <FormHelperText>
          Caso esteja marcado, o leitor que realizou o comentário será
          notificado quando uma resposta for criada
        </FormHelperText>
      </Box>
    </Box>
  );
}

SettingsDialogCommunication.propTypes = {
  save: PropTypes.func.isRequired,
  emitSettings: PropTypes.bool.isRequired,
};

export default SettingsDialogCommunication;
