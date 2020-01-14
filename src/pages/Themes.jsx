import React, { Component } from 'react'
import { Container, Grid, Button, Table,
    TableRow, TableHead, TableBody, TableCell,
    TableFooter, TablePagination, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Paper, Icon, Box } from '@material-ui/core'

import { toast } from 'react-toastify'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import SearchBar from 'material-ui-search-bar'

import CustomButton from '../components/Button.jsx'
import CustomIconButton from '../components/IconButton.jsx'
import Header from '../components/Header.jsx'
import Searching from '../assets/searching.gif'

import axios from 'axios'
import { backendUrl, defineErrorMsg } from '../config/backend'
import { OPTIONS_LIMIT, DEFAULT_LIMIT, LIMIT_LABEL, DISPLAYED_ROWS } from '../config/dataProperties'

class Themes extends Component {
    state = { 
        themes: [],
        loading: false,
        query: '',
        page: 1,
        count: 0,
        limit: DEFAULT_LIMIT,
        error: false,
        dialog: false,
        loadingOp: false,
        themeSelected: null

    }

    toogleLoading(){
        this.setState({loading: !this.state.loading})
    }

    async changeQueryValue(query){
        /* Realiza a busca de temas por palavra chave */

        await this.setState({
            query,
            page: 1
        })

        this.searchThemes()
    }

    async searchThemes(){
        /* Responsável por realizar a busca de temas */

        const url = `${backendUrl}/themes?page=${this.state.page}&query=${this.state.query}&limit=${this.state.limit}`
        if(this.state.themes.length > 0) this.setState({themes: []})
        await this.toogleLoading()
        await axios(url).then(res => {
            this.setState({
                themes: res.data.themes,
                count: res.data.count,
                limit: res.data.limit,
                error: false,
            })
        }).catch(error => {
            this.setState({error: true})
        })
        this.toogleLoading()
    }

    async remove(){
        /* Responsável por realizar a exclusão de temas */

        this.setState({loadingOp: true})
        const id = this.state.themeSelected._id
        const url = `${backendUrl}/themes/${id}`

        await axios.delete(url).then(() => {
            toast.success((<div className="centerInline"><Icon>done</Icon><span>Operação realizada com sucesso</span></div>), {autoClose: 3000, closeOnClick: true})
        }).catch(async error => {
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerInline"><Icon>clear</Icon><span>{msg}</span></div>), {autoClose: 3000, closeOnClick: true})
        })
        this.setState({loadingOp: false, dialog: false})
        this.searchThemes()
    }

    goTo = path => event => {
        this.setState({
            redirectTo: `/${path}`
        })
    }

