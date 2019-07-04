import React, {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import CKEditor from 'ckeditor4-react'
import {Container, Divider, Grid, TextField,
        FormGroup, InputLabel, Paper, Box, Icon, 
        Tabs, Tab, CircularProgress, Typography} from '@material-ui/core'
import Header from '../components/Header'

import axios from 'axios'
import {backendUrl} from '../config/backend'
import {connect} from 'react-redux'
import {ToastContainer, toast} from 'react-toastify'
import AsyncSelect from 'react-select/async'

import './Article.css'

import CustomButton from '../components/Button.jsx'
import ArticleImages from '../components/ArticleImages.jsx'

class Article extends Component {

    user = this.props.user.name

    state = {
        _id: null,
        title: '',
        theme: null,
        category: null,
        categories: [],
        shortDescription: '',
        longDescription: '',
        textArticle: '',
        smallImg: null,
        mediumImg: null,
        bigImg: null,
        createdAt: '',
        redirectTo: '',
        currentTab: 1,
        loading: false
    }

    handleChange = attr => event => {
        this.setState({[attr]: event.target.value})
    }

    handleChangeImg = (file, attr) => event => {
        this.setState({[attr]: file})
    }

    handleChangeSelect = (value, attr) => {
        this.setState({[attr]: value || null})
        if(attr === 'theme' && value){
            const url = `${backendUrl}/categories/${value._id}` 
            axios(url).then(res => this.setState({categories: res.data}))
        }

        if(attr === 'theme' && !value){
            this.setState({category: null})
        }
    }

    editorChange = event => {
        this.setState({textArticle: event.editor.getData()})
    }

    save = (author) => async event => {
        event.preventDefault()

        const article = await this.formatData(author)
        const url = `${backendUrl}/articles`
        await axios.post(url, article).then((res) => {
            toast.success((<div className="centerInline"><Icon className="marginRight">done</Icon>Operação realizada com sucesso</div>), {autoClose: 2000, closeOnClick: true})

            setTimeout(() => {
                this.goTo('articles')
            }, 2000)
        }).catch(error => {
            toast.error((<div className="centerInline"><Icon className="marginRight">clear</Icon>{error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'}</div>), {autoClose: 2000, closeOnClick: true})
        })
    }

    formatData = (author) => {
        return {
            _id: this.state._id,
            title: this.state.title,
            shortDescription: this.state.shortDescription,
            longDescription: this.state.longDescription,
            textArticle: this.state.textArticle,
            theme: this.state.theme,
            category: this.state.category,
            author
        }
    }

    async loadThemes(query){
        const url = `${backendUrl}/themes?query=${query}`
        const response = await axios(url)
        let themes = response.data.themes.map((theme) => {
            return {
                ...theme,
                label: theme.name,
                value: theme._id,
            }
        }) || []
    
        return themes
    }

    async filterCategories(query, categories){
        if(categories.length === 0) return []

        const filteredCategories =  await categories.map((category) => {
            const _category = {
                ...category,
                label: category.name,
                value: category._id
            }

            return category.name.toLowerCase().includes(query.toLowerCase()) ? _category : null
        }) 

        return filteredCategories.length === 1 && !filteredCategories[0] ? [] : filteredCategories
    }

    goTo = path => event => {
        this.setState({redirectTo: path})
    }

    componentWillMount(){
        if(!this.props.match.params.id) return
        this.setState({loading: true})
    }

    componentDidMount(){
        if(!this.props.match.params.id) return
        
        const id = this.props.match.params.id
        const url = `${backendUrl}/article/${id}`
        axios(url).then(res => {
            this.setState({
                _id: res.data._id,
                title: res.data.title,
                theme: {
                    ...res.data.theme,
                    label: res.data.theme ? res.data.theme.name : '',
                    value: res.data.theme ? res.data.theme._id : '' 
                } || null,
                category: {
                    ...res.data.category,
                    label: res.data.category ? res.data.category.name : '',
                    value: res.data.category ? res.data.category._id : ''
                } || null,
                shortDescription: res.data.shortDescription,
                longDescription: res.data.longDescription,
                textArticle: res.data.textArticle,
                createdAt: res.data.createdAt,

                loading: false
            })
        }).catch(async _ => {
            
            toast.error((<div className="centerInline"><Icon className="marginRight">clear</Icon>Ocorreu um erro ao buscar as informações do artigo, se persistir reporte</div>), {autoClose: 2000, closeOnClick: true})
            
            await this.setState({
                loading: false
            })

            setTimeout(this.goTo('themes'), 3000)
        })
    }


    render(){
        return(
            <Container>
                <ToastContainer />
                { this.state.redirectTo && <Redirect to={`/${this.state.redirectTo}`} />}
                <Header title="Artigo" description="Crie um novo artigo" icon="note_add"/>
                { !this.state.loading && <Paper>
                    <Tabs value={this.state.currentTab} indicatorColor="primary" onChange={(evt, value) => this.setState({currentTab: value })} variant="scrollable" scrollButtons="on">
                        <Tab label={(<span className="centerInline"><Icon>description</Icon>Informações principais</span>)} />
                        <Tab label={(<span className="centerInline"><Icon>images</Icon>Imagens</span>)}/>
                        <Tab label={(<span className="centerInline"><Icon>settings</Icon>Configurações</span>)} disabled/>
                    </Tabs>
                    { this.state.currentTab === 0 && <Box p={2}>
                        <Grid container>
                            <Grid item xs={12} className="formGroupBetween">
                                <TextField fullWidth helperText="Defina um titulo para o artigo, monte um título que seja simples e descritivo." id="title" label="Titulo" value={this.state.title || ''} margin="normal" onChange={this.handleChange('title')}/>
                            </Grid>
                            <Grid item xs={12} md={6} className="formGroup">
                                <FormGroup>
                                    <InputLabel className="margin_bottom_x1">Tema *</InputLabel>
                                    <AsyncSelect cacheOptions value={this.state.theme || null} isClearable loadOptions={this.loadThemes} onChange={(value) => this.handleChangeSelect(value, 'theme')} noOptionsMessage={(event) => event.inputValue.length >= 3 ? 'Nenhum resultado encontrado' : 'Faça uma busca com pelo menos 3 caracteres'} loadingMessage={() => "Carregando..."} placeholder="Informe o tema do artigo" />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12} md={6} className="formGroup">
                                <FormGroup>
                                    <InputLabel className="margin_bottom_x1">Categoria</InputLabel>
                                    <AsyncSelect cacheOptions value={this.state.category || null} isClearable loadOptions={(inputValue) => this.filterCategories(inputValue, this.state.categories)} onChange={(value) => this.handleChangeSelect(value, 'category')} noOptionsMessage={() => 'Nenhum resultado encontrado'} loadingMessage={() => "Carregando..."} placeholder="Informe a categoria do artigo" />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth error={this.state.shortDescription.trim().length > 150} id="short_description" helperText={this.state.shortDescription.trim().length > 150 ? 'Máximo permitido são 150 caracteres' : 'Faça uma breve descrição sobre o artigo'} label="Breve descrição" value={this.state.shortDescription || ''} margin="normal" onChange={this.handleChange('shortDescription')}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth id="long_description" helperText="Campo opcional. (Máx 300 caracteres)" label="Longa descrição" value={this.state.longDescription || ''} margin="normal" onChange={this.handleChange('longDescription')}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth id="author" label="Autor" disabled value={this.props.user.name || ''} margin="normal"/>
                            </Grid>
                            <Grid item xs={12} className="divider">
                                <Divider />
                            </Grid>
                            <Grid item xs={12} className="textArticle">
                                <p className="p">Escreva seu artigo abaixo</p>
                                <CKEditor
                                    id="textArticle"
                                    type="classic"
                                    className="textArticle"
                                    data={this.state.textArticle}
                                    onChange={this.editorChange}
                                />
                            </Grid>
                            <Grid item xs={12} className="footList">
                                <Link to="/articles" className="linkRouter linkButton"><CustomButton color="gray" text="Voltar" icon="exit_to_app" /></Link>
                                <CustomButton color="success" text="Salvar" icon="done" onClick={this.save(this.props.user)} />
                            </Grid>
                        </Grid>
                    </Box>}
                    {this.state.currentTab === 1 && <ArticleImages idArticle={this.state._id}/>}
                    {this.state.currentTab === 2 && <Box>Tab3</Box>}
                </Paper>}
                {this.state.loading && <Box display="flex" alignItems="center" flexDirection="column" mt={3} mb={3}>
                        <CircularProgress />
                        <Typography variant="body1" component="p">Carregando artigo, por favor aguarde...</Typography>
                    </Box>}
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(Article)