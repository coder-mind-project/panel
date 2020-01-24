import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import axios from 'axios'

import Avatar from 'react-avatar'

import { backendUrl, defineErrorMsg } from '../../../config/backend'

import { Grid, Icon, Box, Divider } from '@material-ui/core'
    
import './css/ArticlePreview.css'

class ArticlePreview extends Component {
    
    state = {
        article: {},
        loading: false,
        error: false,
    }

    toogleLoading(){
        this.setState({
            loading: !this.state.loading
        })
    }

    formatDate(date){
        const aux = date.split('T')
        let dayMonthYear = aux[0].split('-')
        dayMonthYear = `${dayMonthYear[2]}/${dayMonthYear[1]}/${dayMonthYear[0]}`
        
        let hours = aux[1].split('.')[0]

        return `${dayMonthYear} - ${hours}`
    }

    async componentDidMount(){
        await this.toogleLoading()
        const id = this.props.article._id

        if(!id){
            document.querySelector("#article-content").innerHTML = this.props.article.textArticle

            return this.setState({
                article: this.props.article,
                loading: false
            })
        }
        
        const url = `${backendUrl}/articles/management/${id}`

        axios(url).then(res => {
            this.setState({article: res.data})

            document.querySelector("#article-content").innerHTML = res.data.textArticle

        }).catch( async error => {
            this.setState({error: true})
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>))
        })

        this.toogleLoading()
    }


    render() { 
        return (
            <Grid className="article-wrapper">
                { this.state.article && !this.state.loading &&
                    <Grid item xs={12} className="article-content">
                        { this.state.article.bigImg && 
                            <Grid item xs={12} className="article-header">
                                <img src={`${backendUrl}/${this.state.article.bigImg}`} alt={this.state.article.longDescription}/>
                            </Grid>
                        }
                        <Grid item xs={12} className="article-title">
                            <h1>{this.state.article.title}</h1>
                        </Grid>
                        <Grid item xs={12} className="article-short-description">
                            <h2 className="short-description">{this.state.article.shortDescription}</h2>
                        </Grid>
                        <Grid item xs={12} className="header-hud-bar">
                            <Box display="flex" justifyContent="center" alignItems="center" mr={1} ml={1}>
                                <Box mr={1} display="flex" alignItems="center">
                                    <Avatar src={ this.state.article.author ? `${backendUrl}/${this.state.article.author.profilePhoto}` : ''} name={this.state.article.author ? this.state.article.author.name : this.props.user.name} size={30} round={true} />
                                </Box>
                                <p>{this.state.article.author ? this.state.article.author.name : this.props.user.name}</p>
                            </Box>
                            {this.state.article.theme && this.state.article.theme.name &&
                                <Box display="flex" alignItems="center" justifyContent="center" mr={1} ml={1}>
                                    <Box mr={1}>
                                        <Icon>class</Icon>
                                    </Box>
                                    <p>{this.state.article.theme.name}</p>
                                </Box>
                            }
                            {this.state.article.category && this.state.article.category.name &&
                                <Box display="flex" alignItems="center" justifyContent="center" mr={1} ml={1}>
                                    <Box mr={1}>
                                        <Icon>class</Icon>
                                    </Box>
                                    <p>{this.state.article.category.name}</p>
                                </Box>
                            }
                            { this.state.article.publishAt && <Box display="flex" justifyContent="center" alignItems="center" mr={1} ml={1}>
                                <p>Publicado em: {`${this.formatDate(this.state.article.publishAt)}`}</p>
                            </Box>}
                        </Grid>
                        </Grid>
                    }
                <Divider className="divider" />  
                <Grid item xs={12} id="article-content"></Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(ArticlePreview)