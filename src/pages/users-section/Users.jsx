import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'

import { Grid, Container, Button, TableHead, TableRow,
    TableCell, Table, TableBody, TableFooter, TablePagination,
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Paper, Icon, FormControl, InputLabel, Box } from '@material-ui/core'
import PasswordField from 'material-ui-password-field'
import SearchBar from 'material-ui-search-bar'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { callToast } from '../../redux/toast/toastActions'
import { success, error, info } from '../../config/toasts'

import axios from 'axios'
import { backendUrl, defineErrorMsg } from '../../config/backend'
import { OPTIONS_LIMIT, DEFAULT_LIMIT, LIMIT_LABEL, DISPLAYED_ROWS } from '../../config/dataProperties'

import CustomButton from '../../components/Buttons/Button'
import CustomIconButton from '../../components/IconButton.jsx'
import CustomChip from '../../components/Chip.jsx'
import Header from '../../components/Header'
import Searching from '../../assets/loading.gif'
import RemovedUsers from '../../components/Dialogs/Users/RemovedUsers.jsx'

import '../css/defaultPage.css'
import './css/Users.css'

class Users extends Component {

    state = {
        users: [],
        page: 1,
        count: 0,
        limit: DEFAULT_LIMIT,
        query: '',
        error: false,
        loading: false,

        loadingOp: false,
        successOp: false,
        errorOp: false,
        dialog: false,
        userSelected: null,
        redirectTo: '',

        dialogRequestPassword: false,
        validatingPass: false,
        password: '',
        removedUsers: {
            status: false,
            lastOpened: null
        }
    }

    toogleLoading(){
        this.setState({loading: !this.state.loading})
    }

    toogleValidatingPass(){
        this.setState({validatingPass: !this.state.validatingPass})
    }

    async changeQueryValue(query){
        /* Realiza a busca de usuarios por palavra chave */

        await this.setState({
            query,
            page: 1
        })

        this.searchUsers()
    }

    async searchUsers(){
         /* Responsável por realizar a busca de usuarios */

        const url = `${backendUrl}/users?page=${this.state.page}&query=${this.state.query}&limit=${this.state.limit}`
        if(this.state.users.length > 0) this.setState({users: []})
        await this.toogleLoading()
        await axios(url).then(res => {
            this.setState({
                users: res.data.users,
                count: res.data.count,
                limit: res.data.limit,
                error: false,
                errorOp: false,
                userSelected: null
            })
        }).catch(error => {
            this.setState({
                errorOp: true
            })
        })

        this.toogleLoading()
    }

    async remove(user){
        /* Responsável por realizar a exclusão de usuarios */

        const url = `${backendUrl}/users/${user._id}`
        this.setState({loadingOp: true})
        await axios.delete(url).then(() => {
            this.setState({
                loadingOp: false,
                errorOp: false,
                dialog: false
            })

            this.searchUsers()
            this.props.callToast(success('Usuário removido com sucesso'))
        }).catch(async err => {
            this.setState({
                loadingOp: false,
                errorOp: true,
                dialog: false
            })
            const msg = await defineErrorMsg(err)
            this.props.callToast(error(msg))
        })

    }

    goTo = (path) => event => {
        this.setState({
            redirectTo: `/${path}`
        })
    }

    selectUser = user => event => {
        /*  Usado para selecionar o usuario desejado para remover e também
            habilitando o modal de confirmação de exclusão
        */

        if(this.props.user._id === user._id){
            return this.props.callToast(info("Para remover sua conta acesse a opção 'Meus dados'"))
        }

        this.setState({
            dialog: true,
            userSelected: user
        })
    }

    toogleDialog = (option) => {
        /* Realiza o toogle no dialog de exclusão */

        this.setState({
            dialog: option ? true : false
        })
    }

    toogleDialogRequestPassword = (option = false) => {
        /* Realiza o toogle no dialog de exclusão */

        if(this.state.removedUsers.lastOpened && (this.state.removedUsers.lastOpened > Date.now())){
            return this.setState({
                removedUsers: {
                    ...this.state.removedUsers,
                    status: true
                }
            })
        }

        this.setState({
            dialogRequestPassword: option ? true : false
        })
    }

    changePage = async (event, page) => {
        /* Realiza a alternação de páginas da tabela de registros */

        await this.setState({
            page: ++page
        })

        this.searchUsers()
    }

