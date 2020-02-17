import React, { Component } from 'react'

import { Grid, Box, Button, Container, TextField,
        Dialog, DialogTitle, DialogActions,
        DialogContent, FormControl, Select, InputLabel,
        Stepper, Step, StepLabel } from '@material-ui/core'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"

import CustomButton from "./Button.jsx"

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

import Logo from '../assets/coder-mind-painelv1-preto.png'

import Recaptcha from "react-google-invisible-recaptcha"

import axios from 'axios'

import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { setToast } from "../redux/toastActions"
import { error, info } from "../config/toasts"

import { backendUrl, defineErrorMsg } from '../config/backend'

import { CAPTCHA_SITE_KEY } from '../config/dataProperties'

import { cpfMask, celphoneMask } from '../config/masks'

import '../pages/css/defaultPage.css'
import '../pages/auth-section/css/RedeemAccount.css'

class RescueAccount extends Component {
    state = { 
        option: 'menu',// ['menu', 'onlyPassword', 'emailAndPassword']
        cpf: '',
        email: '',
        celphone: '',
        publicAccess: 'imNotSure',
        createDate: null,
        waiting: false,
        openDialog: false,
        steps: [
            {label: 'Informações pessoais', completed: false},
            {label: 'Informações da conta', completed: false},
            {label: 'Confirmação de dados', completed: false},
        ],
        currentStep: 0,

        response: null,
        error: null
    }

    recaptchaRef = React.createRef()

    toogleOption(option){
        
        if(option === 'menu'){
            this.clearFormEmailAndPassword()
        }

        this.setState({option})
    }

    clearFormEmailAndPassword(){
        this.setState({
            cpf: '',
            celphone: '',
            publicAccess: '',
            createDate: null
        })
    }

    displayPublicAccess(){
        switch(this.state.publicAccess){
            case 'yes':{
                return 'Sim'
            }
            case 'no':{
                return 'No'
            }
            default: {
                return 'Não tenho certeza'
            }
        }
    }

    toogleWaiting(){
        this.setState({waiting: !this.state.waiting})
    }

    setCompletedSteps(select, op){
        const currentStep = this.state.currentStep
        const steps = this.state.steps.map( (step, index) => {
            if(op === 'next'){
                if(index === currentStep) step.completed = Boolean(select)
            }

            if(op === 'prev'){
                if(index === currentStep -1) step.completed = Boolean(select)

            }
            return step
        })

        return {steps, currentStep}
    }

    nextStep(){
        const {currentStep, steps} = this.setCompletedSteps(true, 'next')
        this.setState({
            steps,
            currentStep: currentStep + 1
        })
    }

    previousStep(){
        const {currentStep, steps} = this.setCompletedSteps(false, 'prev')
        
        this.setState({
            steps,
            currentStep: currentStep > 0 ? currentStep - 1 : 0 
        })
    }

    handleChangeMaskData = attr => event => {
        if(typeof attr !== 'string') return
        const value = event.target.value
        switch(attr){
            case 'cpf':{
                this.setState({[attr]: cpfMask(value)})
                break
            }
            default:{
                this.setState({[attr]: celphoneMask(value)})
                break
            }
        }
    }

    async redeemAccount(option){
        const url = `${backendUrl}/auth`
        const method = option === 'onlyEmail' ? 'patch' : 'put'
        const response = await this.recaptchaRef.getResponse()
        const data = option === 'onlyEmail' ? {email: this.state.email, response} : {cpf: this.state.cpf, celphone: this.state.celphone, response} 

        //verificar necessidade deste toast
        this.props.setToast(info('Estamos verificando as informações fornecidas, por favor aguarde...'))

        await axios[method](url, data).then( res => {
            this.setState({response: res.data})
        }).catch(async err => {
            this.setState({option: 'menu', cpf: '', celphone: '', email: ''})
            const msg = await defineErrorMsg(err)
            this.props.setToast(error(msg))
        })

        this.toogleWaiting()
    }

    resolve = () => {
        this.toogleWaiting()
        this.recaptchaRef.execute()
    }

    handleChange = attr => event => {
        const value = event.target.value
        this.setState({
            [attr]: value
        })
    }

    handleDate = (date, attr) => {
        this.setState({
            [attr]: date
        })
    }

    captchaError(){
        this.recaptchaRef.reset()
        this.setState({
            error: 'Ocorreu um erro no recaptcha, se persistir reporte'
        })
    }

