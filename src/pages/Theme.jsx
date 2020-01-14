import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Container, Grid, TextField, Divider,
        Paper, Icon, Breadcrumbs, Box } from '@material-ui/core'

import CustomButton from '../components/Button.jsx'
import Header from '../components/Header'
import Searching from '../assets/searching.gif'

import axios from 'axios'
import { backendUrl, defineErrorMsg } from '../config/backend'

import './css/defaultPage.css'
import './css/forms.css'

export default class User extends Component{

    state = {
        theme: {
            _id: null,
            name: '',
            alias: '',
            description: '',
        },
        redirectTo: ''
    }

    toogleLoading(){
        this.setState({loading: !this.state.loading})
    }

    handleChange = attr => event => {
        const value = event.target.value
        this.setState({theme: {
            ...this.state.theme,
            [attr]: value
        }})
    }


    formatData = () => {
        /* Formata o tema de acordo com o registro na base de dados */

        return {
            _id: this.state.theme._id, 
            name: this.state.theme.name,
            alias: this.state.theme.alias,
            description: this.state.theme.description
        }
    }

    save = async () => {
        /* Responsável por persistir o tema */

        const theme = await this.formatData()
        const method = theme._id ? 'put' : 'post' 
        const url = method === 'post' ? `${backendUrl}/themes` : `${backendUrl}/themes/${theme._id}`

        axios[method](url, theme).then(() => {
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon>Operação realizada com sucesso</div>), {autoClose: 2000, closeOnClick: true})
            setTimeout(() => {
                this.goTo('themes')
            }, 2000)
        }).catch(async error => {
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 2000, closeOnClick: true})
        })
    }

    goTo = path  => {
        this.setState({redirectTo: path})
    }

    getTheme = async (id) =>{
        /* Realiza a busca do tema para permitir a edição / visualização */

        const url = `${backendUrl}/themes/${id}`
        await this.toogleLoading()
        await axios(url).then(res => {
            this.setState({theme: {
                _id: res.data._id,
                name: res.data.name,
                alias: res.data.alias || '',
                description: res.data.description || '',
            }})
        }).catch(error => {
            const msg = error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'

            if(error.response.status === 404){
                toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 3000, closeOnClick: true})
                
                setTimeout(() => {
                    this.setState({redirectTo: 'themes'})
                }, 3000)
            }else{
                toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 3000, closeOnClick: true})
            }
        })

        this.toogleLoading()
    }

    async componentDidMount(){
        if(!this.props.match.params.id) return
        const id = this.props.match.params.id
        this.getTheme(id)
    }

    render(){
        return(
            <Container id="component">
                <Header title="Tema" 
                    description="Consulte, altere, crie e remova temas do sistema"
                    icon="bookmark"
                />
                <Box mb={3}>
                    <Breadcrumbs separator={<Icon>navigate_next_icon</Icon>}>
                        <Link to="/management" className="defaultFontColor">
                            <strong>Configurações</strong>
                        </Link>
                        <Link to="/themes" className="defaultFontColor">
                            <strong>Temas</strong>
                        </Link>
                        <strong>
                            {this.state.theme._id ? 'Editar tema' : 'Criar tema'}
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
                                <TextField label="Tema *" 
                                    error={this.state.theme.name.length >= 30}
                                    helperText={this.state.theme.name.length >= 30 ?
                                    "Máximo permitido 30 caracteres" : ''}
                                    fullWidth className="formInput"
                                    value={this.state.theme.name}
                                    onChange={this.handleChange('name')}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} className="formGroup">
                                <TextField label="Apelido"
                                    error={this.state.theme.alias.length >= 30}
                                    helperText={this.state.theme.alias.length >= 30 ?
                                    "Máximo permitido 30 caracteres" :
                                    "Informe um possível apelido para o tema, isto ajuda o sistema a encontrar este tema em pesquisas"}
                                    className="formInput" value={this.state.theme.alias}
                                    fullWidth onChange={this.handleChange('alias')}
                                />
                            </Grid>
                            <Grid item xs={12} className="formGroup">
                                <TextField label="Descrição"
                                    error={this.state.theme.description.length >= 100}
                                    helperText={this.state.theme.description.length >= 100 ?
                                    "Máximo permitido 100 caracteres" :
                                    'Descreva do que se trata este tema'} className="formInput"
                                    fullWidth value={this.state.theme.description}
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
                                onClick={() => this.goTo('themes')}
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