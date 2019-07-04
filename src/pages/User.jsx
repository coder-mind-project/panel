import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Container, Grid, TextField, Button,
        MenuItem, Divider, Icon, InputLabel,
        FormControl, Box, Paper, Dialog, DialogActions,
        DialogContent, DialogContentText, DialogTitle} from '@material-ui/core'
import Header from '../components/Header'
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import PasswordField from 'material-ui-password-field'
import './defaultPage.css'
import './forms.css'

import CustomButton from '../components/Button.jsx'

import axios from 'axios'
import {ToastContainer, toast} from 'react-toastify'
import {backendUrl} from '../config/backend'
import {cpfMask, telphoneMask, celphoneMask} from '../config/masks'

export default class User extends Component{

    state = {
        user: {
            _id: null,
            name: '',
            email: '',
            cpf: '',
            gender: '',
            birthDate: null,
            telphone: '',
            celphone: '',
            address: '',
            number: '',
            password: '',
            type: 'author',
        },
        
        openDialog: false,
        loadingOp: false,
        redirectTo: ''
    }


    async componentDidMount(){
        if(!this.props.match.params.id) return
        const id = this.props.match.params.id
        const url = `${backendUrl}/user/${id}`
        axios(url).then(res => {
            this.setState({ user: {
                ...res.data,
                address: res.data.address || '', 
                number: res.data.number || '', 
                type: res.data.tagAdmin ? 'admin':'author'
            }})
        })
    }

