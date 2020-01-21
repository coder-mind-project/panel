import React, { Component } from 'react'
import { Container, ExpansionPanel, ExpansionPanelSummary,
        ExpansionPanelDetails, Grid, Icon, Box,
        Divider } from '@material-ui/core'

import Header from '../components/Header.jsx'

import GeneralInformation from '../components/ComponentPages/MyAccount/GeneralInformation.jsx'
import ExtraInformation from '../components/ComponentPages/MyAccount/ExtraInformation.jsx'
import Configurations from '../components/ComponentPages/MyAccount/Configurations.jsx'
import Searching from '../assets/loading.gif'

import { connect } from 'react-redux'

import axios from 'axios'
import { backendUrl } from '../config/backend'

import './css/defaultPage.css'

class MyAccount extends Component {
    
    state = { 
        expanded: false,
        user: null,
        loading: false,
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
            await this.toogleLoading()
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
    
    render() { 
        return ( 
            <Container id="component">
                <Header icon="account_box" title="Meus dados" description="Altere e gerencie informações de sua conta" />
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
                {this.state.loading && 
                    <Container className="center spinnerContainer">
                        <img src={Searching} alt="Obtendo suas informações..."/>
                        <h4>
                            Carregando, por favor aguarde...
                        </h4>
                    </Container>
                }
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(MyAccount)