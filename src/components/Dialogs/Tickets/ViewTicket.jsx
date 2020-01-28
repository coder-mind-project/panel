import React , { Component } from 'react'
import { Box, Icon, Button, TextField,
        Dialog, DialogTitle, DialogContent, Container,
        DialogActions, Grow, Switch, LinearProgress } from '@material-ui/core' 

import { displayFullDate } from '../../../config/masks'

import { connect } from 'react-redux'

import { toast } from 'react-toastify'

import axios from 'axios'
import {backendUrl, defineErrorMsg} from '../../../config/backend'


import '../../../pages/css/defaultPage.css'
import '../../../pages/css/forms.css'
import './css/ViewTicket.css'

class ViewTicket extends Component {
    state = {
        isSending: false,
        success: false,
        error: false,
        showResponseField: false,
        sendingResponse: false,
        response: '',
        sendEmail: true,
        updated: false,
        ticket: {
            content: {},
            user: {},
            admin: {}
        }
    }

    handleChange = attr => evt => {
        const value = evt.target.value

        this.setState({[attr]: value})
    }

    handleChangeCheckered = attr => evt => {
        const value = evt.target.checked

        this.setState({[attr]: value})
    }

    defineDevice(device){
        switch(device){
            case 'computer':{
                return 'Computador'
            }
            case 'celphone - webapp':{
                return 'Celular - webapp'
            }
            default: {
                return 'N/D'
            }
        }
    }
    
    defineSoftware(software){
        switch(software){
            case 'site':{
                return 'Site Coder Mind - www.codermind.com.br'
            }
            case 'panel':{
                return 'Painel Coder Mind - panel.codermind.com.br'
            }
            default: {
                return 'N/D'
            }
        }
    }

    defineBrowser(browser){
        switch(browser){
            case 'google-chrome':{
                return 'Google Chrome'
            }
            case 'mozilla-firefox':{
                return 'Mozilla Firefox'
            }
            case 'microsoft-edge':{
                return 'Microsoft Edge'
            }
            case 'vivaldi':{
                return 'Vivaldi'
            }
            case 'opera':{
                return 'Opera Browser'
            }
            default: {
                return 'Outro'
            }
        }
    }

    toogleResponse(){
        if(this.state.sendingResponse) return
        this.setState({showResponseField: !this.state.showResponseField})
    }

    toogleSendingResponse(){
        this.setState({sendingResponse : !this.state.sendingResponse})
    }

    close(){
        if(this.state.sendingResponse) return 

        this.props.onClose()
    }

