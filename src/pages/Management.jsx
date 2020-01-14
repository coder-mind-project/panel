import React, { Component } from 'react'
import { Container, Grid, Paper, Box,
        Divider, Icon, Typography, Card,
        CardContent, CardActions } from '@material-ui/core'
import { Link, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import { displayFullDate } from '../config/masks'

import Header from '../components/Header.jsx'

import Button from '../components/Button.jsx'

import './css/defaultPage.css'
import './css/Management.css'

import axios from 'axios'

import {backendUrl, defineErrorMsg} from '../config/backend'
import { connect } from 'react-redux'

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
            this.setState({lastSincronization: displayFullDate(res.data.generatedAt)})
        }).catch(async error => {
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon><span>{msg}</span></div>), {autoClose: 3000, closeOnClick: true})
        })
    }
    
    async sincronize(){
        this.toogleSincronizing()

        const url = `${backendUrl}/stats/sincronization`
        
        await axios.post(url).then(res => {
            this.setState({lastSincronization: displayFullDate(res.data.generatedAt)})
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon><span>Sincronização realizada com sucesso</span></div>), {autoClose: 3000, closeOnClick: true})
        }).catch(async error => {
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon><span>{msg}</span></div>), {autoClose: 3000, closeOnClick: true})
        })
        this.toogleSincronizing()
    }

    componentDidMount(){
        this.getLastSincronization()
    }

    render() {
        return (
            <Container className="managements" id="component">
                {this.state.redirectTo && 
                    <Redirect to={this.state.redirectTo}/>
                }
                <Header title="Configurações" 
                    description="Configure propriedades da aplicação: como temas e categorias de artigos, Sincronizador e outras configurações"
                    icon="settings"
                />
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <Box ml={2} mr={2} mt={5} mb={3}>
                            <Paper className="blockOption">
                                <Grid item xs={12} className="centerInline">
                                    <Icon className="superIcon">
                                        bookmark
                                    </Icon>
                                    <h2>
                                        Temas
                                    </h2>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider/>
                                </Grid>
                                <Grid item xs={12} className="description">
                                    <h4>
                                        Crie, altere e remova temas.
                                    </h4>
                                    <h5>
                                        Estes temas são relacionados aos artigos, 
                                        isto é, configure os temas disponibilizados 
                                        para a inclusão e edição de artigos.
                                    </h5>
                                </Grid>
                                <Grid item xs={12} className="accessButton">
                                    <Button color="default" fullWidth={true}
                                        text="Acessar"
                                        icon="exit_to_app" 
                                        onClick={() => this.goTo('themes')}
                                    />
                                </Grid>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box ml={2} mr={2} mt={5} mb={3}>
                            <Paper className="blockOption">
                            <Grid item xs={12} className="centerInline">
                                    <Icon className="superIcon">
                                        category
                                    </Icon>
                                    <h2>
                                        Categorias
                                    </h2>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider/>
                                </Grid>
                                <Grid item xs={12} className="description">
                                    <h4 component="p" variant="body2">
                                        Crie, altere e remova categorias.
                                    </h4>
                                    <h5 component="p" variant="body2">
                                        Estas categorias são relacionados aos artigos, 
                                        isto é, configure as categorias disponibilizadas 
                                        para a inclusão e edição de artigos.
                                    </h5>
                                </Grid>
                                <Grid item xs={12} className="accessButton">
                                    <Button color="default" fullWidth={true}
                                        text="Acessar"
                                        icon="exit_to_app"
                                        onClick={() => this.goTo('categories')}
                                    />
                                </Grid>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
                { this.props.user.tagAdmin && <Grid item xs={12}><Divider/></Grid>}
                
                { this.props.user.tagAdmin && <Grid item xs={12}>
                    <Box width="100%" display="flex" alignItems="center">
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
                    <Box width="100%" display="flex" alignItems="center">
                        <Box mr={1}>
                            <Icon>people</Icon>
                        </Box>
                        <h3>Usuários</h3>
                    </Box>
                    <span>
                        Crie perfis para autores, administradores para acesso a plataforma. Usuários de tipos diferentes possui acesso a diferentes funcionalidades.
                    </span>
                    <Box mt={3} display="flex" flexWrap="wrap" alignItems="center">
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center">
                                    <Box mr={1} display="flex" alignItems="center">
                                        <Icon>
                                            person
                                        </Icon>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <h3>
                                            Visualizar usuários
                                        </h3>
                                    </Box>
                                </Box>
                                <Typography>
                                    Visualize, atualize, crie e remove cadastros de usuários da plataforma
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
                    </Box>
                </Grid>}
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user})


export default connect(mapStateToProps)(Management)