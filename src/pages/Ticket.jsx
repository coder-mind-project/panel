import React, {Component} from 'react'
import { Container, TextField, Box, Paper, Icon,
        Tooltip, IconButton, Divider, Card, CardContent,
        CardActions, Button, Grid } from '@material-ui/core'

import Header from '../components/Header.jsx'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faQuestionCircle, faCheckCircle} from '@fortawesome/free-solid-svg-icons'

import { COLOR_APP } from '../config/dataProperties'

import { connect } from 'react-redux'
import axios from 'axios'

import { backendUrl, defineErrorMsg } from '../config/backend'
import { toast } from 'react-toastify'

import CustomButton from '../components/Button.jsx'
import WhatIsTicketDialog from '../components/Modals/WhatIsTicket.jsx'
import AccountProblem from '../components/ComponentPages/Ticket/AccountProblem.jsx'
import BugReport from '../components/ComponentPages/Ticket/BugReport.jsx'

import './css/defaultPage.css'
import './css/Ticket.css'

class Ticket extends Component {

    state = {
        authenticated: false,
        type: 'menu',
        accountChanged: {
            firstCode: '',
            secondCode: '',
            emailUser: '',
            date: '',
            msg: ''
        },
        sendingTicket: false,
        success: false,
        timeToCloseWindow: 10,
        whatIsTicketFlag: false
    }

    toogleSendingTicket(){
        this.setState({sendingTicket: !this.state.sendingTicket})
    }

    handleChange = (attr, object) => evt => {
        const value = evt.target.value

        if(object === 'accountChanged'){
            this.setState({[object]:{
                ...this.state[object],
                [attr]: value
            }})
        }else{
            this.setState({[attr]: value})
        }
    }

    defineTicketType(type = false){
        const searchUrl = this.props.location.search

        if(!searchUrl && !this.state.authenticated) window.location.href = '/auth'

        const params = this.formatParamsSearchUrl(searchUrl)

        if(params.aid && !this.state.authenticated){
            this.setState({
                accountChanged: {
                    firstCode: params.aid,
                    secondCode: params.uid,
                    emailUser: params.mail,
                    date: params.date ? params.date.replace('%20', ' ') : null
                },
                type: 'account-changed'
            })
        }

        if(this.state.authenticated && !type){
            this.setState({
                type: 'menu'
            })
        }

        if(this.state.authenticated && type){
            this.setState({type})
        }
    }

    formatParamsSearchUrl(search){
        let s = search.replace('?', '')

        s = s.split('&')
        
        let params = {}
        
        for (let i = 0; i < s.length; i++) {
            const keyValue = s[i].split('=')
            const key = keyValue[0]
            const value = keyValue[1] || null

            params[key] = value    
        }

        return params
    }

