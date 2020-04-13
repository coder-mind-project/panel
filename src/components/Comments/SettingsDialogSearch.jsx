import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Select,
  FormHelperText,
} from '@material-ui/core';

import SettingsDialogContentHeader from './SettingsDialogContentHeader';

import { CustomInputLabel } from './styles';

function SettingsDialogSearch(props) {
  const {
    emitSettings,
    save,
  } = props;

  const [limit, setLimit] = useState(6);
  const [order, setOrder] = useState('desc');
  const [type, setType] = useState('all');
  const [emitted, setEmitted] = useState(false);
  const [load, setLoad] = useState(false);

  function handleChange(evt, option) {
    const { value } = evt.target;

    switch (option) {
      case 'limit': {
        setLimit(value);
        break;
      }
      case 'order': {
        setOrder(value);
        break;
      }
      default: {
        setType(value);
      }
    }
  }

  useEffect(() => {
    if (emitSettings && !emitted) {
      const settings = {
        limit,
        order,
        type,
      };

      save(settings);
      setEmitted(true);
    }

    if (!emitSettings) {
      setEmitted(false);
    }
  }, [save, emitSettings, emitted, limit, order, type]);

  useEffect(() => {
    function getStoredSettings() {
      const currentSettings = JSON.parse(localStorage.getItem('cm-comments-settings'));
      if (currentSettings) {
        setLimit(currentSettings.limit);
        setOrder(currentSettings.order);
        setType(currentSettings.type);
      }
    }

    if (!load) {
      setLoad(true);
      getStoredSettings();
    }
  }, [order, type, limit, load]);

  return (
    <Box>
      <SettingsDialogContentHeader icon="search" title="Pesquisa" />
      <Box
        mb={2}
      >
        <Box
          display="flex"
          alignItems="center"
        >
          <CustomInputLabel htmlFor="comments-limit">
            Limite inicial de comentários
          </CustomInputLabel>
          <Select
            native
            value={limit}
            onChange={(evt) => handleChange(evt, 'limit')}
            inputProps={{
              id: 'comments-limit',
            }}
          >
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
            <option value={15}>15</option>
          </Select>
        </Box>
        <FormHelperText>
          Define o limite inicial de comentários a serem apresentados na tela de listagem
        </FormHelperText>
      </Box>
      <Box
        mb={2}
      >
        <Box
          display="flex"
          alignItems="center"
        >
          <CustomInputLabel htmlFor="comments-order">
            Ordenação padrão
          </CustomInputLabel>
          <Select
            native
            value={order}
            onChange={(evt) => handleChange(evt, 'order')}
            inputProps={{
              id: 'comments-order',
            }}
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Decrescente</option>
          </Select>
        </Box>
        <FormHelperText>
          Define a ordenação de comentários,
          esta que será realizada pela data de criação do comentário pelo leitor
        </FormHelperText>
      </Box>
      <Box
        mb={2}
      >
        <Box
          display="flex"
          alignItems="center"
        >
          <CustomInputLabel htmlFor="comments-type">
            Tipos de comentários
          </CustomInputLabel>
          <Select
            native
            value={type}
            onChange={(evt) => handleChange(evt, 'type')}
            inputProps={{
              id: 'comments-type',
            }}
          >
            <option value="all">Todos</option>
            <option value="not-readed">Não lidos</option>
            <option value="only-readed">Somente lidos</option>
          </Select>
        </Box>
        <FormHelperText>
          Define quais tipos de comentários serão carregados como
          padrão ao entrar na tela de listagem
        </FormHelperText>
      </Box>
    </Box>
  );
}

SettingsDialogSearch.propTypes = {
  save: PropTypes.func.isRequired,
  emitSettings: PropTypes.bool.isRequired,
};

export default SettingsDialogSearch;
