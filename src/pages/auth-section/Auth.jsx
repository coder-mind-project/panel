import React, { useState, useEffect, useRef } from 'react'
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


function Auth(props){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rescuePassword, setRescuePassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [redirect, setRedirect] = useState(false)
    const [error, setError] = useState(null)
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [recaptchaToken, setRecaptchaToken] = useState('')

    const recaptchaRef = useRef(null)

    function toogleRescuePassword(){
        setError('')
        setRescuePassword(!rescuePassword)    
    }

    function resolve(event){
        event.preventDefault()
        if(loading) return
        
        setLoading(true)
        recaptchaRef.current.execute()
    }

    function captchaError(){
        recaptchaRef.current.reset()
        setError('Ocorreu um erro no recaptcha, se persistir reporte')
    }

    function handleChange(setAttr){
        return event =>{
            const value = event.target.value
            setAttr(value)
        } 
    }

    function tooglePasswordVisibility(){
        setPasswordVisibility(!passwordVisibility)
    }
    
    async function verifyUser(){
        /*  Verifica se existe um usuário logado, e assim redireciona a pagina
        em caso de detecção de autenticação ativa 
        */
        const user = await localStorage.getItem('user')
        if(user) setRedirect(true) 
    }

    function authFormFocus(){
        const input = document.querySelector('#cm-email')
        if(input) input.focus()
    }
    
    useEffect(() => {
        verifyUser()
    }, [redirect])

    useEffect(() => {
        async function signIn(){
            /* Resposável por realizar a autenticação */
            
            const response = recaptchaToken
            
            setRecaptchaToken('')
            
            const user = {
                email,
                password,
                response
            }
            
            const url = `${backendUrl}/auth`
    
            await axios.post(url, user).then( async res => {
                localStorage.setItem('user', JSON.stringify({token: res.data.token}))
                window.open('/', '_self')
            }).catch(async error => {
                const msg = await defineErrorMsg(error)
                setError(msg)
                recaptchaRef.current.reset()
            })
            
            setLoading(false)
        }

        if(recaptchaToken) signIn()

    }, [email, loading, password, recaptchaToken])

    return (
        <Box display="flex" alignItems="center" flexWrap="wrap">
            { !rescuePassword && 
                <Grid item xs={12} md={4} className="pretty-section">
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                        <h1>Painel da Coder Mind</h1>
                        <h2>Aqui você poderá publicar seus artigos e acompanhar sua relevância.</h2>
                        <Box display="flex" alignItems="center" flexDirection="column" mt={2} mb={2}>
                            <Button color="inherit" variant="outlined" className="button" fullWidth={true}>Criar conta</Button>
                            <Button onClick={authFormFocus} color="inherit" variant="outlined" className="button i-have-an-account" fullWidth={true}>Já tenho uma conta</Button>
                        </Box>
                    </Box>
                </Grid>
            }
            <Grid item xs={12} md={!rescuePassword ? 8 : 12} className="container">
                { !rescuePassword &&
                    <div className="auth-section">
                        { loading && <LinearProgress color="primary" />}
                        <div className="logo-area">
                            <img src={Logo} alt="Logo" width="200"/>
                        </div>
                        <div className="form-area">
                            { Boolean(error) &&
                                <Alert severity="warning" className="form-alert">
                                    {error}
                                </Alert>
                            } 
                            <form onSubmit={resolve} className="form">
                                <TextField 
                                    label="E-mail"
                                    className="form-input"
                                    onChange={handleChange(setEmail)} 
                                    inputProps={{ autoComplete: 'email', id: 'cm-email' }}
                                />
                                <TextField label="Senha" className="form-input"
                                    onChange={handleChange(setPassword)} 
                                    type={passwordVisibility ? 'text' : 'password'}
                                    InputProps={{ 
                                        autoComplete: 'password',
                                        id: 'cm-password',
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton onClick={() => tooglePasswordVisibility()}>
                                                <Icon>{passwordVisibility ? 'visibility_off' : 'visibility'}</Icon>
                                            </IconButton>
                                        </InputAdornment>
                                    }}
                                />
                                <small 
                                    className="forgot-password" 
                                    onClick={() => toogleRescuePassword()}
                                >
                                    Não consegue acessar sua conta?
                                </small>
                                <Recaptcha 
                                    sitekey={CAPTCHA_SITE_KEY}
                                    ref={ref => recaptchaRef.current = ref}
                                    onResolved={(token => setRecaptchaToken(token))}
                                    style={{zIndex: 1}}
                                    onError={() => captchaError()}
                                    onExpired={() => captchaError()}
                                    locale="pt-br"
                                />
                                <Grid item xs={12} className="form-button">
                                    <CustomButtonBase type="submit" onClick={resolve} disabledIcon={true} class="defaultMaxWidth" loading={loading} text={loading ? 'Entrando...' : 'Entrar'}/>
                                </Grid>
                            </form>
                        </div>
                    </div>
                }
                { rescuePassword &&
                    <Fade in={rescuePassword}>
                        <RedeemAccount back={() => toogleRescuePassword()} />
                    </Fade>
                }
                {redirect &&
                    <Redirect to="/"/>
                }
            </Grid>
        </Box>
        
    )
}

const mapStateToProps = state => ({user: state.user, menu: state.menu})
const mapDispatchToProps = dispatch => bindActionCreators({setUser, setMenu}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Auth)