import React, { Component } from 'react'
import { Container, Grid, Box,
        Divider, Icon, Typography, Card,
        CardContent, CardActions } from '@material-ui/core'
import { Link, Redirect } from 'react-router-dom'
import { displayFullDate } from '../../config/masks'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faIdCard } from "@fortawesome/free-solid-svg-icons"
import Header from '../../components/Header.jsx'

import ShortcutSection from '../../components/pages-component/Management/ShortcutSection.jsx'
import ThemesAndCategoriesSection from '../../components/pages-component/Management/ThemesAndCategoriesSection.jsx'
import Button from '../../components/Button.jsx'
import FloatingButton from "../../components/FloatingButton.jsx";

import '../css/defaultPage.css'
import './css/Management.css'

import axios from 'axios'

import {backendUrl, defineErrorMsg} from '../../config/backend'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { success, error } from '../../config/toasts'
import { callToast } from '../../redux/toastActions'

class Management extends Component {

    state = {
        redirectTo: '',
        sincronizing: false,
        lastSincronization: ''
    }

    goTo = path => this.setState({redirectTo: `/${path}`})

    toogleSincronizing(){
        this.setState({sincronizing: !this.state.sincronizing})
    }

    getLastSincronization(){
        const url = `${backendUrl}/stats/sincronization`

        axios(url).then(res => {
            if(res.data && res.data.generatedAt)
                this.setState({lastSincronization: displayFullDate(res.data.generatedAt)})
        }).catch(async err => {
            const msg = await defineErrorMsg(err)
            this.props.callToast(error(msg))
        })
    }

    async sincronize(){
        this.toogleSincronizing()

        const url = `${backendUrl}/stats/sincronization`

        await axios.post(url).then(res => {
            this.setState({lastSincronization: displayFullDate(res.data.generatedAt)})
            this.props.callToast(success('Sincronização realizada com sucesso'))
        }).catch(async err => {
            const msg = await defineErrorMsg(err)
            this.props.callToast(success(msg))
        })
        this.toogleSincronizing()
    }

    componentDidMount(){
        this.getLastSincronization()
    }

    render() {
        return (
            <Container className="managements" id="component">
                <FloatingButton icon="keyboard_arrow_up" action={() => document.documentElement.scrollTop = 0} />
                {this.state.redirectTo &&
                    <Redirect to={this.state.redirectTo}/>
                }
                <Header title="Configurações"
                    description="Configure propriedades da aplicação: como temas e categorias de artigos, Sincronizador e outras configurações"
                    icon="settings"
                />
                { this.props.user && this.props.user.tagAdmin &&
                    <ShortcutSection />
                }
                <ThemesAndCategoriesSection user={this.props.user} />
                { this.props.user.tagAdmin && <Grid item xs={12}>
                    <Box id="sincronizer" width="100%" display="flex" alignItems="center">
                        <Box mr={1}>
                            <Icon>autorenew</Icon>
                        </Box>
                        <h3>Definições de agendador</h3>
                    </Box>
                    <span>
                        Este agendador é referênte a sincrozinação das bases de dados da aplicação, tenha certeza do que esteja fazendo ao utilizar desse recurso.
                    </span>
                    <Box mt={3} mb={3} display="flex" flexWrap="wrap" alignItems="center">
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center">
                                    <Box mr={1} display="flex" alignItems="center">
                                        <Icon>
                                            refresh
                                        </Icon>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <h3>
                                            Sincronizar estatísticas
                                        </h3>
                                    </Box>
                                </Box>
                                <Typography>Ao clicar as informações serão sincronizadas manualmente</Typography>
                                { this.state.lastSincronization && <Typography>
                                    Ultima Sincronização: {this.state.lastSincronization}
                                </Typography>}
                            </CardContent>
                            <CardActions>
                                <Box width="100%" ml={2} mr={2}>
                                    <Button color="default"
                                            text={this.state.sincronizing ? 'Sincronizando...' : 'Sincronizar'}
                                            icon="done"
                                            onClick={() => this.sincronize()}
                                            loading={this.state.sincronizing}
                                            disabled={this.state.sincronizing}
                                    />
                                </Box>
                            </CardActions>
                        </Card>
                    </Box>
                </Grid>}

                { this.props.user.tagAdmin && <Grid item xs={12}><Divider/></Grid>}

                { this.props.user.tagAdmin && <Grid item xs={12}>
                    <Box mb={3}>
                        <Box width="100%" display="flex" alignItems="center">
                            <Box mr={1}>
                                <Icon>people</Icon>
                            </Box>
                            <h3>Gerenciamento</h3>
                        </Box>
                        <span>
                            Gerencie usuários da plataforma, visualize e responda a tickets de atendimento aos autores da plataforma.
                        </span>
                    </Box>
                    <Box width="100%" display="flex" flexWrap="wrap" alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Card className="card-management">
                                <CardContent>
                                    <Box id="users" display="flex" alignItems="center">
                                        <Box mr={1} display="flex" alignItems="center">
                                            <Icon>
                                                person
                                            </Icon>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <h3>
                                                Usuários
                                            </h3>
                                        </Box>
                                    </Box>
                                    <Typography>
                                        Crie perfis para autores, administradores para acesso a plataforma. Usuários de tipos diferentes possui acesso a diferentes funcionalidades.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Box width="100%" ml={2} mr={2}>
                                        <Link to="/users" className="linkRouter">
                                            <Button color="default"
                                                icon="exit_to_app"
                                                text="Acessar"
                                            />
                                        </Link>
                                    </Box>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card className="card-management">
                                <CardContent>
                                    <Box id="tickets" display="flex" alignItems="center">
                                        <Box mr={1} display="flex" alignItems="center">
                                            <FontAwesomeIcon icon={faIdCard} size="1x"/>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <h3>
                                                Tickets
                                            </h3>
                                        </Box>
                                    </Box>
                                    <Typography>
                                        Visualize, responda, mantenha respostas e veja atividades relacionadas a tickets. Sendo o meio de comunicação entre os usuários e a plataforma Coder Mind.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Box width="100%" ml={2} mr={2}>
                                        <Link to="/tickets" className="linkRouter">
                                            <Button color="default"
                                                icon="exit_to_app"
                                                text="Acessar"
                                            />
                                        </Link>
                                    </Box>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Box>
                </Grid>}
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user})
const mapDispatchToProps = dispatch => bindActionCreators({callToast: callToast }, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Management)
