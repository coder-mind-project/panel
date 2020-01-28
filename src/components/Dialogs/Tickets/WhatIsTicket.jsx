import React, { Component } from 'react'

import {Grid, Box, Dialog, DialogActions, DialogContent,
        DialogTitle, Button} from '@material-ui/core'


class WhatIsTicket extends Component {

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
                    O que é ticket?
                </DialogTitle>
                <DialogContent>
                    <Grid item xs={12}>
                        <Box width="100%" display="flex" alignItems="center" flexDirection="column">
                            <p>Ticket é a via de comunicação entre administradores e autores sobre quaisquer assuntos técnicos da plataforma.</p>
                            <p>Todo problema relacionado a plataforma, sugestão de melhorias, reporte de bugs devem ser comunicados aqui.</p>
                            <p>Informe o tipo de ticket e em seguida envie sua mensagem, você será respondido em breve!</p>
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

export default WhatIsTicket