    render() { 
        return ( 
            <Container className="redeem-account-section">
                <div className="logo-area">
                    <img src={Logo} alt="Logo" width="200"/>
                </div>
                <Recaptcha 
                    sitekey={CAPTCHA_SITE_KEY}
                    ref={ref => this.recaptchaRef = ref}
                    onResolved={() => this.redeemAccount('onlyEmail')}
                    style={{zIndex: 1}}
                    onError={() => this.captchaError()}
                    onExpired={() => this.captchaError()}
                    locale="pt-br"
                />
                { this.state.option === 'menu' && !this.state.response &&
                    <Grid item xs={12}>
                        <Box width="100%" display="flex" justifyContent="center" alignItems="center">
                            <h3>Recuperação de conta Coder Mind</h3>
                        </Box>
                        <Box p={2} display="flex" justifyContent="center" alignItems="center">
                            <p>Selecione a opção que mais adequa ao seu problema</p>
                        </Box>
                        <Box width="100%" mb={2}>
                            <Button color="secondary" variant="contained" fullWidth onClick={() => this.toogleOption('emailAndPassword')}>Não sei meu e-mail</Button>
                        </Box>
                        <Box width="100%" mb={2}>
                            <Button color="secondary" variant="contained" fullWidth onClick={() => this.toogleOption('onlyPassword')}>Não sei minha senha</Button>
                        </Box>
                        <Box width="100%" mt={2} mb={2}>
                            <Button color="secondary" variant="text" fullWidth onClick={this.props.back}>Voltar</Button>
                        </Box>
                    </Grid>
                }
                { this.state.option === 'onlyPassword' && !this.state.response &&
                    <Grid item xs={12} className="redeem-account-area">
                        <h2>Esqueci minha senha</h2>
                        <p>Informe seu e-mail para prosseguir com a recuperação de senha, vamos lhe enviar um e-mail com mais instruções.</p>
                        <TextField label="E-mail" className="modalFormInput"
                            fullWidth={true} onChange={this.handleChange('email')} 
                            inputProps={{ autoComplete: 'email' }}
                        />
                        <CustomButton disabledIcon={true} fullWidth={true} disabled={this.state.waiting} onClick={() => this.resolve()} text={this.state.waiting ? 'Verificando...' : 'Confirmar'}/>
                        <Button fullWidth={true} color="secondary" variant="outlined" disabled={this.state.waiting} onClick={() => this.toogleOption('menu')}>Voltar</Button>
                    </Grid>
                }
                { this.state.option === 'emailAndPassword' && !this.state.response &&
                    <Grid item xs={12} className="redeem-account-area">
                        <h2>Esqueci meu e-mail</h2>
                        <p>
                            Para recuperar sua conta, vamos fazer algumas perguntas sobre seu acesso.
                        </p>
                        <p>
                            Tente preencher todos os campos com as informações mais recentes que você se lembra, isto ajuda numa análise mais apurada para recuperar sua conta.
                        </p>
                        <Stepper activeStep={this.state.currentStep} orientation="horizontal">
                            { this.state.steps.map((step, index) => {
                                
                                const stepProps = {completed: step.completed}
                                
                                return (
                                    <Step key={index} {...stepProps} >
                                        <StepLabel>{step.label}</StepLabel>
                                    </Step>
                                )
                            })}
                        </Stepper>
                        <Box className="stepper-hud">
                            <Box display="flex" alignItems="center">
                                <small className="form-text" onClick={() => this.setState({openDialog: true})}><u>Não sei uma ou mais informações solicitadas</u></small>
                            </Box>
                            <Box display='flex' alignItems='center' justifyContent='center' flexWrap='wrap'>
                                <Box mr={2}>
                                    <Button color="secondary" variant="contained" onClick={ this.state.currentStep > 0 ? () => this.previousStep() : () => this.toogleOption('menu')}>
                                        {this.state.currentStep > 0 ? 'Voltar' : 'Sair'}
                                    </Button>
                                </Box>
                                { this.state.currentStep < this.state.steps.length - 1 && 
                                    <Box>
                                        <Button color="secondary" variant="contained" onClick={() => this.nextStep()}>
                                            Próximo
                                        </Button>
                                    </Box>
                                }
                            </Box>
                        </Box>

                        { this.state.currentStep === 0 &&
                            <FormControl fullWidth>
                                <TextField label="Informe seu CPF" value={this.state.cpf}
                                    fullWidth onChange={this.handleChangeMaskData('cpf')} 
                                    inputProps={{ maxLength: 14 }}
                                    className="modalFormInput"
                                />
                                <TextField label="Informe seu número de telefone" value={this.state.celphone}
                                    fullWidth onChange={this.handleChangeMaskData('celphone')}
                                    inputProps={{ maxLength: 15 }}
                                    className="modalFormInput"
                                />
                                <TextField label="E-mail de contato" value={this.state.celphone}
                                    fullWidth onChange={this.handleChangeMaskData('celphone')}
                                    inputProps={{ maxLength: 15 }}
                                    className="modalFormInput"
                                    helperText="Este e-mail será utilizado para nossa equipe entrar em contato em caso de necessidade de avaliação dos nossos administradores"
                                />
                            </FormControl>
                        }
                        { this.state.currentStep === 1 && 
                            <FormControl fullWidth>
                                <FormControl fullWidth className="modalFormInput">
                                    <InputLabel htmlFor='public-access'>
                                        Seu perfil tem acesso público no website para os leitores?
                                    </InputLabel>
                                    <Select
                                        native
                                        value={this.state.publicAccess}
                                        onChange={this.handleChange('publicAccess')}
                                        inputProps={{
                                            id: 'public-access'
                                        }}
                                    >
                                        <option value="imNotSure">Não tenho certeza</option>
                                        <option value="yes">Sim</option>
                                        <option value="no">Não</option>
                                    </Select>
                                </FormControl>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <KeyboardDatePicker label="Quando você começou a usar nossa plataforma?"
                                        clearable 
                                        cancelLabel="Cancelar"
                                        clearLabel="Limpar"
                                        value={this.state.createDate}
                                        onChange={(date) => this.handleDate(date, 'createDate')}
                                        mask="__/__/____"
                                        maxDate={new Date()}
                                        maxDateMessage="Data acima do permitido"
                                        minDateMessage="Data abaixo do permitido"
                                        format="DD/MM/YYYY"
                                        invalidDateMessage="Formato de data inválido"
                                        helperText="Informe uma data aproximada, caso não tenha certeza"
                                        fullWidth
                                        className="modalFormInput" />
                                </MuiPickersUtilsProvider>
                            </FormControl>
                        }
                        { this.state.currentStep === 2 && 
                            <FormControl fullWidth>
                                <h3>Confirmar dados:</h3>
                                <span className="small-text">Ao confirmar, realizaremos uma análise das informações fornecidas. É importante ressaltar que enviar mais de uma soliticação de recuperação irá atrasar a análise de seu pedido de recuperação de senha, então, seja paciente que retornaremos um feedback já já, combinado? =D</span>
                                <Box mb={2}>
                                    <ul>
                                        <li>CPF: <strong>{this.state.cpf || 'Não informado'}</strong></li>
                                        <li>Telefone de contato: <strong>{this.state.celphone || 'Não informado'}</strong></li>
                                        <li>Seu perfil tem acesso público no website para os leitores? <strong>{this.displayPublicAccess()}</strong></li>
                                        <li>Quando você começou a usar nossa plataforma? <strong>{this.state.createDate ? this.state.createDate.format('DD/MM/YYYY') : 'Não informado'}</strong></li>
                                    </ul>
                                </Box>
                                <Button color="secondary" disabled={this.state.waiting} variant="contained" fullWidth onClick={() => this.resolve()}>{this.state.waiting ? 'Verificando...' : 'Confirmar'}</Button>
                            </FormControl>
                        }
                    </Grid>
                }
                { Boolean(this.state.response) && 
                    <Grid item xs={12} className="redeem-account-area">
                        <Box height="100%" display='flex' alignItems='center'>
                            <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap'>
                                <Box mr={2} mb={2}>
                                    <FontAwesomeIcon icon={faCheckCircle} size="4x" color="#218838" />
                                </Box>
                                <Box mb={5}>
                                    {this.state.response}
                                </Box>
                                <Button variant="outlined" color="secondary" onClick={this.props.back}>Ir para a tela de autenticação</Button>
                            </Box>
                        </Box>
                    </Grid>
                }
                <Dialog onClose={() => this.setState({openDialog: false})} aria-labelledby="dialog-more-information" open={this.state.openDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={() => this.setState({openDialog: false})}>
                        Mais informações
                    </DialogTitle>
                    <DialogContent dividers>
                    <p>
                        Caso nao saiba uma ou mais informações não tem problema!
                    </p>
                    <p>
                        Preencha o formulário com o máximo de informações possíveis, dependendo, estas informações poderão ser analisadas por uma pessoa.
                    </p>
                    <p>
                        Você receberá um feedback em até 24 horas.
                    </p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({openDialog: false})} color="secondary">
                            Entendi
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        )
    }
}

const mapStateToProps = state => ({toast: state.config})
const mapDispatchToProps = dispatch => bindActionCreators({setToast}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RescueAccount)