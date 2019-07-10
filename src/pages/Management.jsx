import React, { Component } from 'react'
import { Container, Grid, Paper, Box,
        Typography, Divider, Icon } from '@material-ui/core'
import { Redirect } from 'react-router-dom'

import Button from '../components/Button.jsx'

import './defaultPage.css'
import './css/Management.css'

class Management extends Component {

    state = {
        redirectTo: ''
    }

    goTo = path => this.setState({redirectTo: `/${path}`})

    render() {
        return (
            <Container>
                {this.state.redirectTo && 
                    <Redirect to={this.state.redirectTo}/>
                }
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
                                    <Button color="default" fullWidth={true}
                                        text="Acessar" 
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
                                    <Button color="default" fullWidth={true}
                                        text="Acessar"
                                        onClick={() => this.goTo('categories')}
                                    />
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