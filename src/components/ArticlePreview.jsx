import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import axios from 'axios'

import Avatar from 'react-avatar'
import ReactQuill from 'react-quill'

import { backendUrl, defineErrorMsg } from '../config/backend'
import { displayDate } from '../config/masks'

import { Grid, Icon, Box, Typography, Container,
    CircularProgress, Divider } from '@material-ui/core'
    
import DefaultBigImg from '../assets/img_not_found_1080.png'

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

    async componentDidMount(){
        await this.toogleLoading()
        const id = this.props.article._id

        if(!id) return this.setState({
            article: this.props.article,
            loading: false
        })
        
        const url = `${backendUrl}/article/${id}`

        axios(url).then(res => {
            this.setState({article: res.data})
        }).catch( async error => {
            this.setState({error: true})
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>))
        })

        this.toogleLoading()
    }


    render() { 
        return (
            <Container>
                { !this.state.loading && this.state.article && !this.state.error &&
                    <Grid container className="article_content">
                        <Grid item xs={12}>
                            <img src={ this.state.article.bigImg ?
                            `${backendUrl}/${this.state.article.bigImg}` : DefaultBigImg}
                            alt={this.state.article.longDescription ? this.state.article.longDescription : 'Imagem de titulo do artigo'} 
                            width="100%" className="article_big_image"/>
                        </Grid>
                        <Grid item xs={12}>
                            <h1>{ this.state.article._id ? this.state.article.title : this.props.article.title}</h1>
                            <Divider/>
                            <p>
                                {this.state.article._id ? this.state.article.shortDescription : this.props.article.shortDescription}
                            </p>
                        </Grid>
                        <Grid item xs={12} className="headerinfos">
                            <Box display="flex" alignItems="center" mb={1}>
                                <Avatar githubHandle="allanalves23" size={40} round="20px" />
                                <Box ml={1}>
                                    <small>
                                        {this.state.article.author ? this.state.article.author.name : this.props.user.name }
                                    </small>
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="center" mb={1}>
                                <Box mr={1}>
                                    <small>
                                        Criado em: { this.state.article.createdAt ? displayDate(this.state.article.createdAt) : `Em produção...`}
                                    </small>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} className="previewArticle">
                            <ReactQuill value={this.state.article._id ? this.state.article.textArticle : this.props.article.textArticle} readOnly={true} theme={null}></ReactQuill>
                        </Grid>
                    </Grid>
                }
                { this.state.loading && 
                    <Grid container>
                        <Grid item xs={12}>
                            <Box display="flex" m={5} p={5} flexDirection="column" alignItems="center">
                                <CircularProgress />
                                <Typography variant="body1" component="p">
                                    Carregando...
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                }
                { !this.state.loading && this.state.error && 
                    <Grid container>
                        <Grid item xs={12}>
                            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" m={5} p={5}>
                                <Typography variant="body1" component="p">
                                    Ops, algo deu errado! 
                                </Typography>
                                <Typography variant="body1" component="p">
                                    Tente recarregar a página, se persistir reporte!
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                }
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(ArticlePreview)