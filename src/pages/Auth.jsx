import React, { Component } from 'react'
import { Container, Paper, Grid, TextField,
        CircularProgress, FormControl,
        InputLabel , Icon, Box,Fade} from '@material-ui/core'
import { Redirect } from 'react-router-dom'
import PasswordField from 'material-ui-password-field'
import { toast } from 'react-toastify'

import ButtonBase from '../components/ButtonBase.jsx'
import RedeemAccount from './RedeemAccount.jsx'

import { setUser } from '../redux/userActions'
import { setMenu } from '../redux/menuActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import axios from 'axios'
import { backendUrl, defineErrorMsg } from '../config/backend'

import ReCAPTCHA from "react-google-recaptcha"

import Logo from '../assets/logo-gestao-preto.png'

import './css/Auth.css'
import './css/defaultPage.css'


class Auth extends Component {
    props = this.props
    
    
    state = { 
        email: '',
        password: '',
        response: null,
        rescuePassword: false,
        loading: false,
        redirect: false,

        reloadCaptcha: false,
    }

    toogleRescuePassword(){
        this.setState({rescuePassword: !this.state.rescuePassword})
    }

    signIn = async (event) => {
        /* Resposável por realizar a autenticação */

        event.preventDefault()

        // Caso ja esteja carregando não será possível mandar nova autenticação 
        if(this.state.loading) return

        const user = {
            email: this.state.email,
            password: this.state.password,
            response: this.state.response,
        }

        this.setState({loading: true})

        const url = `${backendUrl}/auth`
        await axios.post(url, user).then( async res => {

            await this.props.setUser(res.data)
            await this.props.setMenu(true)

            localStorage.setItem('user', JSON.stringify({token: res.data.token}))
            
            await this.setState({
                redirect: true,
                loading: false
            })
            
        }).catch(async error => {
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 3000, closeOnClick: true})
            await this.setState({loading: false, reloadCaptcha: true})
            this.setState({reloadCaptcha: false})
        })
        
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
            <Container className="container">
                { !this.state.rescuePassword &&
                    <Paper className="modal">
                        <Grid item xs={12} className="modalTitle">
                            <img src={Logo} alt="Logo" width="180"/>
                        </Grid>
                        <form onSubmit={this.signIn}>
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
                                        <ReCAPTCHA 
                                            size="compact"
                                            sitekey="6LePkK8UAAAAACKAocqyAEB2YQr4cnd3j8Ya2b2U"
                                            onChange={(response) => this.setState({response}) }
                                        />
                                    }
                                </Box>
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
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user, menu: state.menu})
const mapDispatchToProps = dispatch => bindActionCreators({setUser, setMenu}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Auth)