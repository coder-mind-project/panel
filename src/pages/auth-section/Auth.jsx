import React, { Component } from 'react'
import { Grid, TextField, Box, Fade, LinearProgress,
        Button, InputAdornment, IconButton, Icon } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Redirect } from 'react-router-dom'

import RedeemAccount from '../../components/RedeemAccount.jsx'
import CustomButtonBase from '../../components/ButtonBase.jsx'

import { setUser } from '../../redux/userActions'
import { setMenu } from '../../redux/menuActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import axios from 'axios'
import { backendUrl, defineErrorMsg } from '../../config/backend'
import { CAPTCHA_SITE_KEY } from '../../config/dataProperties'

import Recaptcha from "react-google-invisible-recaptcha"

import Logo from '../../assets/coder-mind-painelv1-preto.png'

import './css/Auth.css'
import '../css/defaultPage.css'


class Auth extends Component {
    props = this.props
    
    recaptchaRef = React.createRef()

    state = { 
        email: '',
        password: '',
        response: null,
        rescuePassword: false,
        loading: false,
        redirect: false,
        currentImg: 0,

        error: null,
        passwordVisibility: false
        
    }

    toogleRescuePassword(){
        this.setState({rescuePassword: !this.state.rescuePassword})
    }

    toogleLoading(){
        this.setState({loading: !this.state.loading})
    }

    resolve = (event) => {
        event.preventDefault()
        // Caso ja esteja carregando não será possível mandar nova autenticação para gerar o token do recaptcha
        if(this.state.loading) return
        this.recaptchaRef.execute()
    }

    captchaError(){
        this.recaptchaRef.reset()
        this.toogleLoading()
        this.setState({
            error: 'Ocorreu um erro no recaptcha, se persistir reporte'
        })
    }

    signIn = async () => {
        /* Resposável por realizar a autenticação */
        
        this.toogleLoading()

        const response = await this.recaptchaRef.getResponse()

        const user = {
            email: this.state.email,
            password: this.state.password,
            response: response
        }

        const url = `${backendUrl}/auth`

        await axios.post(url, user).then( async res => {
            localStorage.setItem('user', JSON.stringify({token: res.data.token}))
            window.open('/', '_self')
        }).catch(async error => {
            const msg = await defineErrorMsg(error)
            this.setState({error: msg})
            this.recaptchaRef.reset()
        })

        this.toogleLoading()
    }

    handleChange = attr => event => {
        const value = event.target.value
        this.setState({
            [attr]: value
        })
    }

    tooglePasswordVisibility(){
        this.setState({
            passwordVisibility: !this.state.passwordVisibility
        })
    }
    
    verifyUser = async () => {
        /*  Verifica se existe um usuário logado, e assim redireciona a pagina
        em caso de detecção de autenticação ativa 
        */
        const user = await localStorage.getItem('user')
        if(user) this.setState({redirect: true}) 
    }

    authFormFocus(){
        const input = document.querySelector('#cm-email')
        if(input) input.focus()
    }
    
    componentDidMount(){
        this.verifyUser()
    }

    render() { 
        return (
            <Box display="flex" alignItems="center" flexWrap="wrap">
                { !this.state.rescuePassword && 
                    <Grid item xs={12} md={4} className="pretty-section">
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                            <h1>Painel da Coder Mind</h1>
                            <h2>Aqui você poderá publicar seus artigos e acompanhar sua relevância.</h2>
                            <Box display="flex" alignItems="center" flexDirection="column" mt={2} mb={2}>
                                <Button color="inherit" variant="outlined" className="button" fullWidth={true}>Criar conta</Button>
                                <Button onClick={this.authFormFocus} color="inherit" variant="outlined" className="button i-have-an-account" fullWidth={true}>Já tenho uma conta</Button>
                            </Box>
                        </Box>
                    </Grid>
                }
                <Grid item xs={12} md={!this.state.rescuePassword ? 8 : 12} className="container">
                    { !this.state.rescuePassword &&
                        <div className="auth-section">
                            { this.state.loading && <LinearProgress color="primary" />}
                            <div className="logo-area">
                                <img src={Logo} alt="Logo" width="200"/>
                            </div>
                            <div className="form-area">
                                { Boolean(this.state.error) &&
                                    <Alert severity="warning" className="form-alert">
                                        {this.state.error}
                                    </Alert>
                                } 
                                <form onSubmit={this.resolve} className="form">
                                    <TextField 
                                        label="E-mail"
                                        className="form-input"
                                        onChange={this.handleChange('email')} 
                                        inputProps={{ autoComplete: 'email', id: 'cm-email' }}
                                    />
                                    <TextField label="Senha" className="form-input"
                                        onChange={this.handleChange('password')} 
                                        type={this.state.passwordVisibility ? 'text' : 'password'}
                                        InputProps={{ 
                                            autoComplete: 'password',
                                            id: 'cm-password',
                                            endAdornment: <InputAdornment position="end">
                                                <IconButton onClick={() => this.tooglePasswordVisibility()}>
                                                    <Icon>{this.state.passwordVisibility ? 'visibility_off' : 'visibility'}</Icon>
                                                </IconButton>
                                            </InputAdornment>
                                        }}
                                    />
                                    <small 
                                        className="forgot-password" 
                                        onClick={() => this.toogleRescuePassword()}
                                    >
                                        Não consegue acessar sua conta?
                                    </small>
                                    <Recaptcha 
                                        sitekey={CAPTCHA_SITE_KEY}
                                        ref={ref => this.recaptchaRef = ref}
                                        onResolved={this.signIn}
                                        onError={() => this.captchaError()}
                                        onExpired={() => this.captchaError()}
                                        locale="pt-br"
                                    />
                                    <Grid item xs={12} className="form-button">
                                        <CustomButtonBase type="submit" onClick={this.resolve} disabledIcon={true} class="defaultMaxWidth" loading={this.state.loading} text={this.state.loading ? 'Entrando...' : 'Entrar'}/>
                                    </Grid>
                                </form>
                            </div>
                        </div>
                    }
                    { this.state.rescuePassword &&
                        <Fade in={this.state.rescuePassword}>
                            <RedeemAccount back={() => this.toogleRescuePassword()} />
                        </Fade>
                    }
                    {this.state.redirect &&
                        <Redirect to="/"/>
                    }
                </Grid>
            </Box>
            
        )
    }
}

const mapStateToProps = state => ({user: state.user, menu: state.menu})
const mapDispatchToProps = dispatch => bindActionCreators({setUser, setMenu}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Auth)