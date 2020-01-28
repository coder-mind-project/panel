import React , { Component } from 'react'
import { Grid, Box, Icon, Divider, Button, TextField,
        FormControl, InputLabel, Select, MenuItem,
        Grow } from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import CustomButton from '../../Button.jsx'

import { connect } from 'react-redux'

import { toast } from 'react-toastify'

import axios from 'axios'
import {backendUrl, defineErrorMsg} from '../../../config/backend'

import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

import '../../../pages/css/defaultPage.css'
import '../../../pages/css/forms.css'

class BugReport extends Component {
    state = {
        ticket: {
            date: null,
            emailUser: '',
            msg: '',
            type: 'bug-report',
            software: '',
            device: '',
            browser: '',
            anotherBrowser: ''
        },
        isSending: false,
        success: false,
        error: false
    }

    handleChange = attr => evt => {
        const value = evt.target.value

        this.setState({ ticket : {
            ...this.state.ticket,
            [attr]: value
        }})
    }

    toogleIsSending(){
        this.setState({
            isSending: !this.state.isSending
        })
    }

    async sendTicket(){
        this.toogleIsSending()
        const data = this.formatData()
        const url = `${backendUrl}/tickets`

        await axios.post(url, data).then( () => {
            this.setState({success: true})
        }).catch( error =>{
            const msg = defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 3000, closeOnClick: true})
        })

        this.toogleIsSending()
    }

    formatData(){
        const data = this.state.ticket

        if(data.device !== 'celphone - webapp' && data.device !== 'computer') {
            delete data.browser
            delete data.anotherBrowser
        }
        
        if(data.browser && data.browser !== 'other') delete data.anotherBrowser

        data.emailUser = this.props.user.email

        return data
    }

    handleDate = date => {
        this.setState({
            ticket: {...this.state.ticket, date}
        })
    }

    render(){
        return (
            <Grow in={true}>
                <Grid item xs={12}>
                    <Box width="100%" marginLeft="25px" marginRight="25px" marginTop="15px">
                        <Button variant="outlined" color="secondary" onClick={this.props.goBack}>Voltar</Button>
                    </Box>
                    <Box display="flex" flexDirection="column" justifyContent="center" margin="25px">
                        <Box width="100%" display="flex" alignItems="center">
                            <Box display="flex" alignItems="center">
                                <Icon>bug_report</Icon>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <h4>Reporte de bugs / erros</h4>
                            </Box>
                        </Box>
                        <Box width="100%">
                            <span className="textColor">Este tipo de ticket deve ser enviado caso tenha encontrado algum comportamento da plataforma que julgue ser um bug/erros. </span>
                        </Box>
                        <Box width="100%" marginTop="20px">
                            <Divider/>
                        </Box>
                    </Box>

                    {!this.state.success &&
                        <Box padding="25px">
                            <Box display="flex" flexWrap="wrap" alignItems="flex-start">
                                <Grid item xs={12} md={5} className="formInput">
                                    <FormControl fullWidth={true}>
                                        <InputLabel>Onde ocorreu o bug? *</InputLabel>
                                            <Select
                                                value={this.state.ticket.software}
                                                onChange={this.handleChange('software')}
                                            >
                                            <MenuItem value={'site'}>Site Coder Mind - codermind.com.br</MenuItem>
                                            <MenuItem value={'panel'}>Painel Coder Mind - painel.codermind.com.br</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={5} className="formInput">
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <KeyboardDateTimePicker label="Data da ocorrência (opcional)"
                                            ampm={false}
                                            clearable cancelLabel="Cancelar"
                                            clearLabel="Limpar"
                                            className="formInput"
                                            value={this.state.ticket.date}
                                            onChange={this.handleDate}
                                            mask="__/__/____ __:__:__"
                                            maxDate={new Date()}
                                            maxDateMessage="Data acima do permitido"
                                            minDateMessage="Data abaixo do permitido"
                                            format="DD/MM/YYYY HH:mm:ss"
                                            invalidDateMessage="Formato de data inválido" 
                                            fullWidth={true}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} md={5} className="formInput">
                                    <FormControl fullWidth={true}>
                                        <InputLabel>Qual dispositivo você estava utilizando? *</InputLabel>
                                            <Select
                                                value={this.state.ticket.device}
                                                onChange={this.handleChange('device')}
                                            >
                                            <MenuItem value={'celphone - webapp'}>Celular - Pelo site</MenuItem>
                                            <MenuItem value={'computer'}>Computador</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                { Boolean(this.state.ticket.device === 'celphone - webapp' || this.state.ticket.device === 'computer') &&
                                    <Grid item xs={12} md={5} className="formInput">
                                        <FormControl fullWidth={true}>
                                            <InputLabel>Qual Browser/Navegador de internet você estava utilizando? *</InputLabel>
                                                <Select
                                                    value={this.state.ticket.browser}
                                                    onChange={this.handleChange('browser')}
                                                >
                                                <MenuItem value={'google-chrome'}>Google Chrome</MenuItem>
                                                <MenuItem value={'mozilla-firefox'}>Mozilla Firefox</MenuItem>
                                                <MenuItem value={'microsoft-edge'}>Microsoft Edge</MenuItem>
                                                <MenuItem value={'vivaldi'}>Vivaldi</MenuItem>
                                                <MenuItem value={'opera'}>Opera</MenuItem>
                                                <MenuItem value={'other'}>Outro</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                }
                                { this.state.ticket.browser === 'other' && 
                                    <Grid item xs={12} md={5} className="formInput">
                                        <TextField 
                                            fullWidth={true}
                                            label="Especifique o browser *"
                                            value={this.state.ticket.anotherBrowser}
                                            onChange={this.handleChange('anotherBrowser')}
                                        />
                                    </Grid>
                                }
                            </Box>
                            <TextField 
                                className="formInput"
                                fullWidth={true}
                                multiline={true}
                                rows="10"
                                label="Se possível detalhe o acontecimento *"
                                value={this.state.ticket.msg}
                                onChange={this.handleChange('msg')}
                            />
                            <Box width="100%" marginTop="15px">
                                <CustomButton onClick={() => this.sendTicket()} fullWidth={true} color="success" variant="contained" disabled={this.state.isSending} icon="save" loading={this.state.isSending} text={this.state.isSending ? "Enviando..." : "Enviar"}/>
                            </Box>
                        </Box>
                    }
                    { this.state.success && !Boolean(this.state.error) && 
                        <Box display="flex" alignItems="center" justifyContent="center" flexWrap="wrap" p={5} m={3}>
                            <Box display="flex" alignItems="center" mr={2}>
                                <FontAwesomeIcon icon={faCheckCircle} size="5x" color="#28a745"/>
                            </Box>
                            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                <h3>Ticket enviado com sucesso, agora é só aguardar. Já já retornaremos contato ;).</h3>
                            </Box>
                        </Box>
                    }   
                </Grid>
            </Grow>
        )
    }
}

const mapStateToProps = state => ({user: state.user})
export default connect(mapStateToProps)(BugReport)