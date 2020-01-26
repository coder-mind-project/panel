import React , {Component} from 'react'

import { Grow, Box, Grid, Paper, TextField, FormControl,
        InputLabel, Select, MenuItem, IconButton, Icon,
        Tooltip } from '@material-ui/core'

import CustomButton from '../../Button.jsx'

import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

import './css/Filter.css'

class Filter extends Component {

    _INITIAL_FILTER_STATE = {
        ticket: '',
        type: 'n/d',
        begin: null,
        end: null,
        order: 'desc'
    }

    state = {
        filter: this._INITIAL_FILTER_STATE
    }

    handleChangeFilter = attr => evt => {
        const value = evt.target.value
        
        this.setState({
            filter: {
                ...this.state.filter,
                [attr]: value
            }
        })
    }

    handleDate = (date, attr) => {
        this.setState({
            filter: {...this.state.filter, [attr]: date}
        })
    }

    clearFilters(){
        this.setState({
            filter: this._INITIAL_FILTER_STATE
        })
    }

    emit(){
        if(!this.props.isLoading) this.props.emitSearchByFilters(this.state.filter)
    }

    render(){
        return (
            <Grid item xs={12}>
                { this.props.showFilter && 
                    <Grow in={this.props.showFilter}>
                        <Paper>
                            <Box p={2} pb={0} pt={1} display='flex' justifyContent="space-between" alignItems='center'>
                                <Box display="flex" alignItems='center'>
                                    <Box mr={1} display="flex" alignItems="center">
                                        <Icon>filter_list</Icon>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        Filtros de consulta
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems='center'>
                                    <Tooltip title={(<span style={{fontSize: '0.8rem'}}>Limpar filtros</span>)}>
                                        <IconButton onClick={() => this.clearFilters()}>
                                            <Icon>delete</Icon>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="flex-end" justifyContent="space-between" mb={3} p={2} flexWrap="wrap">
                                <Grid item xs={12} md={10} className="filter-section">
                                    <TextField 
                                        label="Ticket"
                                        value={this.state.filter.ticket}
                                        className="form-control"
                                        onChange={this.handleChangeFilter('ticket') }
                                    />
                                    <FormControl className="min-width-250 form-control">
                                        <InputLabel>Tipo</InputLabel>
                                            <Select
                                                value={this.state.filter.type || 'n/d'}
                                                onChange={this.handleChangeFilter('type')}
                                            >
                                            <MenuItem value={'n/d'}>Todos</MenuItem>
                                            <MenuItem value={'simples-account-problem'}>Conta alterada - Perfil 1</MenuItem>
                                            <MenuItem value={'account-changed'}>Conta alterada - Perfil 2</MenuItem>
                                            <MenuItem value={'bug-report'}>Reporte de Bug</MenuItem>
                                            <MenuItem value={'improvement-suggestion'}>Sugestão de melhoria</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl className="form-control">
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <KeyboardDateTimePicker label="De"
                                                ampm={false}
                                                clearable cancelLabel="Cancelar"
                                                clearLabel="Limpar"
                                                className="formInput"
                                                value={this.state.filter.begin}
                                                onChange={(date) => this.handleDate(date, 'begin')}
                                                mask="__/__/____ __:__:__"
                                                maxDate={new Date()}
                                                maxDateMessage="Data acima do permitido"
                                                minDateMessage="Data abaixo do permitido"
                                                format="DD/MM/YYYY HH:mm:ss"
                                                invalidDateMessage="Formato de data inválido" 
                                                fullWidth={true}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </FormControl>
                                    <FormControl className="form-control">
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <KeyboardDateTimePicker label="Até"
                                                ampm={false}
                                                clearable cancelLabel="Cancelar"
                                                clearLabel="Limpar"
                                                className="formInput"
                                                value={this.state.filter.end}
                                                onChange={(date) => this.handleDate(date, 'end')}
                                                mask="__/__/____ __:__:__"
                                                maxDate={new Date()}
                                                maxDateMessage="Data acima do permitido"
                                                minDateMessage="Data abaixo do permitido"
                                                format="DD/MM/YYYY HH:mm:ss"
                                                invalidDateMessage="Formato de data inválido" 
                                                fullWidth={true}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </FormControl>
                                    <FormControl className="form-control">
                                        <InputLabel>Ordem</InputLabel>
                                            <Select
                                                value={this.state.filter.order}
                                                onChange={this.handleChangeFilter('order')}
                                            >
                                            <MenuItem value={'desc'}>Ticket mais recente</MenuItem>
                                            <MenuItem value={'asc'}>Ticket mais antigo</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={2} className="filter-section right-side-fs">
                                    <CustomButton 
                                        icon="find_in_page"
                                        text="Buscar"
                                        onClick={() => this.emit()}
                                    />
                                </Grid>
                            </Box>
                        </Paper>
                    </Grow>
                }
            </Grid>
        )
    }
}

export default Filter