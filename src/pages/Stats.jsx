import React, {Component} from 'react'
import {Container, Grid, Box, Icon, Paper,
    TableHead, TableBody, TableCell, TableRow,
    Table, Divider, Button} from '@material-ui/core'
import {connect} from 'react-redux'

import Header from '../components/Header.jsx'
import StatsBlock from '../components/StatsBlock.jsx'
import CustomButtom from '../components/Button.jsx'

import { displayFullDate } from '../config/masks'
import axios from 'axios'
import { backendUrl } from '../config/backend'
import { APP_VERSION, APP_BUILD } from '../config/dataProperties'

import GeolocalizationModal from '../components/Geolocalization/Modal.jsx'

import { toast } from 'react-toastify'

import './css/Stats.css'

class Stats extends Component{

    state = {
        lastViews: [],
        loadingLastViews: false,
        lastLikes: [],
        loadingLikes: false,
        views: {},
        comments: {},
        likes: {},

        loadingStats: false,

        dialogModal: false,
        ipSelected: '',
    }

    toogleLoadingLikes(){
        this.setState({loadingLikes: !this.state.loadingLikes})
    }

    toogleLoadingLastViews(){
        this.setState({loadingLastViews: !this.state.loadingLastViews})
    }

    toogleLoadingStats(){
        this.setState({loadingStats: !this.state.loadingStats})
    }

    async getLastLikes(){
        await this.toogleLoadingLikes()
        const url = `${backendUrl}/likes`
        await axios(url).then(res => {
            if(res.data.likes.length === 0){
                toast.info((<div className="centerVertical"><Icon className="marginRight">warning</Icon>Nenhuma avaliação encontrada</div>))
            }
            this.setState({lastLikes: res.data.likes})
        })
        this.toogleLoadingLikes()
    }

    async getLastViews(){
        await this.toogleLoadingLastViews()
        const url = `${backendUrl}/views`
        await axios(url).then(res => {
            if(res.data.views.length === 0){
                toast.info((<div className="centerVertical"><Icon className="marginRight">warning</Icon>Nenhuma visualização encontrada</div>))
            }
            this.setState({lastViews: res.data.views})
        })
        this.toogleLoadingLastViews()
    }

    async getStats(){
        const url = `${backendUrl}/stats`
        await this.toogleLoadingStats()
        await axios(url).then( res => {
            this.setState({
                views: res.data.views,
                comments: res.data.comments,
                likes: res.data.likes
            })
        })
        this.toogleLoadingStats()
    }

    async toogleDialogModal(ipAddress){
        await this.setState({ipSelected: !this.state.dialogModal ? ipAddress : ''})
        
        this.setState({
            dialogModal: !this.state.dialogModal
        })
    }
    
    componentDidMount(){
        this.getStats()
    }


    render(){
        return(
            <Container>
                <Header icon="assessment" title="Estatísticas" description="Bem vindo ao painel Coder Mind"/>
                <Grid item xs={12} className="stats-blocks">
                    <Grid item xs={12} md={4}>
                        <StatsBlock icon="touch_app" loading={this.state.loadingStats} title="Visualizações por mês" loadingMsg="Obtendo visualizações" data={this.state.views} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatsBlock icon="thumb_up" loading={this.state.loadingStats} title="Curtidas por mês" loadingMsg="Obtendo avaliações" data={this.state.likes} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatsBlock icon="comment" loading={this.state.loadingStats} title="Comentários por mês" loadingMsg="Obtendo comentários" data={this.state.comments} />
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
                                            <TableCell align="right"><Button size="small" variant="text" color="secondary" onClick={() => this.toogleDialogModal(view.reader)} className="">{view.reader}</Button></TableCell>
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
                    <Box mt={3} mb={3} width="100%"><Divider /></Box>
                    <Grid item xs={12}>
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
                                <CustomButtom text={this.state.loadingLikes ? 'Carregando...' : 'Carregar ultimas avaliações'} icon="thumb_up" loading={this.state.loadingLikes} onClick={() => this.getLastLikes()} fullWidth />
                            }
                            { this.state.lastLikes.length > 0 && !this.state.loadingLastViews &&
                                <Paper className="stats-wrapper-table">
                                    <Table size="small" className="stats-table">
                                    <TableHead>
                                        <TableRow>
                                        <TableCell>Artigo</TableCell>
                                        <TableCell align="right">Leitor (IP)</TableCell>
                                        <TableCell align="right">Data da avaliação</TableCell>
                                        <TableCell align="right">Like Ativo</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.lastLikes.map(like => (
                                        <TableRow key={like._id}>
                                            <TableCell scope="row">
                                                {like.article.title}
                                            </TableCell>
                                            <TableCell align="right"><Button size="small" variant="text" color="secondary" onClick={() => this.toogleDialogModal(like.reader)} className="">{like.reader}</Button></TableCell>
                                            <TableCell align="right">{displayFullDate(like.created_at)}</TableCell>
                                            <TableCell align="right">{like.confirmed ? 'Sim' : 'Não'}</TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                    </Table>
                                </Paper>
                            }
                        </Box>
                    </Grid>
                    { this.state.dialogModal && <GeolocalizationModal closeDialog={() => this.toogleDialogModal()} ipAddress={this.state.ipSelected}/> }
                    <Grid item xs={12}>
                        <Box width="100%" display="flex" alignItems="center" mt={5}>
                            <Box mr={1}>
                                <Icon>
                                    code
                                </Icon>
                            </Box>
                            <Box>
                                <h3>Informações Nerds</h3>
                            </Box>
                        </Box>
                        <Box width="100%" display="flex" alignItems="center">
                            <Box>
                                <p>Versão da aplicação: {APP_VERSION}</p>
                                <p>Build: {APP_BUILD}</p>
                                <p>Desenvolvido por: Allan Wanderley Alves</p>
                                <p>Copyright: Coder Mind</p>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(Stats)