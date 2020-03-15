import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'

import { Container, Grid, TextField, Button,
        MenuItem, Divider, Icon, InputLabel,
        FormControl, Box, Paper, Dialog, DialogActions,
        DialogContent, DialogContentText, DialogTitle,
        Breadcrumbs } from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import PasswordField from 'material-ui-password-field'

import Header from '../../components/Header'
import CustomButton from '../../components/Buttons/Button'
import Searching from '../../assets/loading.gif'

import axios from 'axios'
import { backendUrl, defineErrorMsg } from '../../config/backend'
import { cpfMask, celphoneMask } from '../../config/masks'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { callToast } from '../../redux/toast/toastActions'
import { success, error } from '../../config/toasts'

import '../css/defaultPage.css'
import '../css/forms.css'

import {formatCustomURL} from '../../config/masks'

class User extends Component{

    state = {
        user: {
            _id: null,
            name: '',
            email: '',
            cpf: '',
            gender: '',
            birthDate: null,
            celphone: '',
            address: '',
            number: '',
            password: '',
            type: 'author',
            created_at: '',
            updatedAt: '',
            firstLogin: '',
            customUrl: '',
            oldEmail: '',
        },
        loading: false,
        saving: false,
        openDialog: false,
        loadingOp: false,
        redirectTo: ''
    }

    toogleLoading(){
        this.setState({loading: !this.state.loading})
    }


    handleChange = attr =>  async event => {
        let value = event.target.value
        if(attr === 'customUrl') value = await formatCustomURL(value)
        const user = this.state.user
        this.setState({user: {...user, [attr]: value}})
    }

    handleChangeMaskData = attr => event => {
        if(typeof attr !== 'string') return
        const value = event.target.value
        const user = this.state.user
        switch(attr){
            case 'cpf':{
                this.setState({user: {...user, [attr]: cpfMask(value)}})
                break
            }
            default:{
                this.setState({user: {...user, [attr]: celphoneMask(value)}})
                break
            }
        }
    }

    handleDate = birthDate => {
        const user = this.state.user
        this.setState({
            user: {...user, birthDate}
        })
    }

    formatData = () => {
        /* Formata o usuario de acordo com o registro na base de dados */
        return {
            _id: this.state.user._id,
            name: this.state.user.name,
            email: this.state.user.email,
            gender: this.state.user.gender,
            type: this.state.user.type,
            cpf: this.state.user.cpf,
            celphone: this.state.user.celphone,
            birthDate: this.state.user.birthDate,
            address: this.state.user.address,
            number: this.state.user.number,
            password: this.state.user.password,
            customUrl: this.state.user.customUrl
        }
    }

    toogleSaving(){
        this.setState({saving: !this.state.saving})
    }

    save = async() =>{
        /* Responsável por persistir o usuario */

        const user = await this.formatData()

        const method = user._id ? 'put' : 'post'
        const url =  method === 'post' ? `${backendUrl}/users?sm=yes` : `${backendUrl}/users/${user._id}?sm=yes`

        this.toogleSaving()

        await axios[method](url, user).then(() => {
            this.props.callToast(success('Informações salvas com sucesso'))
            setTimeout(() => {
                this.goTo("users")
            }, 3000)
        }).catch(async err => {
            const msg = await defineErrorMsg(err)
            this.props.callToast(error(msg))
        })

        this.toogleSaving()
    }

    toogleDialog = openDialog => event => {
        //false to close Dialog
        //true to open Dialog
        const user = this.state.user
        this.setState({openDialog, user: {...user, password: ''}})
    }

    changePassword = async (evt) => {
        /* Responśavel por alterar a senha do usuário */
        evt.preventDefault()

        this.setState({loadingOp: true})
        const url = `${backendUrl}/users/configs/${this.state.user._id}`

        const payload = {
            password: this.state.user.password
        }

        await axios.post(url, payload).then( () => {
            this.props.callToast(success('Senha alterada com sucesso!'))
            this.setState({openDialog: false})
        }).catch(async err => {
            const msg = await defineErrorMsg(err)
            this.props.callToast(error(msg))
        })

        const user = this.state.user
        this.setState({loadingOp: false, user: {...user, password: ''}})

    }

    goTo = (path) => {
        this.setState({
            redirectTo: path
        })
    }

    getUser = async (id) => {
        /* Realiza a busca do usuário para permitir a edição / visualização */

        const url = `${backendUrl}/users/${id}`
        await this.toogleLoading()
        await axios(url).then(res => {
            this.setState({ user: {
                ...res.data,
                oldEmail: res.data.email,
                address: res.data.address || '',
                number: res.data.number || '',
                type: res.data.tagAdmin ? 'admin':'author'
            }})
        }).catch(err => {
            const msg = err.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'

            this.props.callToast(error(msg))
            if(err.response.status === 404){
                setTimeout(() => {
                    this.setState({redirectTo: 'users'})
                }, 3000)
            }
        })

        this.toogleLoading()
    }

