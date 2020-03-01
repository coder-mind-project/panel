import React, { useState } from 'react';

import {
  Grow,
  Box,
  Grid,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Icon,
  Tooltip,
  LinearProgress,
  Typography,
} from '@material-ui/core';


import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';

import MomentUtils from '@date-io/moment';
import CustomButton from '../../Button';

import {
  CustomGrid,
  CustomGridForButton,
  CustomTextField,
  CustomFormControl,
} from './styles';

function Filter(props) {
  const {
    isLoading,
    emitSearchByFilters,
    showFilter,
    closeFilter,
  } = { ...props };

  const [filter, setFilter] = useState({
    ticket: '',
    type: 'n/d',
    begin: null,
    end: null,
    order: 'desc',
  });

  function handleChangeFilter(evt, attr) {
    const { value } = evt.target;
    setFilter({
      ...filter,
      [attr]: value,
    });
  }

  function handleDate(date, attr) {
    setFilter({ ...filter, [attr]: date });
  }

  function clearFilter() {
    setFilter({
      ticket: '',
      type: 'n/d',
      begin: null,
      end: null,
      order: 'desc',
    });
  }

  function emit() {
    if (!isLoading) emitSearchByFilters(filter);
  }

  return (
    <Grid item xs={12}>
      { showFilter
          && (
            <Grow in={showFilter}>
              <Paper>
                { isLoading && <LinearProgress color="primary" />}
                <Box p={3} pb={0} pt={1} display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <Box mr={1} display="flex" alignItems="center">
                      <Icon>filter_list</Icon>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Typography component="p" variant="body2">
                        Preencha os campos que deseja filtrar sobre os tickets, ao deixar os
                        campos em branco todos as ocorrências serão retornadas.
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box mr={2}>
                      <Tooltip title={(<span style={{ fontSize: '0.8rem' }}>Limpar filtros</span>)}>
                        <IconButton onClick={clearFilter}>
                          <Icon>delete</Icon>
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box ml={2}>
                      <Tooltip title={(<span style={{ fontSize: '0.8rem' }}>Ocultar filtros</span>)}>
                        <IconButton onClick={closeFilter}>
                          <Icon>clear</Icon>
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="flex-end" justifyContent="space-between" mb={3} p={4} flexWrap="wrap">
                  <CustomGrid item xs={12} md={10}>
                    <CustomTextField
                      label="Ticket"
                      value={filter.ticket}
                      onChange={(evt) => handleChangeFilter(evt, 'ticket')}
                    />
                    <CustomFormControl>
                      <InputLabel>Tipo</InputLabel>
                      <Select
                        value={filter.type || 'n/d'}
                        onChange={(evt) => handleChangeFilter(evt, 'type')}
                      >
                        <MenuItem value="n/d">Todos</MenuItem>
                        <MenuItem value="simples-account-problem">Conta alterada - Perfil 1</MenuItem>
                        <MenuItem value="account-changed">Conta alterada - Perfil 2</MenuItem>
                        <MenuItem value="bug-report">Reporte de Bug</MenuItem>
                        <MenuItem value="improvement-suggestion">Sugestão de melhoria</MenuItem>
                      </Select>
                    </CustomFormControl>
                    <CustomFormControl>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDateTimePicker
                          label="De"
                          ampm={false}
                          clearable
                          cancelLabel="Cancelar"
                          clearLabel="Limpar"
                          value={filter.begin}
                          onChange={(date) => handleDate(date, 'begin')}
                          mask="__/__/____ __:__:__"
                          maxDate={new Date()}
                          maxDateMessage="Data acima do permitido"
                          minDateMessage="Data abaixo do permitido"
                          format="DD/MM/YYYY HH:mm:ss"
                          invalidDateMessage="Formato de data inválido"
                          fullWidth
                        />
                      </MuiPickersUtilsProvider>
                    </CustomFormControl>
                    <CustomFormControl>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDateTimePicker
                          label="Até"
                          ampm={false}
                          clearable
                          cancelLabel="Cancelar"
                          clearLabel="Limpar"
                          value={filter.end}
                          onChange={(date) => handleDate(date, 'end')}
                          mask="__/__/____ __:__:__"
                          maxDate={new Date()}
                          maxDateMessage="Data acima do permitido"
                          minDateMessage="Data abaixo do permitido"
                          format="DD/MM/YYYY HH:mm:ss"
                          invalidDateMessage="Formato de data inválido"
                          fullWidth
                        />
                      </MuiPickersUtilsProvider>
                    </CustomFormControl>
                    <CustomFormControl>
                      <InputLabel>Ordem</InputLabel>
                      <Select
                        value={filter.order}
                        onChange={(evt) => handleChangeFilter(evt, 'order')}
                      >
                        <MenuItem value="desc">Ticket mais recente</MenuItem>
                        <MenuItem value="asc">Ticket mais antigo</MenuItem>
                      </Select>
                    </CustomFormControl>
                  </CustomGrid>
                  <CustomGridForButton item xs={12} md={2}>
                    <CustomButton
                      icon="find_in_page"
                      text="Buscar"
                      onClick={emit}
                    />
                  </CustomGridForButton>
                </Box>
              </Paper>
            </Grow>
          )
      }
    </Grid>
  );
}

export default Filter;
