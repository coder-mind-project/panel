import React, { Component } from 'react'

import {Grid, Box, FormControl, Dialog, DialogActions,
    DialogContent, DialogTitle, Button, InputLabel,
    LinearProgress, Slide} from '@material-ui/core'

import PasswordField from 'material-ui-password-field'
import { backendUrl, defineErrorMsg } from '../../../config/backend'
import axios from 'axios'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { callToast } from '../../../redux/toast/toastActions'
import { success, error } from '../../../config/toasts'

class ChangeMyPassword extends Component {

    state = {
        open: true,
        handleClose: () => null,
        password: '',
        authorized: false,
        authorizing: false,
        saving: false,
        newPass: {
            firstField: '',
            secondField: ''
        }

    }

    handleChange = attr => event => {
        const value = event.target.value
        this.setState({
            [attr]: value
        })
    }

    handlePassword = attr => event => {
        const value = event.target.value
        this.setState({
            ...this.state,
            newPass: {
                ...this.state.newPass,
                [attr]: value
            }
        })
    }

    toogleAuthorizing(){
        this.setState({authorizing: !this.state.authorizing})
    }

    toogleSaving(){
        this.setState({saving: !this.state.saving})
    }

    submit(evt){
        if(evt) evt.preventDefault()
        return this.state.authorized ? this.changePassword() : this.verifyPassword()
    }

    async verifyPassword(){
        const url = `${backendUrl}/auth/logged`
        const payload = {
            _id: this.props.user._id,
            password: this.state.password
        }

        this.toogleAuthorizing()

        await axios.put(url, payload).then( res => {
            this.setState({authorized: true})
        }).catch(err => {
            const msg = defineErrorMsg(err)
            this.props.callToast(error(msg))
        })

        this.toogleAuthorizing()
    }

    changePassword(){
        const payload = this.state.newPass

        const url = `${backendUrl}/users/${this.props.user._id}`

        this.toogleSaving()

        axios.post(url, payload).then(res => {
            this.props.callToast(success('Senha alterada com sucesso'))
            this.state.handleClose()
        }).catch(err => {
            this.toogleSaving()
            const msg = defineErrorMsg(err)
            this.props.callToast(error(msg))
        })
    }

    componentDidMount(){
        this.setState({
            handleClose: this.props.closeDialog,
        })
    }

    render(){
        return (
            <Dialog
                open={this.state.open}
                onClose={this.state.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                disableBackdropClick={this.state.authorizing || this.state.saving}
                disableEscapeKeyDown={this.state.authorizing || this.state.saving}
            >
                { (this.state.authorizing || this.state.saving) && <LinearProgress color="primary" />}
                <DialogTitle id="alert-dialog-title">
                    Alterar senha
                </DialogTitle>
                <DialogContent>
                    <Grid item xs={12}>
                        { !this.state.authorized &&
                            <form onSubmit={(evt) => this.submit(evt)}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="current-password">Informe sua senha atual</InputLabel>
                                    <PasswordField id="current-password"
                                        inputProps={{ autoComplete: 'current-password' }}
                                        fullWidth onChange={this.handleChange('password')}
                                        autoFocus={true}
                                    />
                                </FormControl>
                            </form>
                        }
                        { this.state.authorized &&
                            <Slide direction="right" in={this.state.authorized} mountOnEnter unmountOnExit>
                                <Box width="100%">
                                    <FormControl fullWidth>
                                        <form onSubmit={(evt) => this.submit(evt)}>
                                            <InputLabel htmlFor="new-password">Informe a nova senha</InputLabel>
                                            <PasswordField id="new-password"
                                                inputProps={{ autoComplete: 'new-password' }}
                                                fullWidth onChange={this.handlePassword('firstField')}
                                                autoFocus={true}
                                            />
                                        </form>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <form onSubmit={(evt) => this.submit(evt)}>
                                            <InputLabel htmlFor="confirm-password">Confirme a senha</InputLabel>
                                            <PasswordField id="confirm-password"
                                                inputProps={{ autoComplete: 'new-password' }}
                                                fullWidth onChange={this.handlePassword('secondField')}
                                            />
                                        </form>
                                    </FormControl>
                                </Box>
                            </Slide>
                        }
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={this.state.handleClose}
                        disabled={this.state.authorizing || this.state.saving}
                    >
                        Fechar
                    </Button>
                    <Button
                        onClick={() => this.submit()}
                        color="primary"
                        disabled={this.state.authorizing || this.state.saving}
                    >
                        {this.state.authorizing ? 'Validando...' : this.state.saving ? 'Salvando...' : 'Confirmar'}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const mapStateToProps = state => ({toast: state.config})
const mapDispatchToProps = dispatch => bindActionCreators({callToast: callToast }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ChangeMyPassword)