    selectTheme = theme => event => {
        /*  Usado para selecionar o tema desejado para remover e também
            habilitando o modal de confirmação de exclusão 
        */

        this.setState({
            dialog: true,
            themeSelected: theme 
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
        
        this.searchThemes()
    }

    defineLimit = async (event) => {
        /* Define o limite de registros por páginas na tabela de registros */

        const limit = event.target.value

        await this.setState({
            limit: parseInt(limit)
        })

        this.searchThemes()
    }

    componentDidMount(){
        this.searchThemes()
    }

    render() { 
        return ( 
            <Container id="component">
                {this.state.redirectTo && 
                    <Redirect to={this.state.redirectTo} />
                }
                <Header title="Temas" description="Temas para artigos"
                    icon="bookmark" 
                />
                <Container className="hudBar">
                    <Grid item className="hudBarChild">
                        { this.props.user.tagAdmin && 
                            <Box mr={1} className="linkButton">
                                <Link to="/theme" className="linkRouter linkButton">
                                    <CustomButton color="default" text="Novo Tema"
                                        icon="add_circle_outline" 
                                    />
                                </Link>
                            </Box>
                        }
                        <Box mr={1} className="linkButton">
                            <Link to="/management" className="linkRouter linkButton">
                                <CustomButton color="gray" text="Configurações"
                                    icon="settings"
                                />
                            </Link>
                        </Box>
                    </Grid>
                    <Grid item className="hudBarChild">
                        <SearchBar id="search_field" className="searchTextField"
                            placeholder="Pesquisar" value={this.state.query}
                            onChange={(query) => this.changeQueryValue(query)}
                            onCancelSearch={() => this.changeQueryValue('')}
                        />
                    </Grid>
                </Container>
                {this.state.loading && 
                    <Container className="center spinnerContainer">
                        <img src={Searching} alt="Procurando temas" />
                        <h4>
                            Carregando, por favor aguarde...
                        </h4>
                    </Container>
                }
                {!this.state.loading && this.state.themes.length === 0 &&
                    <Container className="center">
                        <p className="defaultFontColor">
                            Ops, Nenhum resultado encontrado
                        </p>
                    </Container>
                }
                {this.state.themes.length > 0 && !this.state.loading &&
                    <Paper>
                        <Container className="wrapper">
                            <Table className="defaultTable">
                                {/* Header da tabela */}
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <span className="centerVertical">
                                                <Icon fontSize="small" className="marginRight">
                                                    bookmark
                                                </Icon>
                                                Tema
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="centerVertical">
                                                <Icon fontSize="small" className="marginRight">
                                                    bookmark_border
                                                </Icon>
                                                Alias
                                            </span>
                                        </TableCell>
                                        { this.props.user.tagAdmin && 
                                            <TableCell>
                                                <span className="centerVertical">
                                                    <Icon fontSize="small" className="marginRight">
                                                        build
                                                    </Icon>
                                                    Ações
                                                </span>
                                            </TableCell>
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {/* Geração dos registros na tabela  */}
                                {this.state.themes.map(theme => (
                                    <TableRow key={theme._id}>
                                        <TableCell scope="name">
                                            {theme.name}
                                        </TableCell>
                                        <TableCell scope="alias">
                                            {theme.alias}
                                        </TableCell>
                                        { this.props.user.tagAdmin && 
                                            <TableCell scope="_id">
                                                <CustomIconButton icon="edit" color="default"
                                                    aria-label="Editar" tooltip="Editar"
                                                    onClick={this.goTo(`theme/${theme._id}`)}
                                                />
                                                <CustomIconButton icon="delete_forever" color="danger"
                                                    aria-label="Delete" tooltip="Remover"
                                                    onClick={this.selectTheme(theme)}
                                                />
                                            </TableCell>
                                        }
                                    </TableRow>
                                ))}
                                </TableBody>
                                {/* Footer da tabela */}
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination 
                                            rowsPerPageOptions={OPTIONS_LIMIT}
                                            colSpan={3}
                                            count={this.state.count}
                                            rowsPerPage={this.state.limit}
                                            labelRowsPerPage={LIMIT_LABEL}
                                            labelDisplayedRows={DISPLAYED_ROWS}
                                            page={this.state.page - 1}
                                            SelectProps={{
                                                inputProps: {'aria-label': 'Limite'},
                                            }}
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
                                <DialogTitle id="title">{this.state.loadingOp ? "Removendo" : "Excluir usuário"}</DialogTitle>
                                <DialogContent>
                                    <Container>
                                        {!this.state.loadingOp &&
                                            <DialogContentText id="are_you_sure">
                                                Tem certeza que deseja remover este tema?
                                            </DialogContentText>
                                        }
                                        {this.state.loadingOp && 
                                            <DialogContentText id="description">
                                                Removendo tema, por favor aguarde...
                                            </DialogContentText>
                                        }
                                    </Container>
                                </DialogContent>
                                <DialogActions>
                                    { !this.state.loadingOp &&
                                        <Button color="secondary" 
                                            onClick={() => this.toogleDialog(false)}
                                        >
                                            Fechar
                                        </Button>
                                    }
                                    {!this.state.loadingOp && 
                                        <Button color="secondary" 
                                            onClick={() => this.remove(this.state.themeSelected)}
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

const mapStateToProps = state => ({user: state.user})
export default connect(mapStateToProps)(Themes)