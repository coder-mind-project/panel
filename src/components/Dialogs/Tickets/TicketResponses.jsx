import React, { Component } from 'react'

import {Grid, Box, Dialog, DialogActions, DialogContent,
        DialogTitle, Button, TextField, Typography, Icon} from '@material-ui/core'


class TicketResponses extends Component {

    state = {
        open: true,
        handleClose: () => null,

    }

    componentDidMount(){
        this.setState({
            handleClose: this.props.onClose,
        })
    }

    render(){
        return (
            <Dialog
                open={this.state.open}
                onClose={this.state.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <DialogTitle id="alert-dialog-title">
                    Respostas do ticket {this.props.ticket._id}
                </DialogTitle>
                <DialogContent>
                    <Grid item xs={12}>
                        { this.props.ticket && <Box width="100%" display="flex" alignItems="flex-start" flexDirection="column">
                            { this.props.ticket.content.responses.map( response => (
                                <Box width="100%" p={1} display="flex" alignItems="flex-start" key={response.index}>
                                    <Box mr={2} height="100%" display="flex" alignItems="flex-start">
                                        {response.index}.
                                    </Box>
                                    <Box width="100%" display="flex" flexDirection="column" justifyContent="center">
                                        <TextField
                                            label="Atendente"
                                            value={response.adminId}
                                            fullWidth={true}
                                        />
                                        <TextField
                                            label="Mensagem"
                                            value={response.msg}
                                            fullWidth={true}
                                            multiline={true}
                                            rows="5"
                                        />
                                    </Box>
                                </Box>
                            ))}
                            {this.props.ticket.content.responses.length === 0 && 
                                <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                                    <Icon color="error" fontSize="large">
                                        clear
                                    </Icon>
                                    <Typography component="p" variant="body1">Este ticket não possui respostas</Typography>
                                </Box>
                            }
                        </Box>}
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

export default TicketResponses