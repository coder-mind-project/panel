import React, { Component } from 'react'
import { Container, ExpansionPanel, ExpansionPanelSummary,
        ExpansionPanelDetails, Grid, Icon, Box,
        CircularProgress, Divider } from '@material-ui/core'

import Header from '../components/Header.jsx'

import GeneralInformation from '../components/myAccount/GeneralInformation.jsx'
import ExtraInformation from '../components/myAccount/ExtraInformation.jsx'
import Configurations from '../components/myAccount/Configurations.jsx'

import { connect } from 'react-redux'

import axios from 'axios'
import { backendUrl } from '../config/backend'

import { ToastContainer } from 'react-toastify'

import './css/defaultPage.css'

class MyAccount extends Component {
    
    state = { 
        expanded: false,
        user: null,
        loading: true,
        error: false
    }

    handleChangeExpanded = panel => (event, isExpanded) => {
        this.setState({
            expanded: isExpanded ? panel : false,
            user: this.props.user
        })
    }

    toogleLoading = () =>{
        this.setState({loading: !this.state.loading})
    }

    getUser = async () => {
        const id = this.props.user._id
        if(id){
            const url = `${backendUrl}/users/${id}`
            await axios(url).then( res => {
                this.setState({user: res.data})
            }).catch( () => {
                this.setState({error: true, user: null})
            })
            this.toogleLoading()
        }

    }

    componentDidMount(){
        if(!this.state.user){
            this.getUser()
        }
    }
    
    componentDidUpdate(){
        if(!this.state.user){
            this.getUser()
        }
    }

    render() { 
        return ( 
            <Container>
                <Header icon="account_box" title="Meus dados" description="Altere e gerencie informações de sua conta" />
                <ToastContainer/>
                {this.state.user && !this.state.loading &&
                    <Grid item xs={12}>
                        <ExpansionPanel expanded={this.state.expanded === 'general_information'}
                            onChange={this.handleChangeExpanded('general_information')}
                        >
                                <ExpansionPanelSummary
                                    expandIcon={<Icon>expand_more</Icon>}
                                    aria-controls="general_information"
                                    id="general_information_header"
                                >
                                    <Grid item xs={12}>
                                        <Grid item xs={12} className="betweenInline">
                                            <Box display="flex" alignItems="center">
                                                <Icon className="marginRight">
                                                    person
                                                </Icon>
                                                <h4>
                                                    Informações principais
                                                </h4>
                                            </Box>
                                            <small className="defaultFontColor">
                                                Dados gerais e essenciais para seu cadastro
                                            </small>
                                        </Grid>
                                        <Divider className="separator"/>
                                    </Grid>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <GeneralInformation user={this.state.user} />
                                </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel expanded={this.state.expanded === 'extra_information'}
                            onChange={this.handleChangeExpanded('extra_information')}
                        >
                                <ExpansionPanelSummary
                                    expandIcon={<Icon>expand_more</Icon>}
                                    aria-controls="extra_information"
                                    id="extra_information_header"
                                >
                                    <Grid item xs={12}>
                                        <Grid item xs={12} className="betweenInline">
                                            <Box display="flex" alignItems="center">
                                                <Icon className="marginRight">
                                                    public
                                                </Icon>
                                                <h4>
                                                    Redes sociais e comunicação
                                                </h4>
                                            </Box>
                                            <small className="defaultFontColor">
                                                Informe suas redes sociais para seus leitores
                                            </small>
                                        </Grid>
                                        <Divider className="separator"/>
                                    </Grid>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <ExtraInformation user={this.state.user} />
                                </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel expanded={this.state.expanded === 'configurations'}
                            onChange={this.handleChangeExpanded('configurations')}
                        >
                                <ExpansionPanelSummary
                                    expandIcon={<Icon>expand_more</Icon>}
                                    aria-controls="configurations"
                                    id="configurations_header"
                                >
                                    <Grid item xs={12}>
                                        <Grid item xs={12} className="betweenInline">
                                            <Box display="flex" alignItems="center">
                                                <Icon className="marginRight">
                                                    settings
                                                </Icon>
                                                <h4>
                                                    Configurações
                                                </h4>
                                            </Box>
                                            <small className="defaultFontColor">
                                                Acesse configurações ou remova sua conta
                                            </small>
                                        </Grid>
                                        <Divider className="separator"/>
                                    </Grid>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Configurations user={this.state.user} />
                                </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>
                }
                { this.state.loading && 
                    <Grid item xs={12}>
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                            <CircularProgress />
                            <h4>Carregando suas informações, por favor aguarde...</h4>
                        </Box>
                    </Grid>
                }
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(MyAccount)