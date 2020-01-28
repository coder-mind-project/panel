import React, { Component } from 'react'
import {    
        Dialog, DialogTitle, DialogContent,
        DialogContentText, DialogActions, Button,
        CircularProgress, TextField, Box, Divider, Icon
    } from '@material-ui/core'
import axios from 'axios'
import { ipinfo, ipinfoToken } from '../../../config/backend'

class GeoModal extends Component {
    state = { 
        open: true,
        searching: false,
        error: false,
        handleClose: () => null,
        reader: {}
    }

    async componentDidMount(){
        await this.setState({
            handleClose: this.props.closeDialog
        })

        this.getGeolocalizationInfo(this.props.ipAddress)
    }

    toogleLoading(){
        this.setState({searching: !this.state.searching})
    }

    async getGeolocalizationInfo(address){
        const ip = address
        const url = `${ipinfo}/${ip}?token=${ipinfoToken}`

        await this.toogleLoading()

        await axios(url).then(res => {
            this.setState({
                reader: res.data
            })
        }).catch(error => {
            this.setState({error})
        })

        this.toogleLoading()
    }

    render() { 
        return ( 
            <Dialog
                open={this.state.open}
                onClose={this.state.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Sobre o leitor
                </DialogTitle>
                <DialogContent>
                    { this.state.searching &&
                        <Box p={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                            <CircularProgress color="secondary"/>
                            <Box mt={1} mb={1}>
                                <span>Carregando informações, por favor aguarde...</span>
                            </Box>
                        </Box>
                    }
                    { !this.state.searching && !this.state.error &&
                        <Box p={1}>
                            <DialogContentText>Informações de rede</DialogContentText>
                            <TextField label="Endereço IP" fullWidth value={this.state.reader.ip || 'Não definido'} disabled margin="dense" />
                            <TextField label="Hostname" fullWidth value={this.state.reader.hostname || 'Não definido'} disabled margin="dense" />
                            <TextField label="Provedor de rede" fullWidth value={this.state.reader.org || 'Não definido'} disabled margin="dense" />
                            <Box width="100%" mt={2} mb={1}>
                                <Divider />
                            </Box>
                            <DialogContentText>Informações de localização</DialogContentText>
                            <TextField label="País" fullWidth value={this.state.reader.country || 'Não definido'} disabled margin="dense" />
                            <TextField label="Região" fullWidth value={this.state.reader.region || 'Não definido'} disabled margin="dense" />
                            <TextField label="Cidade" fullWidth value={this.state.reader.city || 'Não definido'} disabled margin="dense" />
                        </Box>
                    }
                {!this.state.searching && this.state.error &&
                    <Box p={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                        <Icon fontSize="large" color="secondary">clear</Icon>
                        <Box mt={1} mb={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                            <span>Ops! Ocorreu um erro ao obter as informações...</span>
                            <Box p={1}>
                                {typeof this.state.error === 'string' ? this.state.error : `Erro interno da api, consulte o desenvolvedor.`}
                            </Box>
                        </Box>
                    </Box>
                }
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.state.handleClose} color="secondary" autoFocus>
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default GeoModal;