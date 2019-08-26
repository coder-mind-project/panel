import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

import { Container, Grid, Select,
    Input, FormControl, InputLabel, MenuItem, Box } from '@material-ui/core'
import SearchBar from 'material-ui-search-bar'

import CustomButton from '../components/Button.jsx'
import Header from '../components/Header.jsx'
import ArticleBlock from '../components/Articles/ArticleBlock.jsx'
import FloatingButton from '../components/FloatingButton'
import Searching from '../assets/searching.gif'
import NotFound from '../components/NotFound.jsx'

import axios from 'axios'
import { backendUrl } from '../config/backend'
import { OPTIONS_LIMIT , DEFAULT_LIMIT, ERROR_MSG_CUSTOM, SAUDATION_LOADING_MSG } from '../config/dataProperties'

import './css/defaultPage.css'

export default class Articles extends Component {
    
    state = {
        loading: true,
        error: false,
        articles: [],
        query: '',
        page: 1,
        limit: DEFAULT_LIMIT,
        count: 0, 
        redirectTo: ''
    }

    
    async changeQueryValue(query){
        /* Realiza a busca de artigo por palavra chave */
        await this.setState({
            query,
            page: 1
        })
        this.searchArticles()
    }
    
    async searchArticles(){
        /* Responsável por realizar a busca de artigos */

        const url = `${backendUrl}/articles?query=${this.state.query}&page=${this.state.page}&limit=${this.state.limit}&op=all`
        if(this.state.articles.length > 0) this.setState({articles: []})
        if(!this.state.loading) this.setState({loading: true})
        await axios(url).then(async res => {
            this.setState({
                articles: res.data.articles,
                loading: false,
                error: false,
                count: res.data.count,
                limit: res.data.limit
            })
        }).catch(error => {
            this.setState({
                error: true,
                loading: false
            })
        })
    }

    handleChange = attr => async event => {
        const value = event.target.value

        await this.setState({[attr]: value})
        if(attr === 'limit') this.searchArticles()
    }


    goTo = path => event => {
        this.setState({redirectTo: path})
    }

    changePage = action => async event => {
        /* Responsável por alterar a página de visualização de artigos */
        
        if(action !== 'next' && action !== 'back') return
        
        let currentPage = this.state.page
        await this.setState({
            page: action === 'next' ? ++currentPage : --currentPage
        })

        this.searchArticles()
    }

    componentDidMount(){
        this.searchArticles()
    }
    
    render (){
        return (
            <Container>
                <Header title="Artigos" 
                    description="Consulte, altere e crie novos artigos" 
                    icon="description"
                />
                {this.state.redirectTo && 
                    <Redirect to={`/${this.state.redirectTo}`} />
                }
                <Container className="hudBar">
                    <Grid item className="hudBarChild">
                        <Link to="/article" className="linkRouter linkButton"><CustomButton text="Novo artigo" icon="add_circle_outline" color="default" /></Link>
                    </Grid>
                    <Grid item className="hudBarChild">
                        <FormControl className="limitInput">
                            <InputLabel htmlFor="limit">Limite</InputLabel>
                            <Select input={<Input name="limit" id="limit"></Input>} 
                                value={this.state.limit}
                                onChange={this.handleChange('limit')}
                            >
                            {OPTIONS_LIMIT.map(option => {
                                return <MenuItem value={option} key={option}>{option}</MenuItem>
                            })}
                            </Select>
                        </FormControl>
                        <SearchBar id="search_field" className="searchTextField"
                            placeholder="Pesquisar" value={this.state.query}
                            onChange={(query) => this.changeQueryValue(query)}
                            onCancelSearch={() => this.changeQueryValue('')}
                        />
                    </Grid>
                </Container>
                <Container>
                    <FloatingButton icon="add" action={this.goTo('article')} />
                    {this.state.loading && 
                        <Container className="center spinnerContainer">
                            <img src={Searching} alt={SAUDATION_LOADING_MSG} />
                            <h4>
                                Procurando artigos, por favor aguarde...
                            </h4>
                        </Container>
                    }
                    {!this.state.loading && this.state.articles.length > 0 && 
                        this.state.articles.map((article, key) => 
                            <ArticleBlock article={article} key={article._id} />)
                    }
                    {!this.state.loading && this.state.articles.length === 0 && !this.state.error &&
                        <NotFound msg="Ops! Nenhum artigo encontrado" />
                    }
                    {this.state.error &&
                        <NotFound msg={ERROR_MSG_CUSTOM} />
                    }
                </Container>
                {!this.state.loading && !this.state.error &&
                    <Container className="footList">
                        <Box mt={1} display="flex" flexWrap="wrap">
                            <span className="defaultFontColor marginRight">
                                Total de registros: {this.state.count}
                            </span>
                            <span className="defaultFontColor marginRight">
                                |
                            </span>
                            <span className="defaultFontColor marginRight">
                                Página: {this.state.page}
                            </span>
                        </Box>
                        <Box display="flex" flexWrap="wrap" mt={1}>
                            {this.state.page > 1 &&
                                <Box mr={1} mb={1}>
                                    <CustomButton color="defaultOutlined" 
                                        icon="arrow_back" text="Anterior"
                                        className="buttonFootList"
                                        onClick={this.changePage('back')}
                                    />
                                </Box>
                            }
                            {this.state.articles.length > 0 && 
                                <Box mr={1} mb={1}>
                                    <CustomButton color="defaultOutlined"
                                        icon="arrow_forward" text="Próxima"
                                        className="buttonFootList"
                                        onClick={this.changePage('next')}
                                    />
                                </Box>
                            }
                        </Box>
                    </Container>
                }
            </Container>        
        )
    }
}