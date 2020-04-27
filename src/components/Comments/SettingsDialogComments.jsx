import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { commentSettingsType } from '@/types';

import {
  Box,
  Select,
  FormHelperText,
} from '@material-ui/core';

import SettingsDialogContentHeader from './SettingsDialogContentHeader';

import { CustomInputLabel, SettingsContainer } from './styles';

function SettingsDialogSearch(props) {
  const {
    open, // Flag to display this container, see `SettingsContainer` for more details
    settings, // Current settings provided by the parent component
    emitSettings, // Issues the updated property for the parent component
  } = props;

  /**
   * @description Data states
   */
  const [limit, setLimit] = useState(6);
  const [order, setOrder] = useState('desc');
  const [type, setType] = useState('all');

  /**
   * @description Controller states
   */
  const [load, setLoad] = useState(false);

  function handleChange(evt, option) {
    let { value } = evt.target;

    switch (option) {
      case 'limit': {
        value = Number(value);
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

    const propertyChanged = { [option]: value };
    emitSettings(propertyChanged);
  }

  // Called when the component is mount
  useEffect(() => {
    function getStoredSettings() {
      setLimit(settings.limit);
      setOrder(settings.order);
      setType(settings.type);
    }

    if (!load) {
      setLoad(true);
      getStoredSettings();
    }
  }, [order, type, limit, load, settings]);

  return (
    <SettingsContainer open={open}>
      <SettingsDialogContentHeader icon="comments" title="Comentários" />
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
          Define o limite inicial de comentários a serem apresentados
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
            <option value="desc">Mais recente</option>
            <option value="asc">Mais antigo</option>
          </Select>
        </Box>
        <FormHelperText>
          Define a ordenação de comentários
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
            <option value="enabled">Habilitados</option>
            <option value="disabled">Desabilitados</option>
          </Select>
        </Box>
        <FormHelperText>
          Define o tipo de comentário que será carregado como padrão
          (Ainda será possível visualizar os outros tipos de comentários).
        </FormHelperText>
      </Box>
    </SettingsContainer>
  );
}

SettingsDialogSearch.propTypes = {
  open: PropTypes.bool,
  settings: commentSettingsType,
  emitSettings: PropTypes.func.isRequired,
};

SettingsDialogSearch.defaultProps = {
  settings: PropTypes.shape({
    type: 'all',
    order: 'desc',
    limit: 6,
  }),
  open: false,
};

export default SettingsDialogSearch;
