import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'

import { Container, Grid, TextField, Divider,
        Paper, FormGroup, InputLabel, Icon, Breadcrumbs,
        Box } from '@material-ui/core'

import AsyncSelect from 'react-select/async'

import axios from 'axios'
import { backendUrl, defineErrorMsg } from '../../../config/backend'

import CustomButton from '../../../components/Button.jsx'
import Header from '../../../components/Header'
import Searching from '../../../assets/loading.gif'

import '../../css/defaultPage.css'
import '../../css/forms.css'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { callToast } from "../../../redux/toastActions"
import { success, error } from "../../../config/toasts"

class Category extends Component{

    state = {
        category: {
            _id: null,
            name: '',
            alias: '',
            description: '',
        },
        loading: false,
        redirectTo: '',
        themeSelected: null,
    }

    toogleLoading(){
        this.setState({loading: !this.state.loading})
    }

    handleChange = attr => event => {
        const value = event.target.value
        this.setState({category: {
            ...this.state.category,
            [attr]: value
        }})
    }

    handleChangeSelect = value => {
        /*
            Usado para definir o valor do tema
        */

        this.setState({themeSelected: value || null})
    }

    getThemes = value => {
        /*  Responsável por realizar a busca dos temas conforme a palavra
            chave digitada pelo usuário.
            A busca será somente realizada após o terceiro digito

            A propriedade loadOptions do AsyncSelect recebe uma promise.
            Assim foi adotado este tipo de retorno para verificar a quantidade
            caracteres digitados
        */

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(value.length >= 3 ? this.loadThemes(value) : [])
            })
        }, 1000)
    }

    loadThemes = async (query) => {
        /*
            Responsável por buscar o tema pela palavra chave
        */

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

        /* Formata a categoria de acordo com o registro na base de dados */

        const category = {
            _id: this.state.category._id,
            name: this.state.category.name,
            alias: this.state.category.alias,
            description: this.state.category.description,
            theme: this.state.themeSelected
        }

        /*  Remoção dos campos label e value que são usados
            por causa do AsyncSelect/Select
        */

        if(category.theme){
            delete category.theme.label
            delete category.theme.value
        }

        return category

    }

    save = async() =>{
    /* Responsável por persistir a categoria */

        const category = await this.formatData()
        const method = category._id ? 'put' : 'post'
        const url = method === 'post' ? `${backendUrl}/categories` : `${backendUrl}/categories/${category._id}`


        axios[method](url, category).then(() => {
            this.props.callToast(success('Operação realizada com sucesso'))
            setTimeout(() => {
                this.goTo('categories')
            }, 2000)
        }).catch(async err => {
            const msg = await defineErrorMsg(err)
            this.props.callToast(error(msg))
        })
    }

    goTo = path => {
        this.setState({redirectTo: path})
    }

    async getCategory(id){
        /* Realiza a busca da categoria para permitir a edição / visualização */

        await this.toogleLoading()
        const url = `${backendUrl}/categories/${id}`
        await axios(url).then(res => {
            this.setState({
                category: {
                    _id: res.data._id,
                    name: res.data.name,
                    alias: res.data.alias || '',
                    description: res.data.description || '',
                },
                themeSelected: res.data.theme ? {
                    ...res.data.theme,
                    value: res.data.theme._id,
                    label: res.data.theme.name
                } : null,
            })
        }).catch(err => {
            const msg = err && err.response && err.response.data ? err.response.data  : 'Ocorreu um erro desconhecido, se persistir reporte'
            this.props.callToast(error(msg))
            if(err && err.response && err.response.status === 404){
                setTimeout(() => {
                    this.setState({redirectTo: 'categories'})
                }, 3000)
            }
        })

        this.toogleLoading()
    }

    async componentDidMount(){
        if(!this.props.match.params.id) return
        const id = this.props.match.params.id
        this.getCategory(id)
    }

    render(){
        return(
            <Container id="component">
                <Header title="Categoria"
                    description="Consulte, altere, crie e remova categorias do sistema"
                    icon="category"
                />
                <Box mb={3}>
                    <Breadcrumbs separator={<Icon>navigate_next_icon</Icon>}>
                        <Link to="/management" className="defaultFontColor">
                            <strong>Configurações</strong>
                        </Link>
                        <Link to="/categories" className="defaultFontColor">
                            <strong>Categorias</strong>
                        </Link>
                        <strong>
                            {this.state.category._id ? 'Editar categoria' : 'Criar categoria'}
                        </strong>
                    </Breadcrumbs>
                </Box>
                { !this.state.loading &&
                    <Paper className="form">
                        {this.state.redirectTo &&
                            <Redirect to={`/${this.state.redirectTo}`} />
                        }
                        <Grid container>
                            <Grid item xs={12} md={6} className="formGroup">
                                <TextField label="Categoria *"
                                    error={Boolean(this.state.category.name.length >= 30)}
                                    helperText={this.state.category.name.length >= 30 ? "Máximo permitido 30 caracteres" : ''}
                                    fullWidth className="formInput"
                                    value={this.state.category.name}
                                    onChange={this.handleChange('name')}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} className="formGroup">
                                <TextField label="Apelido"
                                    error={Boolean(this.state.category.alias && this.state.category.alias.length >= 30)}
                                    helperText={this.state.category.alias && this.state.category.alias.length >= 30 ?
                                        "Máximo permitido 30 caracteres" :
                                        'Informe um possível apelido para o tema, isto ajuda o sistema a encontrar este tema em pesquisas'}
                                    className="formInput" value={this.state.category.alias}
                                    fullWidth
                                    onChange={this.handleChange('alias')}
                                />
                            </Grid>
                            <Grid item xs={12} className="formGroup">
                                <FormGroup>
                                    <InputLabel className="margin_bottom_x1">
                                            Tema *
                                    </InputLabel>
                                    <AsyncSelect cacheOptions
                                        value={this.state.themeSelected}
                                        isClearable loadOptions={this.getThemes}
                                        onChange={(value) => this.handleChangeSelect(value)}
                                        noOptionsMessage={(event) => event.inputValue.length >= 3 ?
                                            'Nenhum resultado encontrado' :
                                            'Faça uma busca com pelo menos 3 caracteres'}
                                        loadingMessage={() => "Carregando..."}
                                        placeholder="Informe o tema desta categoria"
                                    />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12} className="formGroup">
                                <TextField label="Descrição"
                                    error={Boolean(this.state.category.description && this.state.category.description.length >= 100)}
                                    helperText={this.state.category.description && this.state.category.description.length >= 100 ?
                                    "Máximo permitido 100 caracteres" :
                                    'Descreva do que se trata este tema. (Campo opcional)'}
                                    className="formInput"
                                    fullWidth value={this.state.category.description}
                                    onChange={this.handleChange('description')}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider className="separator"/>
                        </Grid>
                        <Grid item xs={12} className="footList">
                            <CustomButton className="buttonFootList"
                                text="Voltar" color="gray" icon="logout"
                                onClick={() => this.goTo('categories')}
                            />
                            <CustomButton className="buttonFootList"
                                text="Salvar" color="success" icon="done"
                                onClick={this.save}
                            />
                        </Grid>
                    </Paper>
                }
                {this.state.loading &&
                    <Container className="center spinnerContainer">
                        <img src={Searching} alt="Procurando categorias..."/>
                        <h4>
                            Carregando, por favor aguarde...
                        </h4>
                    </Container>
                }
            </Container>
        )
    }
}

const mapStateToProps = state => ({toast: state.config})
const mapDispatchToProps = dispatch => bindActionCreators({callToast: callToast }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Category)