    async sendTicket(){
        this.toogleSendingTicket()

        const data = this.state.accountChanged

        data.type = this.state.type
        
        const url = `${backendUrl}/tickets`
        await axios.post(url, data).then( () => {
            this.setState({
                success: true
            })
            if(!this.state.authenticated){
                setInterval(() => {
                    if(this.state.timeToCloseWindow === 0){ 
                        window.location.href = 'https://codermind.com.br'
                    }else{
                        this.setState({
                            timeToCloseWindow: this.state.timeToCloseWindow - 1
                        })
                    }
                }, 1000)
            }
        }).catch( error => {
            const msg = defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 5000, closeOnClick: true})
        })

        this.toogleSendingTicket()
    }

    dispatchDialog(dialog = null, close = false){
        if(!dialog){
            /**Close all dialogs */
            this.setState({
                whatIsTicketFlag: false
            })
        }

        switch(dialog){
            case 'what-is-ticket':{
                this.setState({whatIsTicketFlag: close ? false : true})
                break
            }
            default: {/* Nothing to do here */}
        }
    }

    componentWillMount(){
        if(this.props.user._id){
            this.setState({authenticated: true})
        }
    }

    componentDidMount(){
        this.defineTicketType()
    }

    render(){
        return (
            <Container id="component">
                <Header 
                    title="Ticket"
                    description={this.state.authenticated ? "Reporte um problema, bug ou sugira melhorias" : "Reporte uma ocorrência, problema ou informações referêntes entre você e a plataforma Coder Mind."}
                    icon="feedback"
                    noMarginTop={!this.state.authenticated}
                />
                { this.state.whatIsTicketFlag && <WhatIsTicketDialog closeDialog={() => this.dispatchDialog('what-is-ticket', true)} />}
                <Paper className={this.state.success ? "paper-container-success-area" : "paper-container"}>
                    <Grid item xs={12}>
                        { this.state.success && 
                            <Box display="flex" alignItems="center" justifyContent="center" flexWrap="wrap" p={2}>
                                <Box display="flex" alignItems="center" mr={2}>
                                    <FontAwesomeIcon icon={faCheckCircle} size="5x" color="#28a745"/>
                                </Box>
                                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                    <h3 className="success-msg">Ticket enviado com sucesso! Agora basta aguardar, responderemos rapidinho ;)</h3>
                                    <span className="text-explication">Redirectionando em {this.state.timeToCloseWindow} ...</span>
                                </Box>
                            </Box>
                        }  
                        {!this.state.authenticated && this.state.type === "account-changed" && !this.state.success &&
                            <Box display="flex" flexDirection="column" pl={4} pr={4} pt={1}>
                                <Box>
                                    <h4>Recuperação de conta</h4>
                                </Box>
                                <Box>
                                    <p className="text-explication">Descreva seu problema e caso o campo <strong>E-mail de contato</strong> não esteja preenchido inclua-o para solicitar a revisão do seu problema. Prometemos responder rapidinho =D</p>
                                </Box>
                            </Box>
                        }
                        { !this.state.authenticated && this.state.type === 'account-changed' && !this.state.success && <Divider/>}
                        {this.state.authenticated && !this.state.success &&
                            <Box display="flex" alignItems="center" justifyContent="space-between" pt={4} pl={2} pr={2} pb={4}>
                                <Box display='flex' alignItems="center" justifyContent="center" flexWrap='wrap'>
                                    <Box display="flex" flexDirection="column">
                                        <span>Olá <strong>{this.props.user.name}</strong>, aqui você pode gerar tickets para os administradores do sistema.</span>
                                        <span>Informe o tipo de problema e descreva o ocorrido, respostas serão enviadas ao seu e-mail de cadastro na plataforma.</span>
                                    </Box>
                                </Box>
                                <Tooltip title={(<span className="text-tooltip-button">O que é ticket?</span>)} placement="left-start">
                                    <IconButton size="small" onClick={() => this.dispatchDialog('what-is-ticket')}>
                                        <FontAwesomeIcon icon={faQuestionCircle} color={COLOR_APP} size="2x"/>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        }
                        { this.state.type === 'account-changed' && !this.state.authenticated && !this.state.success &&
                            <Box p={3} pt={0} display="flex" alignItems="center" flexWrap="wrap">
                                <TextField 
                                    className="container-text-field"
                                    label="Primeiro Código"
                                    value={this.state.accountChanged.firstCode}
                                    inputProps={{
                                        className: "text-field"
                                    }}
                                    InputLabelProps={{
                                        className: "text-field"
                                    }}
                                    disabled={true}
                                />
                                <TextField
                                    className="container-text-field"
                                    label="Segundo Código"
                                    value={this.state.accountChanged.secondCode}
                                    inputProps={{
                                        className: "text-field"
                                    }}
                                    InputLabelProps={{
                                        className: "text-field"
                                    }}
                                    disabled={true}
                                />
                                <TextField 
                                    className="container-text-field"
                                    label="E-mail de contato"
                                    value={this.state.accountChanged.emailUser}
                                    onChange={this.handleChange('emailUser', 'accountChanged')}
                                    inputProps={{
                                        className: "text-field"
                                    }}
                                    InputLabelProps={{
                                        className: "text-field"
                                    }}
                                />
                                <TextField 
                                    className="container-text-field"
                                    label="Data da ocorrência"
                                    value={this.state.accountChanged.date}
                                    disabled={true}
                                    inputProps={{
                                        className: "text-field"
                                    }}
                                    InputLabelProps={{
                                        className: "text-field"
                                    }}
                                />
                                <TextField 
                                    className="container-text-field"
                                    label="Descreva aqui o seu problema"
                                    multiline={true}
                                    fullWidth={true}
                                    value={this.state.accountChanged.msg}
                                    rows="10"
                                    onChange={this.handleChange('msg', 'accountChanged')}
                                    inputProps={{
                                        className: "text-field"
                                    }}
                                    InputLabelProps={{
                                        className: "text-field"
                                    }}
                                />
                                <Box width="100%">
                                    <p className="form-explication">Seu ticket será respondido através do e-mail de contato fornecido, é importante descrever o máximo possível de informações. Você receberá uma mensagem automática que recebemos o seu ticket após o envio, assim entraremos em contato o mais breve possível com a análise já realizada ou solicitando mais informações.</p>
                                </Box>
                                <Box width="100%" mt={4} mb={4}>
                                    <CustomButton 
                                        color="default"
                                        loading={this.state.sendingTicket}
                                        disabled={this.state.sendingTicket}
                                        fullWidth={true}
                                        icon="save"
                                        text={this.state.sendingTicket ? 'Enviando ticket...' : 'Enviar ticket'}
                                        onClick={() => this.sendTicket()}
                                    />
                                </Box>
                            </Box>
                        }
                        { this.state.authenticated && this.state.type === 'menu' &&
                            <Box p={3}>
                                <Divider/>
                                <Box width="100%">
                                    <h4>Selecione o tipo de ticket que deseja enviar</h4>
                                </Box>
                                <Box display="flex" alignItems="center" flexWrap="wrap">
                                    <Card className="card" variant="outlined">
                                        <CardContent>
                                            <h4>Alteraram os dados da minha conta!</h4>
                                            <span className="text-explication">
                                                Problemas relacionados a configurações da sua conta na Coder Mind por terceiros.
                                            </span>
                                        </CardContent>
                                        <CardActions className="card-actions">
                                            <Button size="small" color="secondary" variant="outlined" onClick={() => this.defineTicketType('account-problem')}>Abrir Ticket</Button>
                                        </CardActions>
                                    </Card>
                                    <Card className="card" variant="outlined">
                                        <CardContent>
                                            <h4>Reporte de bugs</h4>
                                            <span className="text-explication">
                                                Encontrou algum bug no painel ou em nosso website? reporte!
                                            </span>
                                        </CardContent>
                                        <CardActions className="card-actions">
                                            <Button size="small" color="secondary" variant="outlined" onClick={() => this.defineTicketType('bug-report')}>Abrir Ticket</Button>
                                        </CardActions>
                                    </Card>
                                    <Card className="card" variant="outlined">
                                        <CardContent>
                                            <h4>Sugestão de melhorias</h4>
                                            <span className="text-explication">
                                                Encontrou algo que pode ficar melhor? por favor nos conte =D
                                            </span>
                                        </CardContent>
                                        <CardActions className="card-actions">
                                            <Button size="small" color="secondary" variant="outlined" onClick={() => this.defineTicketType('improvement-suggestion')}>Abrir Ticket</Button>
                                        </CardActions>
                                    </Card>
                                </Box>
                            </Box>
                        }
                        { this.state.authenticated && this.state.type === 'account-problem' && 
                            <AccountProblem goBack={() => this.defineTicketType('menu')}/>
                        }
                        { this.state.authenticated && this.state.type === 'bug-report' && 
                            <BugReport goBack={() => this.defineTicketType('menu')}/>
                        }
                    </Grid>
                </Paper>
            </Container>
        )
    }
}  

const mapStateToProps = state => ({user: state.user, menu: state.menu})

export default connect(mapStateToProps)(Ticket)