    handleChange = attr =>  async event => {
        const value = event.target.value
        const user = this.state.user
        await this.setState({user: {...user, [attr]: value}})
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
            case 'celphone':{
                this.setState({user: {...user, [attr]: celphoneMask(value)}})
                break
            }
            default:{
                this.setState({user: {...user, [attr]: telphoneMask(value)}})
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
        return {
            _id: this.state.user._id, 
            name: this.state.user.name,
            email: this.state.user.email,
            gender: this.state.user.gender,
            type: this.state.user.type,
            cpf: this.state.user.cpf,
            telphone: this.state.user.telphone,
            celphone: this.state.user.celphone,
            birthDate: this.state.user.birthDate,
            address: this.state.user.address,
            number: this.state.user.number,
            password: this.state.user.password
        }
    }

    save = async() =>{
        const user = await this.formatData()
        const url = `${backendUrl}/users`
        axios.post(url, user).then(() => {
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon>Informações salvas com sucesso</div>), {autoClose: 3000, closeOnClick: true})
            setTimeout(() => {
                this.goBack()
            }, 3000)
        }).catch(error => {
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'}</div>), {autoClose: 3000, closeOnClick: true})
        })
    }

    toogleDialog = openDialog => event => {
        //false to close Dialog
        //true to open Dialog
        const user = this.state.user
        this.setState({openDialog, user: {...user, password: ''}})
    }
    
    changePassword = async () => {
        this.setState({loadingOp: true})
        const url = `${backendUrl}/users`
        const payload = {
            _id: this.state.user._id,
            password: this.state.user.password
        }
        await axios.put(url, payload).then( () => {
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon>Senha alterada com sucesso!</div>), {autoClose: 3000, closeOnClick: true})
            this.setState({openDialog: false})
        }).catch(error => {
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'}</div>), {autoClose: 3000, closeOnClick: true})
        })

        const user = this.state.user
        this.setState({loadingOp: false, user: {...user, password: ''}})

    }

    goBack = () => {
        this.setState({
            redirectTo: "users"
        })
    }

    render(){
        return(
            <Container>
                <Header title="Usuário" description="Consulte, altere, crie e remova usuários do sistema" icon="person_add"/>
                <ToastContainer/>
                {this.state.redirectTo && <Redirect to={`/${this.state.redirectTo}`}/>}
                <Paper className="form">
                    <Grid container>
                        <Grid item xs={12}>
                            <Box display="flex" className="textColor">
                                <Icon>person</Icon><h3 className="marginNone">Informações principais</h3>
                            </Box>
                        </Grid>
                        <Grid item xs={12} className="formGroup">
                            <TextField label="Nome *" className="formInput" value={this.state.user.name} onChange={this.handleChange('name')}></TextField>
                            <TextField label="E-mail *" className="formInput" value={this.state.user.email} helperText="Esta informação será usada para a autenticação deste usuário no sistema" onChange={this.handleChange('email')}></TextField>
                            <TextField label="Genero *" className="formInput" value={this.state.user.gender} select onChange={this.handleChange('gender')}>
                                <MenuItem key={'male'} value={'male'} >Masculino</MenuItem>
                                <MenuItem key={'female'} value={'female'}>Feminino</MenuItem>
                                <MenuItem key={'undefined'} value={'undefined'}>Prefere não informar</MenuItem>
                            </TextField>
                            <TextField label="Tipo *" className="formInput" value={this.state.user.type} helperText="Defina o tipo de conta do usuário" select onChange={this.handleChange('type')}>
                                <MenuItem key={'admin'} value={'admin'} >Administrador</MenuItem>
                                <MenuItem key={'author'} value={'author'}>Autor</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} className="formGroup">
                            <TextField label="CPF *" className="formInput" value={this.state.user.cpf} onChange={this.handleChangeMaskData('cpf')} inputProps={{
                                maxLength: 14
                            }}></TextField>
                            <TextField label="Número de telefone *" className="formInput" placeholder="Ex: (xx)xxxx-xxxx" value={this.state.user.telphone} helperText="Informe o telefone fixo" onChange={this.handleChangeMaskData('telphone')} inputProps={{
                                maxLength: 14
                            }}></TextField>
                            <TextField label="Número de celular *" className="formInput" placeholder="Ex: (xx)xxxxx-xxxx" value={this.state.user.celphone} helperText="Informe o telefone móvel" onChange={this.handleChangeMaskData('celphone')} inputProps={{
                                maxLength: 15
                            }}></TextField>
                        </Grid>
                    </Grid>
                    
                    <Grid item xs={12}><Divider className="separator"/></Grid>
                    <Grid item xs={12}>
                        <Box display="flex" className="textColor">
                            <Icon>location_city</Icon><h3 className="marginNone">Informações complementares</h3>
                        </Box>
                    </Grid>
                    <Grid item xs={12} className="formGroup">
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker label="Data de nascimento" clearable cancelLabel="Cancelar" clearLabel="Limpar" className="formInput" value={this.state.user.birthDate} onChange={this.handleDate} mask="__/__/____" maxDate={new Date()} maxDateMessage="Data acima do permitido" minDateMessage="Data abaixo do permitido"></KeyboardDatePicker>
                        </MuiPickersUtilsProvider>
                        <TextField label="Endereço" className="formInput" value={this.state.user.address} onChange={this.handleChange('address')}></TextField>
                        <TextField label="Número" type="number" className="formInput" value={this.state.user.number} onChange={this.handleChange('number')}></TextField>
                    </Grid>
                    <Grid item xs={12}><Divider className="separator"/></Grid>
                    { !this.state.user._id && <Grid item xs={12}>
                        <Box display="flex" className="textColor">
                            <Icon>lock</Icon><h3 className="marginNone">Informações sigilosas</h3>
                        </Box>
                    </Grid>}
                    { !this.state.user._id && <Grid item xs={12} className="formGroup">
                        <form>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="password">Senha *</InputLabel>
                                <PasswordField onChange={this.handleChange('password')} id="password" inputProps={{
                                            autoComplete: "new-password"
                                        }}/>
                            </FormControl>
                        </form>
                    </Grid>}
                    <Grid item xs={12} className="betweenInline">
                        <small className="defaultFontColor">* Dados obrigatórios</small>
                        {this.state.user._id && <CustomButton color="default" text="Alterar senha" iconSize="small" icon="lock" onClick={this.toogleDialog(true)}/>}
                    </Grid>
                    <Grid item xs={12}><Divider className="separator"/></Grid>
                    <Dialog
                        open={this.state.openDialog}
                        onClose={this.toogleDialog(false)}
                        aria-labelledby="title"
                        aria-describedby="change_password"
                    >
                        <DialogTitle id="title">{this.state.loadingOp ? "Alterando..." : "Alterar senha"}</DialogTitle>
                        <DialogContent>
                            <Container>
                                {!this.state.loadingOp && <DialogContentText id="change_password">
                                    Informe a nova senha
                                </DialogContentText>}
                                { this.state.loadingOp && <DialogContentText id="description">
                                    Alterando senha, por favor aguarde...
                                </DialogContentText>}
                                { !this.state.loadingOp && 
                                <form>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="changePassword">Senha</InputLabel>
                                        <PasswordField onChange={this.handleChange('password')} id="changePassword" inputProps={{
                                            autoComplete: "new-password"
                                        }}/>
                                    </FormControl>
                                </form>}
                            </Container>
                        </DialogContent>
                        <DialogActions>
                            { !this.state.loadingOp && <Button color="primary" onClick={this.toogleDialog(false)}>Fechar</Button>}
                            {!this.state.loadingOp && <Button color="primary" onClick={this.changePassword}>Confirmar</Button>}
                        </DialogActions>
                    </Dialog>
                    <Grid item xs={12} className="footList">
                        <CustomButton className="buttonFootList" iconSize="small" icon="logout" color="gray" text="Voltar" onClick={this.goBack}/>
                        <CustomButton className="buttonFootList" iconSize="small" color="success" icon="done" text="Salvar" onClick={this.save}/>
                    </Grid>
                </Paper>
            </Container>
        )
    }
}