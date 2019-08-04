import React, {Component} from 'react'
import {Container, Grid} from '@material-ui/core'
import {connect} from 'react-redux'

import Header from '../components/Header.jsx'
import StatsBlock from '../components/StatsBlock.jsx'

import axios from 'axios'
import {backendUrl} from '../config/backend'

import './css/Stats.css'

class Stats extends Component{

    state = {
        views: {},
        comments: {},
    }

    
    async getViews(){
        const url = `${backendUrl}/views/stats`
        await axios(url).then(res => {
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
                    <Grid item xs={12} md={4}>
                        <StatsBlock icon="touch_app" title="Visualizações por mês" loadingMsg="Obtendo avaliações" data={{}} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatsBlock icon="comment" title="Comentários por mês" loadingMsg="Obtendo comentários" data={this.state.comments} />
                    </Grid>
                </Grid>
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(Stats)