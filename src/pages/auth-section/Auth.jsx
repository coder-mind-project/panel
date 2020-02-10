import React, { Component } from 'react'
import { Paper, Grid, TextField,
        CircularProgress, FormControl,
        InputLabel, Box, Fade, LinearProgress } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Redirect } from 'react-router-dom'
import PasswordField from 'material-ui-password-field'

import ButtonBase from '../../components/ButtonBase.jsx'
import RedeemAccount from '../../components/RedeemAccount.jsx'

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

    imgs = ['background-image1','background-image2']
    
    state = { 
        email: '',
        password: '',
        response: null,
        rescuePassword: false,
        loading: false,
        redirect: false,
        currentImg: 0,

        reloadCaptcha: false,
        error: null
        
    }

    toogleRescuePassword(){
        this.setState({rescuePassword: !this.state.rescuePassword})
    }

    resolve = (event) => {
        event.preventDefault()

        // Caso ja esteja carregando não será possível mandar nova autenticação 
        if(this.state.loading) return

        this.setState({loading: true})
        
        this.recaptchaRef.execute()
    }

    signIn = async () => {
        /* Resposável por realizar a autenticação */

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
            this.reloadCaptcha()
            this.setState({loading: false, error: msg})
        })
    }

    async reloadCaptcha(){
        await this.setState({ reloadCaptcha: true })
        this.setState({ reloadCaptcha: false })
    }

    handleChange = attr => event => {
        const value = event.target.value
        this.setState({
            [attr]: value
        })
    }
    
    verifyUser = async () => {
        /*  Verifica se existe um usuário logado, e assim redireciona a pagina
        em caso de detecção de autenticação ativa 
        */
        const user = await localStorage.getItem('user')
        if(user) this.setState({redirect: true}) 
    }
    
    componentDidMount(){
        this.verifyUser()
    }

    render() { 
        return (
            <div className="container">
                { !this.state.rescuePassword &&
                    <Paper className="modal">
                        { this.state.loading && <LinearProgress color="secondary" />}
                        <Grid item xs={12} className="modalTitle">
                            <img src={Logo} alt="Logo" width="180"/>
                        </Grid>
                        <form onSubmit={this.resolve}>
                            <Grid item xs={12} className="modalForm">
                                    <TextField label="E-mail" className="modalFormInput"
                                        fullWidth onChange={this.handleChange('email')} 
                                        inputProps={{ autoComplete: 'email' }}
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="password">Senha</InputLabel>
                                        <PasswordField id="password" 
                                            inputProps={{ autoComplete: 'current-password' }} 
                                            fullWidth onChange={this.handleChange('password')}
                                        />
                                    </FormControl>
                                <small className="fakeLink" onClick={() => this.toogleRescuePassword()}>Esqueceu seu e-mail/senha?</small>
                                <Box className="captchaArea">
                                    { !this.state.reloadCaptcha && 
                                        <Recaptcha 
                                            sitekey={CAPTCHA_SITE_KEY}
                                            ref={ref => this.recaptchaRef = ref}
                                            onResolved={this.signIn}
                                        />
                                    }
                                </Box>
                                { Boolean(this.state.error) && <Alert severity="warning">{this.state.error}</Alert>} 
                            </Grid>
                            <Grid item xs={12} className="button-area">
                                <ButtonBase class="defaultMaxWidth" type="submit" disableIcon={true} text={this.state.loading ? <span className="centerInline"><CircularProgress size={20} color="inherit" /><span className="marginLeft">Entrando...</span></span> : 'Entrar'}/>
                            </Grid>
                        </form>
                    </Paper>
                }
                { this.state.rescuePassword &&
                    <Fade in={this.state.rescuePassword}>
                        <RedeemAccount back={() => this.toogleRescuePassword()} />
                    </Fade>
                }
                {this.state.redirect &&
                    <Redirect to="/"/>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({user: state.user, menu: state.menu})
const mapDispatchToProps = dispatch => bindActionCreators({setUser, setMenu}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Auth)