import React, {Component} from 'react'

import { Grid, Paper, FormControl,
    InputLabel, CircularProgress, Box, Icon,
    Button } from '@material-ui/core'
import PasswordField from 'material-ui-password-field'
import ButtonBase from '../../components/ButtonBase.jsx'

import { Redirect } from 'react-router-dom'

import Logo from '../../assets/coder-mind-painelv1-preto.png'
import Loading from '../../assets/loading-circular.gif'

import axios from 'axios'

import { backendUrl, defineErrorMsg } from '../../config/backend'


import '../css/defaultPage.css'
import './css/RedeemAccount.css'
import { toast } from 'react-toastify'

class RedeemAccount extends Component {
    
    _isMounted = false

    state = {
        tokenError: false,
        tokenInvalid: false,
        loading: false,
        confirming: false,
        authorized: false,
        user: {},
        passwords: {
            firstField: '',
            secondField: '',
            user: ''
        }
    }

    verifyToken = async () =>{
        this.toogleLoading()

        const payload = await this.collectToken()

        if(!payload) return this.setState({tokenInvalid: true})

        const url = `${backendUrl}/redeem-password`
        if(this._isMounted){
            await axios.post(url, payload).then( async res => {
                    this.setState({
                        user: res.data,
                        loading: false,
                        authorized: true,
                        passwords: {
                            ...this.state.passwords,
                            user: res.data._id
                        }
                    })
            }).catch(error => {
                    const msg = defineErrorMsg(error)
                    toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 8000, closeOnClick: true})
                    this.setState({tokenError: true})
                    this.toogleLoading()
            })
        }
    }

    async collectToken(){
        if(!this.props.location.search) return false
        
        let search = this.props.location.search.replace('?', '')
        const match = search.match(/token/)
        
        if(!match) return false

        search = search.replace('&','=').split('=')

        const payload = {}
        
        await search.forEach((elem, index) => {
            if(elem === 'token') {
                payload.token = search[index+1]
            }
        })

        return payload
    }

    handleChange = (evt, attr) => {
        this.setState({
            ...this.state,
            passwords: {
                ...this.state.passwords,
                [attr]: evt.target.value
            }
        })
    }

    toogleLoading(){
        this.setState({loading: !this.state.loading})
    }

    toogleConfirming(){
        this.setState({confirming: !this.state.confirming})
    }

    async changePassword(evt){
        evt.preventDefault()

        const url = `${backendUrl}/redeem-password`
        const data = this.state.passwords
        
        this.toogleConfirming()

        await axios.patch(url, data).then( res => {
            const msg = res.data
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon>{msg}</div>), {autoClose: 3000, closeOnClick: true})
            setTimeout(() => {
                window.location.href = "/auth"
            },3000)
        }).catch(error => {
            const msg = defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">close</Icon>{msg}</div>), {autoClose: 3000, closeOnClick: true})
        })

        this.toogleConfirming()
    }

    goTo(path){
        window.location.href = path
    }

    componentDidMount(){
        this._isMounted = true
        this.verifyToken()
    }

    componentWillUnmount() {
        this._isMounted = false
    }


    render(){
        return (
            <div className="redeem-account-container">
                <Paper className="modal">
                    <Grid item xs={12} className="modalTitle">
                        <img src={Logo} alt="Logo" width="180"/>
                    </Grid>
                    { this.state.tokenInvalid && <Redirect to="/auth"/>}
                    { !this.state.loading && this.state.authorized && <form onSubmit={ (evt) => this.changePassword(evt)}>
                        <Grid item xs={12} className="modalForm">
                            <Box width="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                <h3>Recuperação de senha</h3>
                                <small>Olá {this.state.user.name}, informe a nova senha</small>
                            </Box>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="new-password">Insira sua senha</InputLabel>
                                <PasswordField id="new-password" 
                                    inputProps={{ autoComplete: 'current-password' }} 
                                    fullWidth onChange={(evt) => this.handleChange(evt, 'firstField')}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="confirm-password">Confirme sua senha</InputLabel>
                                <PasswordField id="confirm-password" 
                                    inputProps={{ autoComplete: 'current-password' }} 
                                    fullWidth onChange={(evt) => this.handleChange(evt, 'secondField')}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} className="button-area">
                            <ButtonBase class="defaultMaxWidth" type="submit" disableIcon={true} text={this.state.confirming ? <span className="centerInline"><CircularProgress size={20} color="inherit" /><span className="marginLeft">Por favor aguarde... </span></span> : 'Confirmar'}/>
                        </Grid>
                    </form>}
                    { this.state.loading && 
                        <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center"  mt={2} mb={5}>
                            <Box width="100%" display="flex" alignItems="center" justifyContent="center" mb={2}>
                                <img src={Loading} alt="Loading" width="30%"/>
                            </Box>
                            <span>Por favor, aguarde...</span>
                        </Box>
                    }
                    {
                        this.state.tokenError && 
                        <Grid item xs={12}>
                            <Box width="100%" display="flex" justifyContent="center" flexWrap="wrap" alignItems="center">
                                <Box m={3}>
                                    <Icon fontSize="large">highlight_off</Icon>
                                </Box>
                                <Box mr={2}>
                                    <h3>Ops, não foi possível recuperar o seu token.</h3>
                                    <h3>Tente solicitar uma nova recuperação de senha e tente novamente, se persistir reporte.</h3>
                                </Box>
                            </Box>
                            <Box width="100%" display="flex" justifyContent="center" alignItems="center" mb={3} mt={2}>
                                <Button color="secondary" variant="contained" onClick={() => this.goTo('/auth')}>Ir para o Login</Button>
                            </Box>
                        </Grid>
                    }
                </Paper>
            </div>
        )
    }
}

export default RedeemAccount