import React, { Component } from 'react'

import {Dialog, DialogActions, DialogContent,
    DialogTitle, Button, Container, Table, TableHead,
    TableRow, TableCell, Icon, TableBody, TableFooter,
    TablePagination, Box, Divider, LinearProgress, CircularProgress} from '@material-ui/core'

import CustomIconButton from '../../IconButton.jsx'
import CustomChip from '../../Chip.jsx'

import axios from 'axios'

import { backendUrl, defineErrorMsg } from '../../../config/backend'
import { OPTIONS_LIMIT, LIMIT_LABEL, DISPLAYED_ROWS } from '../../../config/dataProperties'

import '../../../pages/css/defaultPage.css'
import '../../../pages/users-section/css/Users.css'
import './css/RemovedUsers.css'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { callToast } from '../../../redux/toastActions'
import { success, error, info } from '../../../config/toasts'

class RemovedUsers extends Component {

    state = {
        open: true,
        handleClose: () => null,
        users: [],
        count: 0,
        limit: 10,
        userSelected: {},
        errorOp: false,
        page: 1,
        query: '',
        loading: false,
        restoring: false

    }

    async searchUsers(){
        /* Responsável por realizar a busca de usuarios */

        const url = `${backendUrl}/users?page=${this.state.page}&query=${this.state.query}&limit=${this.state.limit}&deleted=yes`
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

    toogleLoading(){
        this.setState({loading: !this.state.loading})
    }

    toogleRestoring(){
        this.setState({restoring: !this.state.restoring})
    }

    async restore(user){

        const option = window.confirm(`Tem certeza que deseja restaurar o usuário ${user.name} - ${user.email} ?`)

        if(!option) return

        await this.setState({userSelected: user})

        const _id = user._id

        if(!_id) this.props.callToast(info('Usuário não encontrado'))

        this.toogleRestoring()

        const url = `${backendUrl}/users/configs/${_id}`

        await axios.patch(url).then( res => {
            this.searchUsers()
            this.props.callToast(success('Usuário restaurado com sucesso'))
        }).catch( err => {
            const msg = defineErrorMsg(err)
            this.props.callToast(error(msg))
        })

        this.toogleRestoring()
    }

    componentDidMount(){
        this.setState({
            handleClose: this.props.closeDialog,
        })
        this.searchUsers()
    }


    render(){
        return (
            <Dialog
                open={this.state.open}
                onClose={this.state.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                fullScreen={true}
            >
                <DialogTitle id="alert-dialog-title">
                    <Box display='flex' alignItems='center' mb={1}>
                        <Box mr={1} display="flex" alignItems='center'>
                            <Icon>restore</Icon>
                        </Box>
                        <Box display="flex" alignItems="center">
                            Usuários removidos
                        </Box>
                    </Box>
                    <Divider />
                    <Box>
                        <small className="description-text">
                            Recupere os usuários excluídos da plataforma.
                        </small>
                    </Box>
                </DialogTitle>
                <DialogContent>
                {this.state.users.length > 0 && !this.state.loading &&
                    <Container className="wrapper">
                        { this.state.restoring && <LinearProgress size={20} color="primary" />}
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
                                                color="gray"
                                                sizeIcon="small"
                                                icon="person"
                                                text="Autor"
                                            />
                                        }
                                    </TableCell>
                                    <TableCell scope="_id">
                                        <Box width="100" display="flex" justifyContent="center" alignItems="center">
                                            { (!Boolean(user === this.state.userSelected) || !this.state.restoring) &&
                                                <CustomIconButton icon="restore_from_trash"
                                                aria-label="Restore" color="primary"
                                                tooltip="Restaurar"
                                                disabled={this.state.restoring}
                                                onClick={() => this.restore(user)}
                                                />
                                            }
                                            { Boolean(user === this.state.userSelected) && this.state.restoring &&
                                                <CircularProgress size={20} color="primary"/>
                                            }
                                        </Box>
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
                    </Container>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.state.handleClose} color="primary" autoFocus>
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const mapStateToProps = state => ({toast: state.config})
const mapDispatchToProps = dispatch => bindActionCreators({callToast: callToast }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RemovedUsers)
