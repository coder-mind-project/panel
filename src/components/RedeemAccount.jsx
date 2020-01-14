import React, { Component } from 'react'

import { Paper, Grid, Box, Button, Container, TextField,
        Icon, Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core'

import Logo from '../assets/coder-mind-painelv1-preto.png'

import Recaptcha from "react-google-invisible-recaptcha"

import { toast } from 'react-toastify'
import axios from 'axios'
import { backendUrl, defineErrorMsg } from '../config/backend'

import { CAPTCHA_SITE_KEY } from '../config/dataProperties'

import { cpfMask, celphoneMask } from '../config/masks'

import '../pages/css/Auth.css'
import '../pages/css/defaultPage.css'

class RescueAccount extends Component {
    state = { 
        //options: 'menu', 'onlyPassword', 'emailAndPassword'
        option: 'menu',
        cpf: '',
        email: '',
        celphone: '',
        response: null,
        waiting: false,
        openDialog: false,
    }

    recaptchaRef = React.createRef()

    toogleOption(option){
        this.setState({option})
    }

    toogleWaiting(){
        this.setState({waiting: !this.state.waiting})
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

        toast.info((<div className="centerVertical"><Icon className="marginRight">info</Icon>Estamos verificando as informações fornecidas, por favor aguarde...</div>), {autoClose: 7000, closeOnClick: true})

        await axios[method](url, data).then( res => {
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon>{res.data}</div>), {autoClose: 25000, closeOnClick: true})
            this.setState({option: 'menu'})
        }).catch(async error => {
            this.setState({option: 'menu', cpf: '', celphone: '', email: ''})
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 25000, closeOnClick: true})
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

    render() { 
        return ( 
            <Container className="container" id="component">
                { this.state.option === 'menu' && 
                    <Paper className="modal">
                        <Grid item xs={12} className="modalTitle">
                            <img src={Logo} alt="Logo" width="180"/>
                        </Grid>
                        <Box width="100%" display="flex" justifyContent="center" alignItems="center">
                            <h3>Recuperar conta</h3>
                        </Box>
                        <Box p={2} display="flex" justifyContent="center" alignItems="center">
                            <p>Selecione a opção que mais adequa ao seu problema</p>
                        </Box>
                        <Grid item xs={12} className="modalForm">
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
                    </Paper>
                }
                { this.state.option === 'onlyPassword' && 
                    <Paper className="modal">
                        <Grid item xs={12} className="modalTitle">
                            <img src={Logo} alt="Logo" width="180"/>
                        </Grid>
                        <Box width="100%" display="flex" justifyContent="center" alignItems="center">
                            <h3>Esqueci minha senha</h3>
                        </Box>
                        <Box pt={2} pl={2} pr={2} display="flex" justifyContent="center" alignItems="center">
                            Informe seu e-mail para prosseguir
                        </Box>
                        <Grid item xs={12} className="modalForm">
                            <TextField label="E-mail" className="modalFormInput"
                                fullWidth onChange={this.handleChange('email')} 
                                inputProps={{ autoComplete: 'email' }}
                            />
                            <Box display="flex" justifyContent="center" alignItems="center" width="100%" mb={2} mt={2}>
                                <Recaptcha 
                                    sitekey={CAPTCHA_SITE_KEY}
                                    ref={ref => this.recaptchaRef = ref}
                                    onResolved={() => this.redeemAccount('onlyEmail')}
                                />
                            </Box>
                            <Box width="100%" mt={2}>
                                <Button color="secondary" disabled={this.state.waiting} variant="contained" fullWidth onClick={() => this.resolve()}>{this.state.waiting ? 'Verificando...' : 'Confirmar'}</Button>
                            </Box>
                            <Box width="100%" mt={2} mb={2}>
                                <Button color="secondary" disabled={this.state.waiting} variant="text" fullWidth onClick={() => this.toogleOption('menu')}>Voltar</Button>
                            </Box>
                        </Grid> 
                    </Paper>
                }
                { this.state.option === 'emailAndPassword' && 
                    <Paper className="modal">
                        <Grid item xs={12} className="modalTitle">
                            <img src={Logo} alt="Logo" width="180"/>
                        </Grid>
                        <Box width="100%" display="flex" justifyContent="center" alignItems="center">
                            <h3>Esqueci meu e-mail e senha</h3>
                        </Box>
                        <Box pt={2} pl={2} pr={2} display="flex" justifyContent="center" alignItems="center">
                            <span>
                                Para recuperar sua conta, vamos precisar confirmar se você é o dono da conta. <br/> <strong>É necessário preencher todos os campos abaixo</strong>
                            </span>
                        </Box>
                        <Grid item xs={12} className="modalForm">
                            <TextField label="Informe seu CPF" value={this.state.cpf}
                                fullWidth onChange={this.handleChangeMaskData('cpf')} 
                                inputProps={{ maxLength: 14 }}
                            />
                            <TextField label="Informe seu número de celular" value={this.state.celphone}
                                fullWidth onChange={this.handleChangeMaskData('celphone')}
                                inputProps={{ maxLength: 15 }}
                            />
                            <Box display="flex" justifyContent="center" alignItems="center" width="100%" mb={2} mt={2}>
                            <Recaptcha 
                                    sitekey={CAPTCHA_SITE_KEY}
                                    ref={ref => this.recaptchaRef = ref}
                                    onResolved={() => this.redeemAccount('moreInformations')}
                                />
                            </Box>
                            <Box width="100%" display="flex" alignItems="center" justifyContent="center" mt={2} mb={2}>
                                <Box mr={1} alignItems="center" justifyContent="center">
                                    <Icon>contact_support</Icon>
                                </Box>
                                <Box alignItems="center" justifyContent="center">
                                    <small className="fakeLink" onClick={() => this.setState({openDialog: true})}><u>Não sei uma ou mais informações solicitadas</u></small>
                                </Box>
                            </Box>
                            <Box width="100%" mt={1}>
                                <Button color="secondary" disabled={this.state.waiting} variant="contained" fullWidth onClick={() => this.resolve()}>{this.state.waiting ? 'Verificando...' : 'Confirmar'}</Button>
                            </Box>
                            <Box width="100%" mt={1} mb={2}>
                                <Button color="secondary" disabled={this.state.waiting} variant="text" fullWidth onClick={() => this.toogleOption('menu')}>Voltar</Button>
                            </Box>
                        </Grid> 
                    </Paper>
                }
                <Dialog onClose={() => this.setState({openDialog: false})} aria-labelledby="dialog-more-information" open={this.state.openDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={() => this.setState({openDialog: false})}>
                        Mais informações
                    </DialogTitle>
                    <DialogContent dividers>
                    <p>
                        Caso nao saiba essas informações será necessário entrar em contato com o administrador do sistema.
                    </p>
                    <p>
                        Assim recomendamos relatar suas tentativas e por consequência o motivo de não ter recuperado sua conta.
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

export default RescueAccount