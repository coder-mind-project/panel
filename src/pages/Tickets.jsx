import React, { Component } from 'react'
import { Container, Grid, Table,
    TableRow, TableHead, TableBody, TableCell,
    TableFooter, TablePagination, Paper, Box, Button, Tooltip } from '@material-ui/core'

import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'

import ViewTicket from '../components/Modals/Tickets/ViewTicket.jsx'
import CustomButton from '../components/Button.jsx'
import CustomIconButton from '../components/IconButton.jsx'
import Header from '../components/Header.jsx'
import Searching from '../assets/loading.gif'
import Filter from '../components/ComponentPages/Tickets/Filter.jsx'

import axios from 'axios'
import { backendUrl } from '../config/backend'
import { OPTIONS_LIMIT, DEFAULT_LIMIT, LIMIT_LABEL, DISPLAYED_ROWS } from '../config/dataProperties'

import { displayFullDate } from '../config/masks'


class Tickets extends Component {

    _INITIAL_TICKET_STATE = {
        content: {},
        user: {},
        admin: {}
    }

    state = { 
        tickets: [],
        loading: false,
        page: 1,
        count: 0,
        limit: DEFAULT_LIMIT,
        error: false,
        dialog: false,
        ticketSelected: this._INITIAL_TICKET_STATE,
        showFilter: false,
        filters: null
    }

    toogleLoading(){
        this.setState({loading: !this.state.loading})
    }

    async changeQueryValue(query){
        /* Realiza a busca de tickets por palavra chave */

        await this.setState({
            query,
            page: 1
        })

        this.get()
    }

    async get(filters = null){
        /* Responsável por realizar a busca de tickets */
        const url = filters ? `${backendUrl}/tickets?page=${this.state.page}&limit=${this.state.limit}&tid=${filters.tid}&type=${filters.type}&begin=${filters.begin}&end=${filters.end}&order=${filters.order}` : `${backendUrl}/tickets?page=${this.state.page}&limit=${this.state.limit}`
        
        if(filters){
            this.setState({filters})
        }
        
        if(this.state.tickets.length > 0) this.setState({tickets: []})
        this.toogleLoading()
        await axios(url).then(res => {
            this.setState({
                tickets: res.data.tickets,
                count: res.data.count,
                limit: res.data.limit,
                error: false,
            })
        }).catch(error => {
            this.setState({error: true})
        })
        this.toogleLoading()
    }

    goTo = path => event => {
        this.setState({
            redirectTo: `/${path}`
        })
    }

    async prepareForSearchWithFilters(filters){
        const filter = {
            tid: filters.ticket,
            type: filters.type !== 'n/d' ? filters.type : '',
            begin: filters.begin || '',
            end: filters.end || '',
            order: filters.order
        }

        await this.setState({
            page: 1
        })

        this.get(filter)
    }

    defineType(type){
        switch(type){
            case 'account-changed':{
                return 'Conta alterada - Perfil 2'
            }
            case 'simple-account-problem':{
                return 'Conta alterada - Perfil 1'
            }
            case 'bug-report':{
                return 'Reporte de Bug'
            }
            case 'improvement-suggestion':{
                return 'Sugestão de melhoria'
            }
            default:{
                return 'N/D'
            }
        }
    }

    selectTheme = theme => event => {
        /*  Usado para selecionar o tema desejado para remover e também
            habilitando o modal de confirmação de exclusão 
        */

        this.setState({
            dialog: true,
            ticketSelected: theme 
        })
    }

    toogleDialog = (option = false, ticket) => {
        /* Realiza o toogle no dialog de apresentar o ticket */

        this.setState({
            dialog: option ? true : false,
            ticketSelected: option ? ticket : this._INITIAL_TICKET_STATE
        })
    }

    changePage = async (event, page) => {
        /* Realiza a alternação de páginas da tabela de registros */

        await this.setState({
            page: ++page
        })
        
        const filters = this.state.filters
        
        this.get(filters)
    }

    toogleFilter(){
        if(!this.state.loading) this.setState({showFilter: !this.state.showFilter})
    }

    defineLimit = async (event) => {
        /* Define o limite de registros por páginas na tabela de registros */

        const limit = event.target.value

        await this.setState({
            limit: parseInt(limit)
        })

        this.get()
    }

