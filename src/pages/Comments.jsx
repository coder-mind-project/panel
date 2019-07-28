import React, { Component } from 'react'
import Header from '../components/Header.jsx'

import axios from 'axios'
import { backendUrl } from '../config/backend'

import { toast, ToastContainer } from 'react-toastify'


import CustomChip from '../components/Chip.jsx'
import CustomIconButton from '../components/IconButton.jsx'
import CustomButton from '../components/Button.jsx'

import { Grid, Table, TableHead, TableRow, 
        TableCell, Icon, TableBody, TableFooter,
        TablePagination, TextField, Box, Checkbox, 
        Grow, Paper, Container, Dialog, DialogContent,
        DialogContentText, DialogActions, DialogTitle} from '@material-ui/core'


import { OPTIONS_LIMIT, DEFAULT_LIMIT, LIMIT_LABEL, DISPLAYED_ROWS } from '../config/dataProperties'

import './css/defaultPage.css'
import './css/Comments.css'

const INITIAL_COMMENT = {
    _id: '',
    userName: '',
    userEmail: '',
    comment: '',
    readed: false,
    confirmed: false,
    article: null
}

class Comments extends Component {
    state = { 
        comments: [],
        page: 1,
        count: 0,
        limit: DEFAULT_LIMIT,
        query: '',
        error: false,
        loading: true,
        saving: false,

        dialogAnswer: false,
        answer: '',
        sendingAnswer: false,
        comment: INITIAL_COMMENT
    }

    toogleLoadingComments(){
        this.setState({loading: !this.state.loading})
    }

    toogleSavingChanges(){
        this.setState({saving: !this.state.saving})
    }

    toogleSendingAnswer(){
        this.setState({sendingAnswer: !this.state.sendingAnswer})
    }

    async getComments(){
        const url = `${backendUrl}/comments?type=all&page=${this.state.page}&limit=${this.state.limit}`
        await this.toogleLoadingComments()
        await axios(url).then(res => {
            this.setState({
                comments: res.data.comments,
                count: res.data.count,
                limit: res.data.limit
            })
        }).catch(error => this.setState({error: true}))
        this.toogleLoadingComments()
    }

    changePage = async (event, page) => {
        /* Realiza a alternação de páginas da tabela de registros */

        await this.setState({
            page: ++page
        })
        
        this.getComments()
    }

    handleChange(event, attr){
        const value = event.target.value

        this.setState({comment: {
            ...this.state.comment,
            [attr]: value
        }})
    }

