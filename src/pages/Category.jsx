import React, {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import {Container, Grid, TextField, Divider,
        Paper, FormGroup, InputLabel, Icon, Breadcrumbs, Box} from '@material-ui/core'
import {Done, Clear} from '@material-ui/icons'
import CustomButton from '../components/Button.jsx'
import Header from '../components/Header'
import './defaultPage.css'
import './forms.css'
import {ToastContainer, toast} from 'react-toastify'

import axios from 'axios'
import {backendUrl} from '../config/backend'

import AsyncSelect from 'react-select/async'



export default class User extends Component{

    state = {
        _id: null,
        name: '',
        alias: '',
        description: '',
        state: true,
        redirectTo: '',
        themeSelected: null,
    }

    handleChange = attr => event => {
        const value = event.target.value
        this.setState({[attr]: value})
    }

    handleChangeSelect = value => {
        this.setState({themeSelected: value || null})
    }

    getThemes = value => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(value.length >= 3 ? this.loadThemes(value) : [])
            })
        }, 1000)
    }
    
    loadThemes = async (query) => {
        const url = `${backendUrl}/themes?query=${query}`
        const response = await axios(url)
        let themes = response.data.themes.map((theme, index) => {
            return {
                ...theme,
                label: theme.name,
                value: theme._id,
            }
        }) || []
    
        return themes
    }

    formatData = () => {
        
        const category = {
            _id: this.state._id, 
            name: this.state.name,
            alias: this.state.alias,
            description: this.state.description,
            theme: this.state.themeSelected
        }

        if(category.theme){
            delete category.theme.label
            delete category.theme.value
        }

        return category

    }

    save = async() =>{
        const theme = await this.formatData()
        const url = `${backendUrl}/categories`
        axios.post(url, theme).then(() => {
            toast.success((<div className="centerInline"><Done className="marginRight"></Done>Operação realizada com sucesso</div>), {autoClose: 2000, closeOnClick: true})
            setTimeout(() => {
                this.goTo('categories')
            }, 2000)
        }).catch(error => {
            toast.error((<div className="centerInline"><Clear className="marginRight"></Clear>{error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'}</div>), {autoClose: 2000, closeOnClick: true})
        })
    }

    goTo = path => {
        this.setState({redirectTo: path})
    }

    async componentDidMount(){
        if(!this.props.match.params.id) return
        const id = this.props.match.params.id
        const url = `${backendUrl}/category/${id}`
        axios(url).then(res => {
            this.setState({
                _id: res.data._id,
                name: res.data.name,
                alias: res.data.alias || '',
                themeSelected: res.data.theme ? {
                    ...res.data.theme,
                    value: res.data.theme._id,
                    label: res.data.theme.name
                } : null,
                description: res.data.description || '',
            })
        })
    }

    render(){
        return(
            <Container>
                <Header title="Categoria" description="Consulte, altere, crie e remova categorias do sistema" icon="category"/>
                <Box mb={1}>
                    <Breadcrumbs separator={<Icon>navigate_next_icon</Icon>}>
                        <Link to="/management" className="defaultFontColor">Configurações</Link>
                        <Link to="/categories" className="defaultFontColor">Categorias</Link>
                        <span>{this.state._id ? 'Editar categoria' : 'Criar categoria'}</span>
                    </Breadcrumbs>
                </Box>
                <Paper className="form">
                    {this.state.redirectTo && <Redirect to={`/${this.state.redirectTo}`} />}
                    <ToastContainer />
                    <Grid container>
                        <Grid item xs={12} md={6} className="formGroup">
                            <TextField label="Categoria *" error={Boolean(this.state.name.length >= 30)} helperText={this.state.name.length >= 30 ? "Máximo permitido 30 caracteres" : ''} fullWidth className="formInput" value={this.state.name} onChange={this.handleChange('name')}></TextField>
                        </Grid>
                        <Grid item xs={12} md={6} className="formGroup">
                            <TextField label="Apelido" error={Boolean(this.state.alias && this.state.alias.length >= 30)} helperText={this.state.alias && this.state.alias.length >= 30 ? "Máximo permitido 30 caracteres" : 'Informe um possível apelido para o tema, isto ajuda o sistema a encontrar este tema em pesquisas'} className="formInput" value={this.state.alias} fullWidth onChange={this.handleChange('alias')}></TextField>
                        </Grid>
                        <Grid item xs={12} className="formGroup">
                            <FormGroup>
                                <InputLabel className="margin_bottom_x1">Tema *</InputLabel>
                                <AsyncSelect cacheOptions value={this.state.themeSelected} isClearable loadOptions={this.getThemes} onChange={(value) => this.handleChangeSelect(value)} noOptionsMessage={(event) => event.inputValue.length >= 3 ? 'Nenhum resultado encontrado' : 'Faça uma busca com pelo menos 3 caracteres'} loadingMessage={() => "Carregando..."} placeholder="Informe o tema desta categoria" />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} className="formGroup">
                            <TextField label="Descrição" error={Boolean(this.state.description && this.state.description.length >= 100)} helperText={this.state.description && this.state.description.length >= 100 ? "Máximo permitido 100 caracteres" : 'Descreva do que se trata este tema. (Campo opcional)'} className="formInput" fullWidth value={this.state.description} onChange={this.handleChange('description')}></TextField>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}><Divider className="separator"/></Grid>
                    <Grid item xs={12} className="footList">
                        <CustomButton className="buttonFootList" text="Voltar" color="gray" icon="logout" onClick={() => this.goTo('categories')} />
                        <CustomButton className="buttonFootList" text="Salvar" color="success" icon="done" onClick={this.save} />
                    </Grid>
                </Paper>
            </Container>
        )
    }
}