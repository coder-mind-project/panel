import React, { Component } from 'react'

import {FormControl, Dialog, DialogActions,
    DialogContent, DialogTitle, Button, InputLabel, Icon,
    LinearProgress, DialogContentText} from '@material-ui/core'

import PasswordField from 'material-ui-password-field'
import { backendUrl, defineErrorMsg } from '../../../config/backend'
import axios from 'axios'
import { toast } from 'react-toastify'

class RemoveAccount extends Component {

    state = {
        open: true,
        handleClose: () => null,
        removing: false,
        password: ''
    }

    toogleRemoving(){
        this.setState({removing: !this.state.removing})
    }

    handleChange = attr => event => {
        const value = event.target.value
        this.setState({
            [attr]: value
        })
    }

    async remove(){

        this.toogleRemoving()

        const url = `${backendUrl}/users/configs/${this.props.user._id}`

        const payload = {
            password: this.state.password
        }

        await axios.put(url, payload).then( () => {
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon>Conta removida com sucesso, aguarde alguns segundos... Estamos lhe redirecionando</div>), {autoClose: 5000, closeOnClick: true})
            setTimeout(async () => {
                await localStorage.removeItem('user')
                window.location.href = '/'
            }, 5000)
        }).catch( async error => {
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 3000, closeOnClick: true})
        })

        this.toogleRemoving()
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
                disableBackdropClick={this.state.removing}
                disableEscapeKeyDown={this.state.removing}
            >
                { this.state.removing && <LinearProgress color="secondary" />}
                <DialogTitle id="alert-dialog-title">
                    Remover conta
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ao remover sua conta, será possível recuperá-la ao entrar em contato com o administrador, <strong>confirme a exclusão informando sua senha atual.</strong>
                    </DialogContentText>
                    <form onSubmit={(evt) => this.remove(evt)}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="current-password">Senha</InputLabel>
                            <PasswordField id="current-password" 
                                inputProps={{ autoComplete: 'current-password' }} 
                                fullWidth onChange={this.handleChange('password')}
                                autoFocus={true}
                            />
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={this.state.handleClose}
                        disabled={this.state.removing}
                    >
                        Fechar
                    </Button>
                    <Button 
                        onClick={() => this.remove()} 
                        color="secondary"
                        disabled={this.state.removing}
                    >
                        {this.state.removing ? 'Removendo...' : 'Confirmar'}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default RemoveAccount