    async sendResponse(){
        if(this.state.sendingResponse) return

        const url = `${backendUrl}/tickets/${this.state.ticket.content._id}`

        const data = {
            response: this.state.response,
            sendEmail: this.state.sendEmail
        }

        this.toogleSendingResponse()
        
        await axios.put(url, data).then( response => {
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon>Resposta enviada com sucesso!</div>), {autoClose: 3000, closeOnClick: true})
        }).catch(error => {
            const msg = defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 3000, closeOnClick: true})
        })
        this.toogleSendingResponse()
    }

    async readTicket(){
        await this.setState({
            ticket: this.props.ticket
        })

        const url = `${backendUrl}/tickets/${this.state.ticket.content._id}`

        axios.patch(url).then( response => {
            const ticket = response.data
            this.props.updateTicket(ticket)
        })
    }

    componentDidMount(){
        this.readTicket()
    }

    render(){
        return (
            <Dialog
                open={true}
                onClose={() => this.props.onClose()}
                maxWidth="lg"
                disableBackdropClick={this.state.sendingResponse}
                disableEscapeKeyDown={this.state.sendingResponse}
            >
                <DialogTitle id="title">
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                        <span>Detalhes do ticket {this.state.ticket.content._id}</span>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            {this.state.ticket.content.responses && this.state.ticket.content.responses.length > 0 && <Button variant="text" color="secondary" onClick={() => this.toogleResponse()}>
                                Ver respostas
                            </Button>}
                            <Button variant="text" color="secondary" onClick={() => this.toogleResponse()}>
                                {this.state.showResponseField ? 'Ocultar' : 'Responder'}
                            </Button>
                        </Box>
                    </Box>
                </DialogTitle>
                { this.state.sendingResponse && <LinearProgress color="secondary" />}
                <DialogContent>
                    <Container>
                        <Box width="100%" display="flex" alignItems="center" flexWrap="wrap">
                            <TextField 
                                label="Ticket"
                                className="formInput"
                                value={this.state.ticket.content._id}
                                InputLabelProps={{
                                    className: "disabled-text-field"
                                }}
                                inputProps={{
                                    className: "disabled-text-field min-width-300"
                                }}
                                disabled={true}
                            />
                            <TextField 
                                label="Tipo de ticket"
                                className="formInput"
                                value={this.props.defineType(this.state.ticket.content.type)}
                                InputLabelProps={{
                                    className: "disabled-text-field"
                                }}
                                inputProps={{
                                    className: "disabled-text-field"
                                }}
                                disabled={true}
                            />
                            <TextField 
                                label="E-mail de solicitação"
                                className="formInput"
                                value={this.state.ticket.content.email}
                                InputLabelProps={{
                                    className: "disabled-text-field"
                                }}
                                inputProps={{
                                    className: "disabled-text-field"
                                }}
                                disabled={true}
                            />
                            { this.state.ticket.content.type !== 'account-changed' && this.state.ticket.content.type !== 'simple-account-problem' && 
                                <TextField 
                                    label="Nome do usuário"
                                    className="formInput"
                                    value={this.state.ticket.user.name}
                                    InputLabelProps={{
                                        className: "disabled-text-field"
                                    }}
                                    inputProps={{
                                        className: "disabled-text-field"
                                    }}
                                    disabled={true}
                                />
                            }
                            { Boolean(this.state.ticket.content.type === 'account-changed' || this.state.ticket.content.type === 'simple-account-problem') && 
                                <TextField 
                                    label="Código do usuário"
                                    className="formInput"
                                    value={this.state.ticket.user._id}
                                    InputLabelProps={{
                                        className: "disabled-text-field"
                                    }}
                                    inputProps={{
                                        className: "disabled-text-field min-width-300"
                                    }}
                                    disabled={true}
                                />
                            }
                            { Boolean(this.state.ticket.content.type === 'account-changed' || this.state.ticket.content.type === 'simple-account-problem') && 
                                <TextField 
                                    label="Código do administrador"
                                    className="formInput"
                                    value={this.state.ticket.admin ? this.state.ticket.admin._id : 'Administrador não localizado'}
                                    InputLabelProps={{
                                        className: "disabled-text-field"
                                    }}
                                    inputProps={{
                                        className: "disabled-text-field min-width-300"
                                    }}
                                    disabled={true}
                                />
                            }
                            {this.state.ticket.content.dateOccurrence && 
                                <TextField 
                                    label="Data de ocorrência"
                                    className="formInput"
                                    value={this.state.ticket.content.dateOccurrence ? displayFullDate(this.state.ticket.content.dateOccurrence) : ''}
                                    InputLabelProps={{
                                        className: "disabled-text-field"
                                    }}
                                    inputProps={{
                                        className: "disabled-text-field"
                                    }}
                                    disabled={true}
                                    helperText={(<span className="helperText">Referênte ao momento do acontecimento</span>)}
                                />
                            }
                            <TextField 
                                label="Data de envio"
                                className="formInput"
                                value={this.state.ticket.content.createdAt ? displayFullDate(this.state.ticket.content.createdAt) : ''}
                                InputLabelProps={{
                                    className: "disabled-text-field"
                                }}
                                inputProps={{
                                    className: "disabled-text-field"
                                }}
                                disabled={true}
                                helperText={(<span className="helperText">Momento que o ticket foi enviado</span>)}
                            />
                        </Box>
                        { this.state.ticket.content.type === 'bug-report' && 
                            <Box width="100%">
                                <Box width="100%">
                                    <TextField 
                                        label="Software"
                                        className="formInput"
                                        value={this.defineSoftware(this.state.ticket.content.software)}
                                        InputLabelProps={{
                                            className: "disabled-text-field"
                                        }}
                                        inputProps={{
                                            className: "disabled-text-field"
                                        }}
                                        disabled={true}
                                        fullWidth={true}
                                    />
                                </Box>
                                <TextField 
                                    label="Dispositivo"
                                    className="formInput"
                                    value={this.defineDevice(this.state.ticket.content.device)}
                                    InputLabelProps={{
                                        className: "disabled-text-field"
                                    }}
                                    inputProps={{
                                        className: "disabled-text-field"
                                    }}
                                    disabled={true}
                                />
                                { Boolean(this.state.ticket.content.device === 'computer' || this.state.ticket.content.device === 'celphone - webapp') && 
                                    <TextField 
                                        label="Navegador"
                                        className="formInput"
                                        value={this.defineBrowser(this.state.ticket.content.browser)}
                                        InputLabelProps={{
                                            className: "disabled-text-field"
                                        }}
                                        inputProps={{
                                            className: "disabled-text-field"
                                        }}
                                        disabled={true}
                                    />
                                }
                                { Boolean(this.state.ticket.content.device === 'computer' || this.state.ticket.content.device === 'celphone - webapp') && this.state.ticket.content.browser === 'other' && 
                                    <TextField 
                                        label="Outro navegador"
                                        className="formInput"
                                        value={this.state.ticket.content.anotherBrowser}
                                        InputLabelProps={{
                                            className: "disabled-text-field"
                                        }}
                                        inputProps={{
                                            className: "disabled-text-field"
                                        }}
                                        fullWidth={true}
                                        disabled={true}
                                    />
                                }
                            </Box>
                        }
                        <Box display='flex' alignItems="flex-start" flexWrap="wrap">
                            <Box className={this.state.showResponseField ? 'description-response-area' : 'description-area'}>
                                <TextField 
                                    label="Descrição"
                                    value={this.state.ticket.content.msg}
                                    InputLabelProps={{
                                        className: "disabled-text-field"
                                    }}
                                    inputProps={{
                                        className: "disabled-text-field"
                                    }}
                                    multiline={true}
                                    rows="8"
                                    disabled={true}
                                    fullWidth={true}
                                />
                            </Box>
                            { this.state.showResponseField && 
                                <Grow in={true}>
                                    <Box className="description-response-area">
                                        <TextField 
                                            label="Escreva a resposta aqui..."
                                            value={this.state.toogleResponse}
                                            onChange={this.handleChange('response')}
                                            multiline={true}
                                            rows="8"
                                            fullWidth={true}
                                        />
                                        <Box display="flex" flexDirection="column" mt={2}>
                                            <span>Enviar e-mail de notificação?</span>
                                            <Switch checked={this.state.sendEmail} onChange={this.handleChangeCheckered('sendEmail')}></Switch>
                                        </Box>
                                    </Box>
                                </Grow>
                            }
                        </Box>
                    </Container>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" 
                        onClick={() => this.close()}
                    >
                        Fechar
                    </Button>
                    { this.state.showResponseField &&
                        <Button color="secondary" 
                            onClick={() => this.sendResponse()}
                        >
                            {this.state.sendingResponse ? 'Enviando...' : 'Enviar resposta'}
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        )
    }
}

const mapStateToProps = state => ({user: state.user})
export default connect(mapStateToProps)(ViewTicket)