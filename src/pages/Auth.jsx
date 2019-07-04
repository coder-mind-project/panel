import React, { Component } from 'react'
import {Container, Paper, Grid, TextField,
        CircularProgress, FormControl, InputLabel} from '@material-ui/core'
import {Clear} from '@material-ui/icons'
import PasswordField from 'material-ui-password-field'
import {ToastContainer, toast} from 'react-toastify'

import Logo from '../assets/estudante_ti1.png'
import CustomButton from '../components/Button.jsx'
import './Auth.css'
import './defaultPage.css'

//Redux
import {setUser} from '../redux/userActions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import axios from 'axios'
import {backendUrl} from '../config/backend'

import {Redirect} from 'react-router-dom'


class Auth extends Component {
    props = this.props

    state = { 
        email: '',
        password: '',
        rescuePassword: false,
        loading: false,
        accessGranted: false
    }

    signIn = () => async event => {
        const user = {
            email: this.state.email,
            password: this.state.password
        }

        this.setState({loading: true})

        const url = `${backendUrl}/signIn`
        await axios.post(url, user).then( async res => {

            await this.props.setUser(res.data)
            
            localStorage.setItem('user', JSON.stringify(res.data))
            
            await this.setState({
                accessGranted: true
            })
        }).catch(error => {
            toast.error((<div className="centerVertical"><Clear className="marginRight"></Clear>{error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'}</div>), {autoClose: 3000, closeOnClick: true})
        })

        this.setState({loading: false})
    }

    handleChange = attr => async event => {
        const value = event.target.value
        await this.setState({
            [attr]: value
        })
    }

    render() { 
        return (
            <Container className="container">
                <ToastContainer/>
                {this.state.accessGranted && <Redirect to="/stats"/>}
                <Paper className="modal">
                    <Grid item xs={12} className="modalTitle">
                        <img src={Logo} alt="Logo" width="180"/>
                    </Grid>
                    <Grid item xs={12} className="modalForm">
                        <form>
                        <TextField label="E-mail" className="modalFormInput" fullWidth onChange={this.handleChange('email')} inputProps={{
                                autoComplete: 'username'
                            }}/>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="password">Senha</InputLabel>
                            <PasswordField id="password" inputProps={{
                                autoComplete: 'current-password'
                            }} fullWidth onChange={this.handleChange('password')}/>
                        </FormControl>
                        </form>
                        <small className="fakeLink">Esqueceu seu e-mail/senha?</small>
                    </Grid>
                    <Grid item xs={12}>
                        <CustomButton color="default" fullWidth={true} disableIcon={true} text={this.state.loading ? <span className="centerInline"><CircularProgress size={20} color="inherit" /><span className="marginLeft">Entrando...</span></span> : 'Entrar'} onClick={this.signIn()}/>
                    </Grid>
                </Paper>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return ({user: state.user})
}
const mapDispatchToProps = dispatch => bindActionCreators({setUser}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Auth)