import React, { Component } from 'react'
import {Container, Grid, Paper, Box, Typography, Divider} from '@material-ui/core'
import {Bookmark, Category} from '@material-ui/icons'
import './defaultPage.css'
import './Management.css'
import {Redirect} from 'react-router-dom'
import Button from '../components/Button.jsx'


class Management extends Component {
    state = {
        redirectTo: ''
    }

    goTo = path => event => this.setState({redirectTo: `/${path}`})

    render() {
        return (
            <Container>
                {this.state.redirectTo && <Redirect to={this.state.redirectTo}/> }
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <Box ml={2} mr={2} mt={5} mb={3}>
                            <Paper className="blockOption">
                                <Grid item xs={12} className="centerInline">
                                    <Bookmark className="superIcon"/>
                                    <Typography component="h4" variant="h4">Temas</Typography>
                                </Grid>
                                <Grid item xs={12}><Divider/></Grid>
                                <Grid item xs={12} className="description">
                                    <Typography component="p" variant="body2">
                                        Crie, altere e remova temas.
                                    </Typography>
                                    <Typography component="p" variant="body2">
                                        Estes temas são relacionados aos artigos, 
                                        isto é, configure os temas disponibilizados 
                                        para a inclusão e edição de artigos.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className="accessButton">
                                    <Button color="default" fullWidth={true} text="Acessar" onClick={this.goTo('themes')}>Acessar</Button>
                                </Grid>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box ml={2} mr={2} mt={5} mb={3}>
                            <Paper className="blockOption">
                            <Grid item xs={12} className="centerInline">
                                    <Category className="superIcon"/>
                                    <Typography component="h4" variant="h4">Categorias</Typography>
                                </Grid>
                                <Grid item xs={12}><Divider/></Grid>
                                <Grid item xs={12} className="description">
                                    <Typography component="p" variant="body2">
                                        Crie, altere e remova categorias.
                                    </Typography>
                                    <Typography component="p" variant="body2">
                                        Estas categorias são relacionados aos artigos, 
                                        isto é, configure as categorias disponibilizadas 
                                        para a inclusão e edição de artigos.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className="accessButton">
                                <Button color="default" fullWidth={true} text="Acessar" onClick={this.goTo('categories')}>Acessar</Button>
                                </Grid>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        )
    }
}


export default Management