    verificationAdmin(){
        const user = this.props.user

        if(!user || !user.tagAdmin) return window.location.href = '/'
    }

    async updateTicket(ticket){
        const tickets = await this.state.tickets.map(tkt => {
            if(tkt._id === ticket._id){
                tkt.content = ticket
            }

            return tkt
        })

        this.setState({tickets})
    }

    componentDidMount(){
        this.verificationAdmin()
        this.get()
    }

    render() { 
        return ( 
            <Container id="component">
                {this.state.redirectTo && 
                    <Redirect to={this.state.redirectTo} />
                }
                <Header title="Tickets" description="Visualize e responda tickets de atendimento aos autores da plataforma"
                    icon="label" 
                />
                <Container className="hudBar">
                    <Grid item className="hudBarChild">
                        <Box mr={1} className="linkButton">
                            <Link to="/management" className="linkRouter linkButton">
                                <CustomButton color="gray" text="Configurações"
                                    icon="settings"
                                />
                            </Link>
                        </Box>
                        <Box mr={1} className="linkButton">
                            <CustomButton text="Filtros"
                                    icon={this.state.showFilter ? 'clear' : 'filter_list'}
                                    onClick={() => this.toogleFilter()}
                            />
                        </Box>
                    </Grid>
                </Container>
                <Filter showFilter={this.state.showFilter} emitSearchByFilters={(filters) => this.prepareForSearchWithFilters(filters)} isLoading={this.state.loading}/>
                {this.state.loading && 
                    <Container className="center spinnerContainer">
                        <img src={Searching} alt="Procurando tickets" />
                        <h4>
                            Carregando, por favor aguarde...
                        </h4>
                    </Container>
                }
                {!this.state.loading && this.state.tickets.length === 0 &&
                    <Container className="center">
                        <p className="defaultFontColor">
                            Ops, Nenhum resultado encontrado
                        </p>
                    </Container>
                }
                {this.state.tickets.length > 0 && !this.state.loading &&
                    <Paper>
                        <Container className="wrapper">
                            <Table className="defaultTable">
                                {/* Header da tabela */}
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Data de envio
                                        </TableCell>
                                        <TableCell>
                                            Tipo
                                        </TableCell>
                                        <TableCell>
                                            Ticket
                                        </TableCell>
                                        <TableCell>
                                            E-mail solicitante
                                        </TableCell>
                                        <TableCell>
                                            Respostas
                                        </TableCell>
                                        <TableCell>
                                            Ações
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {/* Geração dos registros na tabela  */}
                                {this.state.tickets.map(ticket => (
                                    <TableRow key={ticket._id}>
                                        <TableCell scope="createdAt">
                                            {displayFullDate(ticket.content.createdAt)}
                                        </TableCell>
                                        <TableCell scope="type">
                                            {this.defineType(ticket.content.type)}
                                        </TableCell>
                                        <TableCell scope="_id">
                                            <Tooltip title={(<span style={{fontSize: '0.8rem'}}>Abrir ticket</span>)}>
                                                <Button variant="text" color="secondary"
                                                    onClick={() => this.toogleDialog(true, ticket)}
                                                >
                                                    {ticket.content._id}
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell scope="email">
                                            {ticket.content.email}
                                        </TableCell>
                                        <TableCell scope="responses">
                                            { ticket.content.responses.length}
                                        </TableCell>
                                        <TableCell scope="_id">
                                            <Box display='flex' alignItems='center' justifyContent='center' flexWrap='wrap'>
                                                <CustomIconButton icon="receipt" color="default"
                                                    aria-label="Abrir Ticket" tooltip={(<span style={{fontSize: '0.8rem'}}>Abrir ticket</span>)}
                                                    onClick={() => this.toogleDialog(true, ticket)}
                                                />
                                                { !ticket.content.readed &&
                                                    <CustomIconButton icon="info" color="default"
                                                        aria-label="Ticket não lido" tooltip={(<span style={{fontSize: '0.8rem'}}>Ticket não lido</span>)}
                                                    />
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
                            {/* Ticket's content dialog */}
                            {this.state.dialog && <ViewTicket ticket={this.state.ticketSelected} onClose={this.toogleDialog} defineType={this.defineType} updateTicket={(ticket) => this.updateTicket(ticket)}/>}
                        </Container>
                    </Paper>
                }
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user})
export default connect(mapStateToProps)(Tickets)