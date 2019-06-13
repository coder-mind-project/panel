import React, {Component} from 'react'
import Container from '@material-ui/core/Container'
import Loading from '@material-ui/core/CircularProgress'
import axios from 'axios'

import Header from '../components/Header.jsx'
import ArticleBlock from '../components/ArticleBlock.jsx'


export default class Articles extends Component {

    constructor(props){
        super(props)
        this.state = {
            loading: true,
            error: false,
            articles: []
        }
    }

    async componentWillMount(){
        const url = 'http://localhost:3001/articles'
        await axios(url).then(res => {
            this.setState({
                articles: res.data,
                loading: false,
                error: false
            })
        }).catch(error => {
            this.setState({
                error: true
            })
        })
    }


    render (){
        return (
            <Container>
                <Header title="Artigos" description="Artigos do sistema"/>
                <Container>
                    {this.state.loading && <Loading />}
                    {!this.state.loading && this.state.articles.length > 0 && this.state.articles.map((article, key) => <ArticleBlock title={article.title} description={article.description} author={article.author} _id={article._id} key={article._id} />)}
                    {this.state.error && <p>Ocorreu um erro ao realizar a requisição</p>}
                </Container>
            </Container>        
        )
    }
}