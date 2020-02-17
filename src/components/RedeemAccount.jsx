import React, { useState, useRef, useEffect } from 'react'

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
import { error as toastError } from "../config/toasts"

import { backendUrl, defineErrorMsg } from '../config/backend'

import { CAPTCHA_SITE_KEY } from '../config/dataProperties'

import { cpfMask, celphoneMask } from '../config/masks'

import '../pages/css/defaultPage.css'
import '../pages/auth-section/css/RedeemAccount.css'

function RescueAccount(props) {

    const {back, setToast} = {...props}
    
    const [option, setOption] = useState('menu')
    const [cpf, setCpf] = useState('')
    const [email, setEmail] = useState('')
    const [celphone, setCelphone] = useState('')
    const [publicAccess, setPublicAccess] = useState('imNotSure')
    const [createDate, setCreateDate] = useState(null)
    const [currentStep, setCurrentStep] = useState(0)
    const [dialog, setDialog] = useState(false)
    const [steps, setSteps] = useState([
        {label: 'Informações pessoais', completed: false},
        {label: 'Informações da conta', completed: false},
        {label: 'Confirmação de dados', completed: false},
    ])
    const [response, setResponse] = useState(null)
    const [recaptchaToken, setRecaptchaToken] = useState('')
    const [type, setType] = useState('')
    const [waiting, setWaiting] = useState(false)

    const recaptchaRef = useRef(null)

    function toogleOption(option){
        if(option === 'menu'){
            clearFormEmailAndPassword()
        }

        setOption(option)
    }

    function clearFormOnlyPassword(){
        setEmail('')    
    }

    function clearFormEmailAndPassword(){
        setCpf('')
        setCelphone('')
        setPublicAccess('')
        setCreateDate(null)
    }

    function displayPublicAccess(){
        switch(publicAccess){
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

    function setCompletedSteps(select, op){
        const customSteps = steps.map( (step, index) => {
            if(op === 'next'){
                if(index === currentStep) step.completed = Boolean(select)
            }

            if(op === 'prev'){
                if(index === currentStep -1) step.completed = Boolean(select)

            }
            return step
        })

        return customSteps
    }

    function nextStep(){
        const steps = setCompletedSteps(true, 'next')
        setSteps(steps)
        setCurrentStep(currentStep + 1)
    }
    
    function previousStep(){
        const steps = setCompletedSteps(false, 'prev')
        const step = currentStep > 0 ? currentStep - 1 : 0
        setSteps(steps)
        setCurrentStep(step)
    }

    function handleChangeMaskData(attr){
        return event => {
            if(typeof attr !== 'string') return
            
            const value = event.target.value
            switch(attr){
                case 'cpf':{
                    setCpf(cpfMask(value))
                    break
                }
                default:{
                    setCelphone(celphoneMask(value))
                    break
                }
            }
        }
    }

    async function resolve(type) {
        setType(type)
    }

    function handleChange(setAttr) {
        return event => {
            const value = event.target.value
            setAttr(value)
        }
    }

    function handleDate (setAttr, date) {
        setAttr(date)
    }

    function captchaError(){
        setToast(toastError('Ocorreu um erro no recaptcha, se persistir reporte'))
    }

    useEffect(() => {

        function toogleWaiting(){
            setWaiting(!waiting)
        }

        async function redeemAccount(){
            const url = `${backendUrl}/auth`
            const data = type === 'onlyPassword' ? {email, response: recaptchaToken} : {cpf, celphone, response: recaptchaToken} 
            const method = type === 'onlyPassword' ? 'patch' : 'put'
            
            setType('')
            setRecaptchaToken('')
            
            toogleWaiting()
            
            await axios[method](url, data).then( res => {
                setResponse(res.data)
            }).catch(async err => {
                method === 'patch' ? clearFormOnlyPassword() : clearFormEmailAndPassword()
                
                const msg = defineErrorMsg(err)
                setToast(toastError(msg))
            })
            
            toogleWaiting()
        }

        if(type && !recaptchaToken) recaptchaRef.current.execute()
        
        if(type && recaptchaToken) redeemAccount()

    }, [type, recaptchaToken, waiting, response, email, cpf, celphone, setToast])
    
    return ( 
        <Container className="redeem-account-section">
            <div className="logo-area">
                <img src={Logo} alt="Logo" width="200"/>
            </div>
            <Recaptcha 
                sitekey={CAPTCHA_SITE_KEY}
                ref={ref => recaptchaRef.current = ref}
                onResolved={(token) => setRecaptchaToken(token)}
                style={{zIndex: 1}}
                onError={() => captchaError()}
                onExpired={() => captchaError()}
                locale="pt-br"
            />
            { option === 'menu' && !response &&
                <Grid item xs={12}>
                    <Box width="100%" display="flex" justifyContent="center" alignItems="center">
                        <h3>Recuperação de conta Coder Mind</h3>
                    </Box>
                    <Box p={2} display="flex" justifyContent="center" alignItems="center">
                        <p>Selecione a opção que mais adequa ao seu problema</p>
                    </Box>
                    <Box width="100%" mb={2}>
                        <Button color="secondary" variant="contained" fullWidth onClick={() => toogleOption('emailAndPassword')}>Não sei meu e-mail</Button>
                    </Box>
                    <Box width="100%" mb={2}>
                        <Button color="secondary" variant="contained" fullWidth onClick={() => toogleOption('onlyPassword')}>Não sei minha senha</Button>
                    </Box>
                    <Box width="100%" mt={2} mb={2}>
                        <Button color="secondary" variant="text" fullWidth onClick={back}>Voltar</Button>
                    </Box>
                </Grid>
            }
            { option === 'onlyPassword' && !response &&
                <Grid item xs={12} className="redeem-account-area">
                    <h2>Esqueci minha senha</h2>
                    <p>Informe seu e-mail para prosseguir com a recuperação de senha, vamos lhe enviar um e-mail com mais instruções.</p>
                    <TextField label="E-mail" className="modalFormInput"
                        fullWidth={true} onChange={handleChange(setEmail)} 
                        inputProps={{ autoComplete: 'email' }}
                    />
                    <CustomButton disabledIcon={true} fullWidth={true} disabled={waiting} onClick={() => resolve('onlyPassword')} text={waiting ? 'Verificando...' : 'Confirmar'}/>
                    <Button fullWidth={true} color="secondary" variant="outlined" disabled={waiting} onClick={() => toogleOption('menu')}>Voltar</Button>
                </Grid>
            }
            { option === 'emailAndPassword' && !response &&
                <Grid item xs={12} className="redeem-account-area">
                    <h2>Esqueci meu e-mail</h2>
                    <p>
                        Para recuperar sua conta, vamos fazer algumas perguntas sobre seu acesso.
                    </p>
                    <p>
                        Tente preencher todos os campos com as informações mais recentes que você se lembra, isto ajuda numa análise mais apurada para recuperar sua conta.
                    </p>
                    <Stepper activeStep={currentStep} orientation="horizontal">
                        { steps.map((step, index) => {
                            
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
                            <small className="form-text" onClick={() => setDialog(true)}><u>Não sei uma ou mais informações solicitadas</u></small>
                        </Box>
                        <Box display='flex' alignItems='center' justifyContent='center' flexWrap='wrap'>
                            <Box mr={2}>
                                <Button color="secondary" variant="contained" onClick={ currentStep > 0 ? () => previousStep() : () => toogleOption('menu')}>
                                    {currentStep > 0 ? 'Voltar' : 'Sair'}
                                </Button>
                            </Box>
                            { currentStep < steps.length - 1 && 
                                <Box>
                                    <Button color="secondary" variant="contained" onClick={() => nextStep()}>
                                        Próximo
                                    </Button>
                                </Box>
                            }
                        </Box>
                    </Box>

                    { currentStep === 0 &&
                        <FormControl fullWidth>
                            <TextField label="Informe seu CPF" value={cpf}
                                fullWidth onChange={handleChangeMaskData('cpf')} 
                                inputProps={{ maxLength: 14 }}
                                className="modalFormInput"
                            />
                            <TextField label="Informe seu número de telefone" value={celphone}
                                fullWidth onChange={handleChangeMaskData('celphone')}
                                inputProps={{ maxLength: 15 }}
                                className="modalFormInput"
                            />
                            <TextField label="E-mail de contato" value={celphone}
                                fullWidth onChange={handleChangeMaskData('celphone')}
                                inputProps={{ maxLength: 15 }}
                                className="modalFormInput"
                                helperText="Este e-mail será utilizado para nossa equipe entrar em contato em caso de necessidade de avaliação dos nossos administradores"
                            />
                        </FormControl>
                    }
                    { currentStep === 1 && 
                        <FormControl fullWidth>
                            <FormControl fullWidth className="modalFormInput">
                                <InputLabel htmlFor='public-access'>
                                    Seu perfil tem acesso público no website para os leitores?
                                </InputLabel>
                                <Select
                                    native
                                    value={publicAccess}
                                    onChange={handleChange(setPublicAccess)}
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
                                    value={createDate}
                                    onChange={(date) => handleDate(setCreateDate, date)}
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
                    { currentStep === 2 && 
                        <FormControl fullWidth>
                            <h3>Confirmar dados:</h3>
                            <span className="small-text">Ao confirmar, realizaremos uma análise das informações fornecidas. É importante ressaltar que enviar mais de uma soliticação de recuperação irá atrasar a análise de seu pedido de recuperação de senha, então, seja paciente que retornaremos um feedback já já, combinado? =D</span>
                            <Box mb={2}>
                                <ul>
                                    <li>CPF: <strong>{cpf || 'Não informado'}</strong></li>
                                    <li>Telefone de contato: <strong>{celphone || 'Não informado'}</strong></li>
                                    <li>Seu perfil tem acesso público no website para os leitores? <strong>{displayPublicAccess()}</strong></li>
                                    <li>Quando você começou a usar nossa plataforma? <strong>{createDate ? createDate.format('DD/MM/YYYY') : 'Não informado'}</strong></li>
                                </ul>
                            </Box>
                            <Button color="secondary" disabled={waiting} variant="contained" fullWidth onClick={() => resolve('onlyEmail')}>{waiting ? 'Verificando...' : 'Confirmar'}</Button>
                        </FormControl>
                    }
                </Grid>
            }
            { Boolean(response) && 
                <Grid item xs={12} className="redeem-account-area">
                    <Box height="100%" display='flex' alignItems='center'>
                        <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap'>
                            <Box mr={2} mb={2}>
                                <FontAwesomeIcon icon={faCheckCircle} size="4x" color="#218838" />
                            </Box>
                            <Box mb={5}>
                                {response}
                            </Box>
                            <Button variant="outlined" color="secondary" onClick={back}>Ir para a tela de autenticação</Button>
                        </Box>
                    </Box>
                </Grid>
            }
            <Dialog onClose={() => setDialog(false)} aria-labelledby="dialog-more-information" open={dialog}>
                <DialogTitle id="customized-dialog-title" onClose={() => setDialog(false)}>
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
                    <Button onClick={() => setDialog(false)} color="secondary">
                        Entendi
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

const mapStateToProps = state => ({toast: state.config})
const mapDispatchToProps = dispatch => bindActionCreators({setToast}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RescueAccount)