    async componentDidMount(){
        if(!this.props.match.params.id) return
        const id = this.props.match.params.id
        this.getUser(id)
    }

    render(){
        return(
            <Container id="component">
                <Header title="Usuário"
                    description="Consulte, altere, crie e remova usuários do sistema"
                    icon="person_add"
                />
                <Box mb={3}>
                    <Breadcrumbs separator={<Icon>navigate_next_icon</Icon>}>
                        <Link to="/management" className="defaultFontColor">
                            <strong>Configurações</strong>
                        </Link>
                        <Link to="/users" className="defaultFontColor">
                            <strong>Usuários</strong>
                        </Link>
                        <strong>
                            {this.state.user._id ? 'Editar usuário' : 'Criar usuário'}
                        </strong>
                    </Breadcrumbs>
                </Box>
                {this.state.redirectTo &&
                    <Redirect to={`/${this.state.redirectTo}`}/>
                }
                { !this.state.loading &&
                    <Paper className="form">
                        <Grid container>
                            <Grid item xs={12}>
                                <Box display="flex" className="textColor">
                                    <Icon>
                                        person
                                    </Icon>
                                    <h3 className="marginNone">
                                        Informações principais
                                    </h3>
                                </Box>
                            </Grid>
                            <Grid item xs={12} className="formGroup">
                                <TextField label="Nome *"
                                    className="formInput"
                                    value={this.state.user.name}
                                    onChange={this.handleChange('name')}
                                />
                                <TextField label="E-mail *"
                                    className="formInput"
                                    value={this.state.user.email}
                                    helperText="Esta informação será usada para a autenticação deste usuário no sistema"
                                    onChange={this.handleChange('email')}
                                />
                                <TextField label="Genero *"
                                    className="formInput"
                                    value={this.state.user.gender} select
                                    onChange={this.handleChange('gender')}
                                >
                                    <MenuItem key={'male'} value={'male'}>
                                        Masculino
                                    </MenuItem>
                                    <MenuItem key={'female'} value={'female'}>
                                        Feminino
                                    </MenuItem>
                                    <MenuItem key={'undefined'} value={'undefined'}>
                                        Prefere não informar
                                    </MenuItem>
                                </TextField>
                                <TextField label="Tipo *" className="formInput"
                                    value={this.state.user.type}
                                    helperText="Defina o tipo de conta do usuário"
                                    select onChange={this.handleChange('type')}
                                >
                                    <MenuItem key={'admin'} value={'admin'}>
                                        Administrador
                                    </MenuItem>
                                    <MenuItem key={'author'} value={'author'}>
                                        Autor
                                    </MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} className="formGroup">
                                <TextField label="CPF *" className="formInput"
                                    value={this.state.user.cpf}
                                    onChange={this.handleChangeMaskData('cpf')}
                                    inputProps={{ maxLength: 14 }}
                                />
                                <TextField label="Número de celular *"
                                    className="formInput"
                                    placeholder="Ex: (xx)xxxxx-xxxx"
                                    value={this.state.user.celphone}
                                    helperText="Informe o telefone móvel"
                                    onChange={this.handleChangeMaskData('celphone')}
                                    inputProps={{ maxLength: 15 }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider className="separator"/>
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" className="textColor">
                                <Icon>
                                    location_city
                                </Icon>
                                <h3 className="marginNone">
                                    Informações complementares
                                </h3>
                            </Box>
                        </Grid>
                        <Grid item xs={12} className="formGroup">
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardDatePicker label="Data de nascimento"
                                    clearable cancelLabel="Cancelar"
                                    clearLabel="Limpar"
                                    className="formInput"
                                    value={this.state.user.birthDate}
                                    onChange={this.handleDate}
                                    mask="__/__/____"
                                    maxDate={new Date()}
                                    maxDateMessage="Data acima do permitido"
                                    minDateMessage="Data abaixo do permitido"
                                    format="DD/MM/YYYY"
                                    invalidDateMessage="Formato de data inválido" />
                            </MuiPickersUtilsProvider>
                            <TextField label="Endereço"
                                className="formInput"
                                value={this.state.user.address}
                                onChange={this.handleChange('address')}
                            />
                            <TextField label="Número"
                                type="number"
                                className="formInput"
                                value={this.state.user.number}
                                onChange={this.handleChange('number')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Divider className="separator"/>
                        </Grid>
                        { !this.state.user._id &&
                            <Grid item xs={12}>
                                <Box display="flex" className="textColor">
                                    <Icon>
                                        lock
                                    </Icon>
                                    <h3 className="marginNone">
                                        Informações sigilosas
                                    </h3>
                                </Box>
                            </Grid>
                        }
                        { !this.state.user._id &&
                            <Grid item xs={12} className="formGroup">
                                <form>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="password">
                                            Senha *
                                        </InputLabel>
                                        <PasswordField onChange={this.handleChange('password')}
                                            id="password"
                                            inputProps={{ autoComplete: "new-password" }}
                                        />
                                    </FormControl>
                                </form>
                            </Grid>
                        }
                        { this.state.user._id &&
                            <Grid item xs={12}>
                                <Divider className="separator"/>
                            </Grid>
                        }
                        { this.state.user._id &&
                            <Grid item xs={12}>
                                <Box display="flex" className="textColor">
                                    <Icon>
                                        security
                                    </Icon>
                                    <h3 className="marginNone">
                                        Informações de gerenciamento
                                    </h3>
                                </Box>
                            </Grid>
                        }
                        { this.state.user._id &&
                            <Grid item xs={12} className="formGroup">
                                <TextField label="Usuário criado em"
                                    className="formInput"
                                    inputProps={{
                                        className: "disabled-text-field min-width-300"
                                    }}
                                    InputLabelProps={{
                                        className: "disabled-text-field"
                                    }}
                                    value={this.state.user.created_at}
                                    disabled={true}
                                />
                                <TextField label="Última atualização do cadastro"
                                    className="formInput"
                                    inputProps={{
                                        className: "disabled-text-field min-width-300"
                                    }}
                                    InputLabelProps={{
                                        className: "disabled-text-field"
                                    }}
                                    value={this.state.user.updatedAt}
                                    disabled={true}
                                />
                                <TextField label="URL customizada"
                                    className="formInput min-width-300"
                                    value={this.state.user.customUrl}
                                    onChange={this.handleChange('customUrl')}
                                    helperText={`A url customizada ficará: ${formatCustomURL(this.state.user.customUrl)}`}
                                />
                            </Grid>
                        }
                        <Grid item xs={12} className="betweenInline">
                            <small className="defaultFontColor">
                                * Dados obrigatórios
                            </small>
                            { this.state.user._id &&
                                <CustomButton color="default"
                                    text="Alterar senha" iconSize="small"
                                    icon="lock"
                                    onClick={this.toogleDialog(true)}
                                    disabled={this.state.saving}
                                />
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <Divider className="separator"/>
                        </Grid>
                        <Dialog
                            open={this.state.openDialog}
                            onClose={this.toogleDialog(false)}
                            aria-labelledby="title"
                            aria-describedby="change_password"
                        >
                            <DialogTitle id="title">{this.state.loadingOp ? "Alterando..." : "Alterar senha"}</DialogTitle>
                            <DialogContent>
                                <Container>
                                    { !this.state.loadingOp &&
                                        <DialogContentText id="change_password">
                                            Informe a nova senha
                                        </DialogContentText>
                                    }
                                    { this.state.loadingOp &&
                                        <DialogContentText id="description">
                                            Alterando senha, por favor aguarde...
                                        </DialogContentText>
                                    }
                                    { !this.state.loadingOp &&
                                        <form onSubmit={this.changePassword}>
                                            <FormControl fullWidth>
                                                <InputLabel htmlFor="changePassword">
                                                    Senha
                                                </InputLabel>
                                                <PasswordField onChange={this.handleChange('password')}
                                                    id="changePassword"
                                                    inputProps={{ autoComplete: "new-password" }}
                                                />
                                            </FormControl>
                                        </form>
                                    }
                                </Container>
                            </DialogContent>
                            <DialogActions>
                                { !this.state.loadingOp &&
                                    <Button color="primary"
                                        onClick={this.toogleDialog(false)}>
                                            Fechar
                                    </Button>}
                                { !this.state.loadingOp &&
                                    <Button color="primary"
                                        onClick={this.changePassword}>
                                            Confirmar
                                    </Button>
                                }
                            </DialogActions>
                        </Dialog>
                        <Grid item xs={12} className="footList">
                            <CustomButton className="buttonFootList"
                                iconSize="small"
                                icon="logout"
                                color="default"
                                text="Voltar"
                                onClick={() => this.goTo("users")}
                                disabled={this.state.saving}
                            />
                            <CustomButton className="buttonFootList"
                                iconSize="small"
                                color="primary"
                                icon="done"
                                text={`${this.state.saving ? 'Salvando...' : 'Salvar' }`}
                                loading={this.state.saving}
                                disabled={this.state.saving}
                                onClick={this.save}
                            />
                        </Grid>
                    </Paper>
                }
                {this.state.loading &&
                    <Container className="center spinnerContainer">
                        <img src={Searching} alt="Procurando Usuários"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(User)
