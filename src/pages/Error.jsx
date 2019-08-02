import React, { Component } from 'react'
import { Container, Box, Paper } from '@material-ui/core'

import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import BrokenRobot from '../assets/broken-robot-extra-small.png'

import Button from '../components/Button.jsx'
import './css/Error.css'

class Error extends Component {
    
    redirect(){
        window.location = "/articles"
    }
    
    render() { 
        return ( 
            <Container className="modal_error">
                { !this.props.error && 
                    <Redirect to="/articles" />
                }
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Paper className="modal_error_block">
                        <Box className="modal_error_content">
                            <Box className="modal_error_logo">
                                <h2>Erro de sistema</h2>
                            </Box>
                            <Box className="modal_error_msg">
                                <p>Ops, Ocorreu um problema inesperado.</p>
                                <p>Tente recarregar a página, se o problema persitir tente novamente mais tarde</p>
                            </Box>
                            <Box>
                                <Button fullWidth={true} icon="cached" 
                                    text="Recarregar"
                                    
                                    onClick={() => this.redirect()} 
                                />
                            </Box>
                        </Box>
                        <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                            <img src={BrokenRobot} alt="Erro de sistema"/>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        )
    }
}

const mapStateToProps = state => ({error: state.error})
export default connect(mapStateToProps)(Error)