    defineLimit = async (event) => {
        /* Define o limite de registros por páginas na tabela de registros */

        const limit = event.target.value

        await this.setState({
            limit: parseInt(limit)
        })

        this.searchUsers()
    }

    addEventListener(){
        document.addEventListener('keydown', (evt) => {
            if(evt.code === 'F10' && !this.state.dialogRequestPassword){
                this.toogleDialogRequestPassword(true)
            }
        })
    }

    handleChange = attr =>  async event => {
        const value = event.target.value
        this.setState({[attr]: value})
    }

    async validatePassword(evt){
        if(evt) evt.preventDefault()

        this.toogleValidatingPass()

        const url = `${backendUrl}/auth/logged`

        const payload = {
            password: this.state.password
        }

        await axios.patch(url, payload).then( async res => {
            this.toogleDialogRequestPassword(false)
            await this.setState({
                removedUsers: {
                    status: true,
                    lastOpened: Date.now() + (1000*60)
                }
            })

        }).catch(async err => {
            const msg = await defineErrorMsg(err)
            this.props.callToast(error(msg))
        })

        this.toogleValidatingPass()
    }

    componentDidMount(){
        this.searchUsers()
        this.addEventListener()
    }

    render(){
        return (
            <Container id="component">
                {this.state.redirectTo &&
                    <Redirect to={this.state.redirectTo}/>
                }
                <Header title="Usuários"
                    description="Usuários do sistema"
                    icon="people"
                />
                <Container className="hudBar">
                    <Grid item className="hudBarChild">
                        <Link to="/user" className="linkRouter">
                            <CustomButton color="default"
                                icon="add_circle_outline"
                                text="Novo Usuário"
                            />
                        </Link>
                        { this.props.user.tagAdmin && <Box ml={1} mr={1} className="linkButton">
                            <Link to="/management" className="linkRouter linkButton">
                                <CustomButton color="default" text="Configurações"
                                    icon="settings" />
                            </Link>
                        </Box>}
                    </Grid>
                    <Grid item className="hudBarChild">
                        <SearchBar id="search_field"
                            className="marginLeft"
                            placeholder="Pesquisar"
                            value={this.state.query}
                            onChange={(query) => this.changeQueryValue(query)}
                            onCancelSearch={() => this.changeQueryValue('')}
                        />
                    </Grid>
                </Container>
                {this.state.loading &&
                    <Container className="center spinnerContainer">
                        <img src={Searching} alt="Procurando Usuários"/>
                        <h4>
                            Carregando, por favor aguarde...
                        </h4>
                    </Container>
                }
                {!this.state.loading && this.state.users.length === 0 &&
                    <Container className="center">
                        <p className="defaultFontColor">
                            Ops, Nenhum resultado encontrado
                        </p>
                    </Container>
                }
                {this.state.users.length > 0 && !this.state.loading &&
                    <Paper>
                        <Container className="wrapper">
                            <Table className="defaultTable">
                                {/* Header da tabela */}
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <span className="centerVertical">
                                                <Icon fontSize="small" className="marginRight">
                                                    person
                                                </Icon>
                                                Nome
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="centerVertical">
                                                <Icon fontSize="small" className="marginRight">
                                                    alternate_email
                                                </Icon>
                                                E-mail
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="centerVertical">
                                                <Icon fontSize="small" className="marginRight">
                                                    bookmarks
                                                </Icon>
                                                Tipo
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="centerVertical">
                                                <Icon fontSize="small" className="marginRight">
                                                    build
                                                </Icon>
                                                Ações
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {/* Geração dos registros na tabela  */}
                                {this.state.users.map(user => (
                                    <TableRow key={user._id}>
                                        <TableCell scope="name">
                                            {user.name}
                                        </TableCell>
                                        <TableCell scope="email">
                                            {user.email}
                                        </TableCell>
                                        <TableCell scope="tagAdmin">
                                            {user.tagAdmin ?
                                                <CustomChip size="small"
                                                    className="chipTypeUser"
                                                    color="default"
                                                    sizeIcon="small"
                                                    icon="supervisor_account"
                                                    text="Administrador"/> :
                                                <CustomChip size="small"
                                                    className="chipTypeUser"
                                                    color="default"
                                                    sizeIcon="small"
                                                    icon="person"
                                                    text="Autor"
                                                />
                                            }
                                        </TableCell>
                                        <TableCell scope="_id">
                                            <CustomIconButton icon="edit"
                                                aria-label="Edit" color="default"
                                                tooltip="Editar"
                                                onClick={this.goTo(`user/${user._id}`)}
                                            />
                                            <CustomIconButton icon="delete_forever"
                                                aria-label="Delete" color="secondary"
                                                tooltip="Remover"
                                                onClick={this.selectUser(user)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                                {/* Footer da tabela */}
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={OPTIONS_LIMIT}
                                            colSpan={4}
                                            count={this.state.count}
                                            rowsPerPage={this.state.limit}
                                            labelRowsPerPage={LIMIT_LABEL}
                                            labelDisplayedRows={DISPLAYED_ROWS}
                                            page={this.state.page - 1}
                                            SelectProps={{ inputProps: {'aria-label': 'Limite'} }}
                                            onChangePage={this.changePage}

                                            onChangeRowsPerPage={this.defineLimit}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                            {/* Remover dialog */}
                            <Dialog
                                open={this.state.dialog}
                                onClose={() => this.toogleDialog(false)}
                                aria-labelledby="title"
                                aria-describedby="are_you_sure"
                            >
                                <DialogTitle id="title">
                                    {this.state.loadingOp ? "Removendo" : "Excluir usuário"}
                                </DialogTitle>
                                <DialogContent>
                                    <Container>
                                        {!this.state.loadingOp &&
                                            <DialogContentText id="are_you_sure">
                                                Tem certeza que deseja remover este usuário?
                                            </DialogContentText>
                                        }
                                        <DialogContentText id="description">
                                            {this.state.loadingOp ? 'Removendo cadastro, por favor aguarde...': 'Esta ação não poderá ser desfeita'}
                                        </DialogContentText>
                                    </Container>
                                </DialogContent>
                                <DialogActions>
                                    { !this.state.loadingOp &&
                                        <Button color="primary"
                                            onClick={() => this.toogleDialog(false)}
                                        >
                                            Fechar
                                        </Button>
                                    }
                                    {!this.state.loadingOp &&
                                        <Button color="primary"
                                            onClick={() => this.remove(this.state.userSelected)}
                                        >
                                                Sim, pode excluir
                                        </Button>
                                    }
                                </DialogActions>
                            </Dialog>

                            {/* RequestPassword dialog */}
                            <Dialog
                                open={this.state.dialogRequestPassword}
                                onClose={() => this.toogleDialogRequestPassword(false)}
                                disableBackdropClick={this.state.validatingPass}
                                disableEscapeKeyDown={this.state.validatingPass}
                            >
                                <DialogTitle id="title">
                                    Informe sua senha de adminstrador
                                </DialogTitle>
                                <DialogContent>
                                    <Container>
                                        <form onSubmit={(evt) => this.validatePassword(evt)}>
                                            <FormControl fullWidth>
                                                <InputLabel htmlFor="password">Senha</InputLabel>
                                                <PasswordField id="password"
                                                    inputProps={{ autoComplete: 'current-password' }}
                                                    fullWidth onChange={this.handleChange('password')}
                                                    autoFocus={true}
                                                />
                                            </FormControl>
                                        </form>
                                    </Container>
                                </DialogContent>
                                <DialogActions>
                                    { !this.state.loadingOp &&
                                        <Button color="primary"
                                            onClick={() => this.toogleDialogRequestPassword(false)}
                                            disabled={this.state.validatingPass}
                                        >
                                            Fechar
                                        </Button>
                                    }
                                    {!this.state.loadingOp &&
                                        <Button color="primary"
                                            onClick={() => this.validatePassword()}
                                            disabled={this.state.validatingPass}
                                        >
                                                {this.state.validatingPass ? 'Validando...' : 'Confirmar'}
                                        </Button>
                                    }
                                </DialogActions>
                            </Dialog>
                            { this.state.removedUsers.status && <RemovedUsers closeDialog={() => this.setState({removedUsers: {...this.state.removedUsers, status: false}})}/>}
                        </Container>
                    </Paper>
                }
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user, toast: state.config})
const mapDispatchToProps = dispatch => bindActionCreators({callToast: callToast }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Users)
