import React, { Component } from 'react'

import {Grid, Box, Divider, Dialog, DialogActions, DialogContent, DialogTitle, Button} from '@material-ui/core'

import {APP_VERSION, APP_BUILD} from '../../config/dataProperties'

class MoreInfo extends Component {

    state = {
        open: true,
        handleClose: () => null,

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
            >
                <DialogTitle id="alert-dialog-title">
                    Informações sobre o software
                </DialogTitle>
                <DialogContent>
                    <Grid item xs={12}>
                        <Box width="100%" display="flex" alignItems="center">
                            <Box>
                                <p>Usuário autenticado: {this.props.user.name}</p>
                                <p>Perfil: {this.props.user.tagAdmin ? 'Administrador' : 'Autor'}</p>
                            </Box>
                        </Box>
                        <Divider />
                        <Box width="100%" display="flex" alignItems="center">
                            <Box>
                                <p>Versão da aplicação: {APP_VERSION}</p>
                                <p>Build: {APP_BUILD}</p>
                                <p>Desenvolvido por: Allan Wanderley Alves</p>
                                <p>Copyright: Coder Mind</p>
                            </Box>
                        </Box>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.state.handleClose} color="secondary" autoFocus>
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default MoreInfo