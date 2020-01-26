import React , { Component } from 'react'
import { Box, Icon, Button, TextField,
        Dialog, DialogTitle, DialogContent, Container,
        DialogActions} from '@material-ui/core' 

import { displayFullDate } from '../../../config/masks'

import { connect } from 'react-redux'

import { toast } from 'react-toastify'

import axios from 'axios'
import {backendUrl, defineErrorMsg} from '../../../config/backend'


import '../../../pages/css/defaultPage.css'
import '../../../pages/css/forms.css'

class ViewTicket extends Component {
    state = {
        isSending: false,
        success: false,
        error: false
    }

    handleChange = attr => evt => {
        const value = evt.target.value

        this.setState({ ticket : {
            ...this.props.ticket,
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
        const data = this.props.ticket

        data.emailUser = this.props.user.email
        const url = `${backendUrl}/tickets`

        await axios.post(url, data).then( response => {
            this.setState({success: true})
        }).catch( error =>{
            const msg = defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 3000, closeOnClick: true})
        })

        this.toogleIsSending()
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


    componentDidMount(){
        
    }

    render(){
        return (
            <Dialog
                open={true}
                onClose={() => this.props.onClose()}
                maxWidth="lg"
            >
                <DialogTitle id="title">Detalhes do ticket {this.props.ticket.content._id}</DialogTitle>
                <DialogContent>
                    <Container>
                        <Box width="100%" display="flex" alignItems="center" flexWrap="wrap">
                            <TextField 
                                label="Ticket"
                                className="formInput"
                                value={this.props.ticket.content._id}
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
                                value={this.props.defineType(this.props.ticket.content.type)}
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
                                value={this.props.ticket.content.email}
                                InputLabelProps={{
                                    className: "disabled-text-field"
                                }}
                                inputProps={{
                                    className: "disabled-text-field"
                                }}
                                disabled={true}
                            />
                            { this.props.ticket.content.type !== 'account-changed' && this.props.ticket.content.type !== 'simple-account-problem' && 
                                <TextField 
                                    label="Nome do usuário"
                                    className="formInput"
                                    value={this.props.ticket.user.name}
                                    InputLabelProps={{
                                        className: "disabled-text-field"
                                    }}
                                    inputProps={{
                                        className: "disabled-text-field"
                                    }}
                                    disabled={true}
                                />
                            }
                            { Boolean(this.props.ticket.content.type === 'account-changed' || this.props.ticket.content.type === 'simple-account-problem') && 
                                <TextField 
                                    label="Código do usuário"
                                    className="formInput"
                                    value={this.props.ticket.user._id}
                                    InputLabelProps={{
                                        className: "disabled-text-field"
                                    }}
                                    inputProps={{
                                        className: "disabled-text-field min-width-300"
                                    }}
                                    disabled={true}
                                />
                            }
                            { Boolean(this.props.ticket.content.type === 'account-changed' || this.props.ticket.content.type === 'simple-account-problem') && 
                                <TextField 
                                    label="Código do administrador"
                                    className="formInput"
                                    value={this.props.ticket.admin ? this.props.ticket.admin._id : 'Administrador não localizado'}
                                    InputLabelProps={{
                                        className: "disabled-text-field"
                                    }}
                                    inputProps={{
                                        className: "disabled-text-field min-width-300"
                                    }}
                                    disabled={true}
                                />
                            }
                            {this.props.ticket.content.dateOccurrence && 
                                <TextField 
                                    label="Data de ocorrência"
                                    className="formInput"
                                    value={displayFullDate(this.props.ticket.content.dateOccurrence)}
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
                                value={displayFullDate(this.props.ticket.content.createdAt)}
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
                        { this.props.ticket.content.type === 'bug-report' && 
                            <Box width="100%">
                                <Box width="100%">
                                    <TextField 
                                        label="Software"
                                        className="formInput"
                                        value={this.defineSoftware(this.props.ticket.content.software)}
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
                                    value={this.defineDevice(this.props.ticket.content.device)}
                                    InputLabelProps={{
                                        className: "disabled-text-field"
                                    }}
                                    inputProps={{
                                        className: "disabled-text-field"
                                    }}
                                    disabled={true}
                                />
                                { Boolean(this.props.ticket.content.device === 'computer' || this.props.ticket.content.device === 'celphone - webapp') && 
                                    <TextField 
                                        label="Navegador"
                                        className="formInput"
                                        value={this.defineBrowser(this.props.ticket.content.browser)}
                                        InputLabelProps={{
                                            className: "disabled-text-field"
                                        }}
                                        inputProps={{
                                            className: "disabled-text-field"
                                        }}
                                        disabled={true}
                                    />
                                }
                                { Boolean(this.props.ticket.content.device === 'computer' || this.props.ticket.content.device === 'celphone - webapp') && this.props.ticket.content.browser === 'other' && 
                                    <TextField 
                                        label="Outro navegador"
                                        className="formInput"
                                        value={this.props.ticket.content.anotherBrowser}
                                        InputLabelProps={{
                                            className: "disabled-text-field"
                                        }}
                                        inputProps={{
                                            className: "disabled-text-field"
                                        }}
                                        disabled={true}
                                    />
                                }
                            </Box>
                        }
                        <Box width="100%">
                            <TextField 
                                label="Descrição"
                                className="formInput"
                                value={this.props.ticket.content.msg}
                                InputLabelProps={{
                                    className: "disabled-text-field"
                                }}
                                inputProps={{
                                    className: "disabled-text-field"
                                }}
                                multiline={true}
                                rows="10"
                                disabled={true}
                                fullWidth={true}
                            />
                        </Box>
                    </Container>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" 
                        onClick={() => this.props.onClose()}
                    >
                        Fechar
                    </Button>
                    <Button color="secondary" 
                        onClick={() => this.remove(this.props.ticket)}
                    >
                        Responder
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const mapStateToProps = state => ({user: state.user})
export default connect(mapStateToProps)(ViewTicket)