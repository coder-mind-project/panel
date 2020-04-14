import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { commentSettingsType } from '@/types';

import {
  Box,
  FormHelperText,
  Switch,
} from '@material-ui/core';

import SettingsDialogContentHeader from './SettingsDialogContentHeader';

import { CustomInputLabel, SettingsContainer } from './styles';

function SettingsDialogCommunication(props) {
  const {
    open, // Flag to display this container, see `SettingsContainer` for more details
    settings, // Current settings provided by the parent component
    emitSettings, // Issues the updated property for the parent component
  } = props;

  /**
   * @description Data states
   */
  const [notify, setNotify] = useState(false);

  /**
   * @description Controller states
   */
  const [load, setLoad] = useState(false);

  function handleChange(evt) {
    const { checked } = evt.target;

    setNotify(checked);

    const propertyChanged = { notify: checked };
    emitSettings(propertyChanged);
  }

  // Called when the component is mount
  useEffect(() => {
    function getStoredSettings() {
      setNotify(Boolean(settings.notify));
    }

    if (!load) {
      setLoad(true);
      getStoredSettings();
    }
  }, [notify, load, settings]);

  return (
    <SettingsContainer open={open}>
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
    </SettingsContainer>
  );
}

SettingsDialogCommunication.propTypes = {
  open: PropTypes.bool,
  settings: commentSettingsType,
  emitSettings: PropTypes.func.isRequired,
};

SettingsDialogCommunication.defaultProps = {
  open: false,
  settings: PropTypes.shape({
    notify: false,
  }),
};

export default SettingsDialogCommunication;
