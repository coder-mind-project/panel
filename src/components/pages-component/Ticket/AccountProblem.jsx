import React , { Component } from 'react'
import { Grid, Box, Icon, Divider, Button, TextField, Grow } from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import CustomButton from '../../Button.jsx'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { callToast } from '../../../redux/toastActions'
import { error } from "../../../config/toasts"

import axios from 'axios'
import {backendUrl, defineErrorMsg} from '../../../config/backend'

import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

import '../../../pages/css/defaultPage.css'
import '../../../pages/css/forms.css'

class AccountProblem extends Component {
    state = {
        ticket: {
            code: '',
            date: null,
            emailUser: '',
            msg: '',
            type: 'simple-account-problem'
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
        const data = this.state.ticket

        data.emailUser = this.props.user.email
        const url = `${backendUrl}/tickets`

        await axios.post(url, data).then( response => {
            this.setState({success: true})
        }).catch( async err =>{
            const msg = await defineErrorMsg(err)
            this.props.callToast(error(msg))
        })

        this.toogleIsSending()
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
                                <Icon>security</Icon>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <h4>Alteraram os dados da minha conta</h4>
                            </Box>
                        </Box>
                        <Box width="100%">
                            <span className="textColor">Este tipo de ticket deve ser enviado caso tenha recebido um e-mail informando que algum administrador alterou os dados de sua conta sem seu consentimento.</span>
                        </Box>
                        <Box width="100%" marginTop="20px">
                            <Divider/>
                        </Box>
                    </Box>

                    {!this.state.success &&
                        <Box padding="25px">
                            <Box display="flex" flexWrap="wrap" alignItems="flex-start">
                                <Grid item xs={12} md={5} className="formInput">
                                    <TextField
                                        fullWidth={true}
                                        label="Código *"
                                        value={this.state.ticket.code}
                                        onChange={this.handleChange('code')}
                                    />
                                </Grid>
                                <Grid item xs={12} md={5} className="formInput">
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <KeyboardDateTimePicker label="Data de alteração *"
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
                            </Box>
                            <TextField
                                className="formInput"
                                fullWidth={true}
                                multiline={true}
                                rows="10"
                                label="Descreva seu problema *"
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

const mapStateToProps = state => ({user: state.user, toast: state.config})
const mapDispatchToProps = dispatch => bindActionCreators({callToast: callToast }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AccountProblem)