    aproveComment(comment){

        if(comment.confirmed) 
            return toast.info((<div className="centerVertical"><Icon className="marginRight">clear</Icon>Este comentário já está aprovado</div>), {autoClose: 3000, closeOnClick: true})

        comment.confirmed = true
        comment.readed = true

        const url = `${backendUrl}/comments`
        axios.patch(url, comment).then(() => {
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon><span>Comentário aprovado com sucesso</span></div>), {autoClose: 3000, closeOnClick: true})
            this.getComments()
        }).catch(error => {
            const msg = error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'

            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 3000, closeOnClick: true})
        })
    }

    readComment(comment){

        
        this.setState({comment: {
            ...comment,
            readed: true
        }})
        
        document.documentElement.scrollTop = 0
        if(comment.readed) return
        
        const change = {
            _id: comment._id,
            readed: true
        }


        const url = `${backendUrl}/comments`
        axios.patch(url, change).then(() => true)

    }

    async save(){
        await this.toogleSavingChanges()
        const url = `${backendUrl}/comments`
        const comment = this.state.comment

        await axios.patch(url, comment).then(() => {
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon><span>Operação realizada com sucesso</span></div>), {autoClose: 3000, closeOnClick: true})
            this.getComments()
            this.setState({comment: INITIAL_COMMENT})
        }).catch(error => {
            const msg = error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'

            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 3000, closeOnClick: true})
        })

        this.toogleSavingChanges()
        
    }

    async sendAnswer(){
        const url = `${backendUrl}/comments`

        const body = {
            ...this.state.comment,
            answer: this.state.answer
        }

        await this.toogleSendingAnswer()

        await axios.post(url, body).then(res => {
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon><span>{res.data}</span></div>), {autoClose: 3000, closeOnClick: true})
            this.closeAnswerDialog()
        }).catch(error => {
            const msg = error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'

            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 3000, closeOnClick: true})
        })

        this.toogleSendingAnswer()
    }
    
    closeAnswerDialog(){
        this.setState({dialogAnswer: false, answer: ''})
    }

    componentDidMount(){
        this.getComments()
    }

    render() { 
        return ( 
            <Grid item xs={12}>
                <ToastContainer />
                <Header title="Comentários" description="Interaja com seus leitores" icon="comments"/>
                { this.state.comment._id && 
                    <Grow in={Boolean(this.state.comment._id)}>
                        <Paper className="form-comment">
                            <Grid item xs={12}>
                                <Box p={3}>
                                    <Box display="flex" justifyContent="flex-end" alignItems="center" width="100%">
                                        <CustomIconButton 
                                            icon="clear"
                                            onClick={() => {
                                                this.setState({comment: INITIAL_COMMENT})
                                            }}
                                        />
                                    </Box>
                                    <Box width="100%" mt={1} mb={1}>
                                        <TextField 
                                            label="Usuário"
                                            value={this.state.comment.userName}
                                            onChange={(event) => this.handleChange(event, 'userName')} 
                                            fullWidth
                                            disabled
                                        />
                                    </Box>
                                    <Box width="100%" mt={1} mb={1}>
                                        <TextField 
                                            label="E-mail de contato"
                                            value={this.state.comment.userEmail}
                                            onChange={(event) => this.handleChange(event, 'userEmail')} 
                                            fullWidth
                                            disabled
                                        />
                                    </Box>
                                    <Box width="100%" mt={1} mb={1}>
                                        <TextField 
                                            label="Comentário"
                                            multiline
                                            value={this.state.comment.comment}
                                            onChange={(event) => this.handleChange(event, 'comment')} 
                                            fullWidth
                                            disabled
                                        />
                                    </Box>
                                    <Box width="100%" display="flex" justifyContent="flex-end" alignItems="center" mt={1}>
                                            <CustomButton 
                                                color="none"
                                                variant="text"
                                                text="Responder"
                                                icon="question_answer"
                                                onClick={() => this.setState({dialogAnswer: true})}
                                            />
                                    </Box>
                                    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" mb={3} mt={3}>
                                        <Grid item xs={12} md={6} className="form-footer-left">
                                            <Checkbox 
                                                checked={Boolean(this.state.comment.confirmed)} 
                                                color="secondary"
                                                onChange={(evt) => this.setState({
                                                    comment: {
                                                        ...this.state.comment,
                                                        confirmed: !this.state.comment.confirmed
                                                    }
                                                })}
                                            />
                                            Confirmado?
                                        </Grid>
                                        <Grid item xs={12} md={6} className="form-footer-right">
                                            <Checkbox 
                                                checked={Boolean(this.state.comment.readed)} 
                                                color="secondary"
                                                disabled
                                                />
                                            Lido?
                                        </Grid>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                                        <Grid item xs={12} md={6} className="form-footer-left">
                                            <CustomButton 
                                                color="success"
                                                variant="contained"
                                                text={this.state.saving ? "Salvando..." : "Salvar"}
                                                icon="done"
                                                loading={this.state.saving}
                                                onClick={() => this.save()}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} className="form-footer-right">
                                            <CustomButton 
                                                color="none"
                                                variant="contained"
                                                text="Voltar à tabela" 
                                                icon="keyboard_arrow_down"
                                                onClick={() => {
                                                    this.setState({comment: INITIAL_COMMENT})
                                                    document.getElementById(`${this.state.comment._id}`).focus()
                                                }}
                                            />
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>
                        </Paper>
                    </Grow>
                }
                <Dialog open={this.state.dialogAnswer} onClose={() => this.setState({dialogAnswer: false})} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Responda o comentário de {this.state.comment.userName}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.comment.comment}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="answer"
                            label="Resposta"
                            type="text"
                            multiline
                            fullWidth
                            value={this.state.value}
                            onChange={(event) => this.setState({answer: event.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <CustomButton 
                            text="Cancelar"
                            onClick={() => {
                                const op = window.confirm('Tem certeza que deseja sair?')
                                if(op)
                                    this.closeAnswerDialog()
                            }} 
                            color="danger"
                            variant="contained"
                            icon="clear"
                        />
                        <CustomButton
                            text="Enviar"
                            onClick={() => this.sendAnswer()}
                            color="success"
                            variant="contained"
                            icon="save"
                        />
                    </DialogActions>
                </Dialog>
                <Paper>
                    <Container className="wrapper">
                        <Table className="defaultTable">
                            {/* Header da tabela */}
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <span className="centerVertical">
                                            <Icon fontSize="small" className="marginRight">
                                                file_copy
                                            </Icon>
                                            Artigo
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="centerVertical">
                                            <Icon fontSize="small" className="marginRight">
                                                person
                                            </Icon>
                                            Leitor
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
                                                category
                                            </Icon>
                                            Status
                                        </span>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {/* Geração dos registros na tabela  */}
                            {this.state.comments.map(comment => (
                                <TableRow key={comment._id} id={comment._id} tabIndex="-1">
                                    <TableCell scope="article.title">
                                        <a href={`/article/${comment.article.customURL}`} target="_blank" rel="noopener noreferrer">{comment.article.title}</a>
                                    </TableCell>
                                    <TableCell scope="userName">
                                        {comment.userName}
                                    </TableCell>
                                    <TableCell scope="userEmail">
                                        {comment.userEmail}
                                    </TableCell>
                                    <TableCell scope="tagAdmin">
                                        {comment.confirmed ? 
                                            <CustomChip size="small"
                                                className="chipTypeUser"
                                                color="success"
                                                sizeIcon="small"
                                                icon="supervisor_account"
                                                text="Aprovado"/> : 
                                            <CustomChip size="small"
                                                className="chipTypeUser"
                                                color="gray"
                                                sizeIcon="small"
                                                icon="person"
                                                text="Não aprovado"
                                            />
                                        }
                                    </TableCell>
                                    <TableCell scope="_id">
                                        <CustomIconButton icon="done"
                                            aria-label="Aproves" color="default"
                                            tooltip="Aprovar comentário"
                                            onClick={() => this.aproveComment(comment)}
                                        />
                                        <CustomIconButton icon="more_horiz"
                                            aria-label="More" color="default"
                                            tooltip="Visualizar comentário"
                                            onClick={() => this.readComment(comment)}
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
                    </Container>
                </Paper>
            </Grid>
        )
    }
}

export default Comments