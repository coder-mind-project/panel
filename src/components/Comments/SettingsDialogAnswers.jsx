import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { commentSettingsType } from '@/types';

import { usePrevious } from '@/hooks';

import {
  Box,
  FormHelperText,
  Switch,
  Select,
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
  const [order, setOrder] = useState('desc');
  const [type, setType] = useState('');


  const prevOpen = usePrevious(open);

  function handleChange(evt, reason) {
    const { checked, value } = evt.target;

    const propertyChanged = {};

    switch (reason) {
      case 'notify': {
        setNotify(checked);
        propertyChanged.notify = checked;
        break;
      }
      case 'order': {
        setOrder(value);
        propertyChanged.answersOrder = value;
        break;
      }
      default: {
        propertyChanged.answersType = value;
        setType(value);
      }
    }


    emitSettings(propertyChanged);
  }

  // Called when the component is mount
  useEffect(() => {
    function getStoredSettings() {
      setNotify(Boolean(settings.notify));
      setOrder(settings.answersOrder);
      setType(settings.answersType);
    }

    if (!prevOpen && open) {
      getStoredSettings();
    }
  }, [notify, order, type, open, prevOpen, settings]);

  return (
    <SettingsContainer open={open}>
      <SettingsDialogContentHeader icon="question_answer" title="Respostas" />
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
            onChange={(evt) => handleChange(evt, 'notify')}
            color="primary"
            inputProps={{ id: 'comments-notify' }}
          />
        </Box>
        <FormHelperText>
          Se estiver marcado, será enviado uma notificação ao leitor quando responder um comentário
        </FormHelperText>
      </Box>
      <Box
        mb={2}
      >
        <Box
          display="flex"
          alignItems="center"
        >
          <CustomInputLabel htmlFor="answers-order">
            Ordenação padrão
          </CustomInputLabel>
          <Select
            native
            value={order}
            onChange={(evt) => handleChange(evt, 'order')}
            inputProps={{
              id: 'answers-order',
            }}
          >
            <option value="desc">Mais recente</option>
            <option value="asc">Mais antigo</option>
          </Select>
        </Box>
        <FormHelperText>
          Define a ordenação de respostas
        </FormHelperText>
      </Box>
      <Box
        mb={2}
      >
        <Box
          display="flex"
          alignItems="center"
        >
          <CustomInputLabel htmlFor="answers-type">
            Tipo de resposta padrão
          </CustomInputLabel>
          <Select
            native
            value={type}
            onChange={(evt) => handleChange(evt, 'type')}
            inputProps={{
              id: 'answers-type',
            }}
          >
            <option value="all">Todas</option>
            <option value="enabled">Somente habilitadas</option>
            <option value="disabled">Somente desabilitadas</option>
          </Select>
        </Box>
        <FormHelperText>
          Define o tipo de resposta que será carregado por
          padrão (Ainda será possível visualizar os outros tipos de respostas)
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
