import React, { Component } from 'react'

import Loading from '../assets/loading.gif'

import { Container, Paper, Box } from '@material-ui/core'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheckCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons'

import { backendUrl, defineErrorMsg } from '../config/backend' 
import axios from 'axios'

import './css/ConfirmEmail.css'
import './css/defaultPage.css'

class ConfirmEmail extends Component {

    state = {
        loading: false,
        success: false,
        error: false
    }

    formatParamsSearchUrl(search){
        let s = search.replace('?', '')

        s = s.split('&')
        
        let params = {}
        
        for (let i = 0; i < s.length; i++) {
            const keyValue = s[i].split('=')
            const key = keyValue[0]
            const value = keyValue[1] || null

            params[key] = value    
        }

        return params
    }

    toogleLoading(){
        this.setState({loading: !this.state.loading})
    }

    async confirmEmail(){
        const search = this.props.location.search
        const params = this.formatParamsSearchUrl(search)

        if(!params.token){
            window.location.href = '/auth'
        }

        this.toogleLoading()

        const url = `${backendUrl}/users/settings`

        const data = {
            token: params.token
        }

        const method = params.rt ? 'post' : 'patch'

        await axios[method](url, data).then( response => {
            this.setState({
                success: response.data || true 
            })

            if(!params.rt) localStorage.removeItem('user')
        }).catch( error => {
            const msg = defineErrorMsg(error)
            this.setState({error: msg})
        })

        this.toogleLoading()
    }

    componentDidMount(){
        this.confirmEmail()
    }

    render(){
        return (
            <Container id="component">
                <Paper className="paper-container-confirm-email">
                    { this.state.loading &&
                        <Box width="100%" pt={4} pb={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                            <img src={Loading} alt="Carregando..." />
                            <span>Confirmando e-mail...</span>
                        </Box>
                    }
                    { this.state.success && !this.state.error &&
                        <Box width="100%" display="flex" alignItems="center" justifyContent="center" flexWrap="wrap" p={2}>
                            <Box display="flex" alignItems="center" mr={2}>
                                <FontAwesomeIcon icon={faCheckCircle} size="5x" color="#28a745"/>
                            </Box>
                            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                <h3>{this.state.success ? this.state.success : 'E-mail confirmado com sucesso!'}</h3>
                            </Box>
                        </Box>
                    }
                    { this.state.error && !this.state.success &&
                        <Box width="100%" display="flex" alignItems="center" justifyContent="center" flexWrap="wrap" p={2}>
                            <Box display="flex" alignItems="center" mr={2}>
                                <FontAwesomeIcon icon={faTimesCircle} size="5x" color="#dc3545"/>
                            </Box>
                            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                <h3>{this.state.error ? this.state.error : 'Ocorreu um erro desconhecido, se persistir reporte!'}</h3>
                            </Box>
                        </Box>
                    }
                </Paper>
            </Container>
        )
    }
}


export default ConfirmEmail