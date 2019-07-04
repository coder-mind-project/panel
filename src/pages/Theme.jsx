import React, {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import {Container, Grid, TextField, Divider,
        Paper, Icon, Breadcrumbs, Box} from '@material-ui/core'
import {Done, Clear} from '@material-ui/icons'
import CustomButton from '../components/Button.jsx'
import Header from '../components/Header'
import './defaultPage.css'
import './forms.css'
import {ToastContainer, toast} from 'react-toastify'

import axios from 'axios'
import {backendUrl} from '../config/backend'

export default class User extends Component{

    state = {
        _id: null,
        name: '',
        alias: '',
        description: '',
        state: true,
        redirectTo: ''
    }

    handleChange = attr => event => {
        const value = event.target.value
        this.setState({[attr]: value})
    }


    formatData = () => {
        return {
            _id: this.state._id, 
            name: this.state.name,
            alias: this.state.alias,
            description: this.state.description
        }
    }

    save = async() =>{
        const theme = await this.formatData()
        const url = `${backendUrl}/themes`
        axios.post(url, theme).then(() => {
            toast.success((<div className="centerInline"><Done className="marginRight"></Done>Operação realizada com sucesso</div>), {autoClose: 2000, closeOnClick: true})
            setTimeout(() => {
                this.goTo('themes')
            }, 2000)
        }).catch(error => {
            toast.error((<div className="centerInline"><Clear className="marginRight"></Clear>{error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'}</div>), {autoClose: 2000, closeOnClick: true})
        })
    }

    goTo = path  => {
        this.setState({redirectTo: path})
    }

    async componentDidMount(){
        if(!this.props.match.params.id) return
        const id = this.props.match.params.id
        const url = `${backendUrl}/theme/${id}`
        axios(url).then(res => {
            this.setState({
                _id: res.data._id,
                name: res.data.name,
                alias: res.data.alias || '',
                description: res.data.description || '',
            })
        })
    }

    render(){
        return(
            <Container>
                <Header title="Tema" description="Consulte, altere, crie e remova temas do sistema" icon="bookmark"/>
                <Box mb={1}>
                    <Breadcrumbs separator={<Icon>navigate_next_icon</Icon>}>
                        <Link to="/management" className="defaultFontColor">Configurações</Link>
                        <Link to="/themes" className="defaultFontColor">Temas</Link>
                        <span>{this.state._id ? 'Editar tema' : 'Criar tema'}</span>
                    </Breadcrumbs>
                </Box>
                <Paper className="form">
                    {this.state.redirectTo && <Redirect to={`/${this.state.redirectTo}`} />}
                    <ToastContainer />
                    <Grid container>
                        <Grid item xs={12} md={6} className="formGroup">
                            <TextField label="Tema *" error={this.state.name.length >= 30} helperText={this.state.name.length >= 30 ? "Máximo permitido 30 caracteres" : ''} fullWidth className="formInput" value={this.state.name} onChange={this.handleChange('name')}></TextField>
                        </Grid>
                        <Grid item xs={12} md={6} className="formGroup">
                            <TextField label="Apelido" error={this.state.alias.length >= 30} helperText={this.state.alias.length >= 30 ? "Máximo permitido 30 caracteres" : 'Informe um possível apelido para o tema, isto ajuda o sistema a encontrar este tema em pesquisas'} className="formInput" value={this.state.alias} fullWidth onChange={this.handleChange('alias')}></TextField>
                        </Grid>
                        <Grid item xs={12} className="formGroup">
                            <TextField label="Descrição" error={this.state.description.length >= 100} helperText={this.state.description.length >= 100 ? "Máximo permitido 100 caracteres" : 'Descreva do que se trata este tema. (Campo opcional)'} className="formInput" fullWidth value={this.state.description} onChange={this.handleChange('description')}></TextField>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}><Divider className="separator"/></Grid>
                    <Grid item xs={12} className="footList">
                        <CustomButton className="buttonFootList" text="Voltar" color="gray" icon="logout" onClick={() => this.goTo('themes')} />
                        <CustomButton className="buttonFootList" text="Salvar" color="success" icon="done" onClick={this.save} />
                    </Grid>
                </Paper>
            </Container>
        )
    }
}