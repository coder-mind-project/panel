import React, {Component} from 'react'
import {Container, Grid, Box, Icon, Paper, TableHead, TableBody, TableCell, TableRow, Table} from '@material-ui/core'
import {connect} from 'react-redux'

import Header from '../components/Header.jsx'
import StatsBlock from '../components/StatsBlock.jsx'
import CustomButtom from '../components/Button.jsx'

import { displayFullDate } from '../config/masks'
import axios from 'axios'
import {backendUrl} from '../config/backend'

import './css/Stats.css'

class Stats extends Component{

    state = {
        lastViews: [],
        loadingLastViews: false,
        lastLikes: [],
        loadingLikes: false,
        views: {},
        comments: {},
    }

    toogleLoadingLikes(){
        this.setState({loadingLikes: !this.state.loadingLikes})
    }

    toogleLoadingLastViews(){
        this.setState({loadingLastViews: !this.state.loadingLastViews})
    }

    async getLastLikes(){
        await this.toogleLoadingLikes()
        const url = `${backendUrl}/...`
        await axios(url).then(res => {
            this.setState({lastViews: res.data.views})
        })
        //this.toogleLoadingLikes()
    }

    async getLastViews(){
        await this.toogleLoadingLastViews()
        const url = `${backendUrl}/views`
        await axios(url).then(res => {
            this.setState({lastViews: res.data.views})
        })
        this.toogleLoadingLastViews()
    }
    
    getViews(){
        const url = `${backendUrl}/views/stats`
        axios(url).then(res => {
            this.setState({views: res.data})
        })
    }

    async getComments(){
        const url = `${backendUrl}/comments/stats`
        await axios(url).then(res => {
            this.setState({comments: res.data})
        })
    }
    
    componentDidMount(){
        this.getViews()
        this.getComments()
    }


    render(){
        return(
            <Container>
                <Header icon="assessment" title="Estatísticas" description="Bem vindo ao painel Coder Mind"/>
                <Grid item xs={12} className="stats-blocks">
                    <Grid item xs={12} md={4}>
                        <StatsBlock icon="touch_app" title="Visualizações por mês" loadingMsg="Obtendo visualizações" data={this.state.views} />
                    </Grid>
                    {/*<Grid item xs={12} md={4}>
                        <StatsBlock icon="touch_app" title="Visualizações por mês" loadingMsg="Obtendo avaliações" data={{}} />
                    </Grid>*/}
                    <Grid item xs={12} md={4}>
                        <StatsBlock icon="comment" title="Comentários por mês" loadingMsg="Obtendo comentários" data={this.state.comments} />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <Box>
                            <Box width="100%" display="flex" alignItems="center">
                                <Box mr={1}>
                                    <Icon>
                                        access_time
                                    </Icon>
                                </Box>
                                <Box>
                                    <h3>Ultimas visualizações</h3>
                                </Box>
                            </Box>
                            { this.state.lastViews.length === 0 && 
                                <CustomButtom text={this.state.loadingLastViews ? 'Carregando...' : 'Carregar visualizações'} icon="av_timer" loading={this.state.loadingLastViews} onClick={() => this.getLastViews()} fullWidth />
                            }
                            { this.state.lastViews.length > 0 && !this.state.loadingLastViews &&
                                <Paper className="stats-wrapper-table">
                                    <Table size="small" className="stats-table">
                                    <TableHead>
                                        <TableRow>
                                        <TableCell>Artigo</TableCell>
                                        <TableCell align="right">Leitor (IP)</TableCell>
                                        <TableCell align="right">Data de leitura</TableCell>
                                        <TableCell align="right">Quantidade de acessos</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.lastViews.map(view => (
                                        <TableRow key={view._id}>
                                            <TableCell scope="row">
                                            {view.article.title}
                                            </TableCell>
                                            <TableCell align="right">{view.reader}</TableCell>
                                            <TableCell align="right">{displayFullDate(view.startRead)}</TableCell>
                                            <TableCell align="right">{view.viewsQuantity}</TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                    </Table>
                                </Paper>
                            }
                        </Box>
                    </Grid>
                    {/*<Grid item xs={12}>
                        <Box>
                            <Box width="100%" display="flex" alignItems="center">
                                <Box mr={1}>
                                    <Icon>
                                        thumbs_up_down
                                    </Icon>
                                </Box>
                                <Box>
                                    <h3>Ultimas avaliações</h3>
                                </Box>
                            </Box>
                            { this.state.lastLikes.length === 0 && 
                                <CustomButtom text={this.state.loadingLikes ? 'Carregando...' : 'Carregar avaliações'} icon="thumb_up" loading={this.state.loadingLikes} onClick={() => this.getLastLikes()} fullWidth />
                            }
                            { this.state.lastLikes.length > 0 && !this.state.loadingLastViews &&
                                <Paper className="stats-wrapper-table">
                                    <Table size="small" className="stats-table">
                                    <TableHead>
                                        <TableRow>
                                        <TableCell>Artigo</TableCell>
                                        <TableCell align="right">Leitor (IP)</TableCell>
                                        <TableCell align="right">Data da avaliação</TableCell>
                                        <TableCell align="right">Quantidade de acessos</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.lastLikes.map(view => (
                                        <TableRow key={view._id}>
                                            <TableCell scope="row">
                                            {view.article.title}
                                            </TableCell>
                                            <TableCell align="right">{view.reader}</TableCell>
                                            <TableCell align="right">{view.startRead}</TableCell>
                                            <TableCell align="right">{view.viewsQuantity}</TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                    </Table>
                                </Paper>
                            }
                        </Box>
                    </Grid>*/}
                </Grid>
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(Stats)