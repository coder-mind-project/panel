import React , { Component } from 'react'
import { Grid, Box, Icon, Divider, Button, TextField,
        FormControl, InputLabel, Select, MenuItem,
        Grow } from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import CustomButton from '../../Button.jsx'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { callToast } from "../../../redux/toastActions"
import { error } from "../../../config/toasts"

import axios from 'axios'
import {backendUrl, defineErrorMsg} from '../../../config/backend'

import '../../../pages/css/defaultPage.css'
import '../../../pages/css/forms.css'
import { COLOR_APP } from '../../../config/dataProperties.js'

class ImprovementSuggestion extends Component {
    state = {
        ticket: {
            date: null,
            emailUser: '',
            msg: '',
            type: 'improvement-suggestion',
            software: '',
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

        await axios.post(url, data).then( () => {
            this.setState({success: true})
        }).catch( async err =>{
            const msg = await defineErrorMsg(err)
            this.props.callToast(error(msg))
        })

        this.toogleIsSending()
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
                                <h4>Sugestão de melhorias</h4>
                            </Box>
                        </Box>
                        <Box width="100%">
                            <span className="textColor">Este tipo de ticket deve ser enviado caso tenha encontrado alguma funcionalidade que pode ser melhorada de alguma forma. </span>
                            <span className="textColor">Caso a melhoria envolva a correção de algum erro por favor envie um ticket de <strong style={{color: COLOR_APP, textDecoration: 'underline', fontWeight: 400, cursor: 'pointer'}} onClick={() => this.props.changeType('bug-report')}>Reporte de bugs / erros</strong>.</span>
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
                                        <InputLabel>Qual software? *</InputLabel>
                                            <Select
                                                value={this.state.ticket.software}
                                                onChange={this.handleChange('software')}
                                            >
                                            <MenuItem value={'site'}>Site Coder Mind - codermind.com.br</MenuItem>
                                            <MenuItem value={'panel'}>Painel Coder Mind - painel.codermind.com.br</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Box>
                            <TextField
                                className="formInput"
                                fullWidth={true}
                                multiline={true}
                                rows="10"
                                label="O que gostaria que melhorasse? *"
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

export default connect(mapStateToProps, mapDispatchToProps)(ImprovementSuggestion)
