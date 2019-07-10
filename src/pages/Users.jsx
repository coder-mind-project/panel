import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'

import { Grid, Container, Button, TableHead, TableRow,
    TableCell, Table, TableBody, TableFooter, TablePagination,
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, CircularProgress, Paper, Icon } from '@material-ui/core'
import { Done, Clear } from '@material-ui/icons'
import SearchBar from 'material-ui-search-bar'

import { ToastContainer, toast } from 'react-toastify'

import axios from 'axios'
import { backendUrl, defineErrorMsg } from '../config/backend'
import { OPTIONS_LIMIT, DEFAULT_LIMIT, LIMIT_LABEL, DISPLAYED_ROWS } from '../config/dataProperties'

import CustomButton from '../components/Button.jsx'
import CustomIconButton from '../components/IconButton.jsx'
import CustomChip from '../components/Chip.jsx'
import Header from '../components/Header'

import './css/defaultPage.css'
import './css/Users.css'

export default class Users extends Component {
    
    state = {
        users: [],
        page: 1,
        count: 0,
        limit: DEFAULT_LIMIT,
        query: '',
        error: false,
        loading: true,

        loadingOp: false,
        successOp: false,
        errorOp: false,
        dialog: false,
        userSelected: null,
        redirectTo: ''
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
        this.setState({loading: true})
        if(this.state.users.length > 0) this.setState({users: []})
        await axios(url).then(res => {
            this.setState({
                users: res.data.users,
                count: res.data.count,
                limit: res.data.limit,
                error: false,
                loading: false,
                errorOp: false,
                userSelected: null
            })
        }).catch(error => {
            this.setState({
                loading: false,
                errorOp: true
            })
        })
    }

    async remove(user){
        /* Responsável por realizar a exclusão de usuarios */

        const url = `${backendUrl}/user/${user._id}`
        this.setState({loadingOp: true})
        await axios.delete(url).then(() => {
            this.setState({
                loadingOp: false,
                errorOp: false,
                dialog: false
            })
            
            this.searchUsers()
            toast.success((<div className="centerInline"><Done className="marginRight"></Done>Usuário removido com sucesso</div>), {autoClose: 3000, closeOnClick: true})
        }).catch(async error => {
            this.setState({
                loadingOp: false,
                errorOp: true,
                dialog: false
            })
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerInline"><Clear className="marginRight"></Clear>{msg}</div>), {autoClose: 3000, closeOnClick: true})
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
    
    componentDidMount(){
        this.searchUsers()
    }
    
    render(){
        return (
            <Container>
                <ToastContainer />
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
                        <CircularProgress/>
                        <p>
                            Carregando, por favor aguarde...
                        </p>
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
                                                <Icon fontSize="small">
                                                    person
                                                </Icon>
                                                Nome
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="centerVertical">
                                                <Icon fontSize="small">
                                                    alternate_email
                                                </Icon>
                                                E-mail
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="centerVertical">
                                                <Icon fontSize="small">
                                                    bookmarks
                                                </Icon>
                                                Tipo
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="centerVertical">
                                                <Icon fontSize="small">
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
                                                    color="gray"
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
                                                onClick={this.goTo(`edit-user/${user._id}`)}
                                            />
                                            <CustomIconButton icon="delete_forever"
                                                aria-label="Delete" color="danger"
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
                                        <Button color="secondary" 
                                            onClick={() => this.remove(this.state.userSelected)}
                                        >
                                                Sim, pode excluir
                                        </Button>
                                    }
                                </DialogActions>
                            </Dialog>
                        </Container>
                    </Paper>
                }
            </Container>
        )
    }
}