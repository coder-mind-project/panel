import React, { Component } from 'react'

import Header from '../components/Header.jsx'
import { Grid, Box, TextField,
        Icon, Breadcrumbs, Divider, Paper, Container,
        Table, TableBody, TableCell, TableFooter,
        TableHead, TableRow, Dialog, DialogActions,
        DialogContent, DialogTitle} from '@material-ui/core'

import {toast} from 'react-toastify'

import CustomIconButton from '../components/IconButton.jsx'
import CustomButton from '../components/Button.jsx'

import Searching from '../assets/loading.gif'

import ErrorBlock from '../components/ErrorBlock.jsx'

import { Link } from 'react-router-dom'

import axios from 'axios'
import { backendUrl } from '../config/backend'
import { displayFullDate } from '../config/masks'

import { DEFAULT_LIMIT } from '../config/dataProperties'

import './css/Comment.css'

const INITIAL_COMMENT = {
    _id: '',
    userName: '',
    userEmail: '',
    comment: '',
    readed: false,
    confirmed: false,
    article: null,
}


class Comment extends Component {
    state = { 
        loading: false,
        loadingMore: false,
        existMore: true,
        answers: [],
        comment: INITIAL_COMMENT,
        count: 0,
        page: 1,
        limit: DEFAULT_LIMIT,
        
        error: false,

        dialogAnswer: false,
        answer: '',
        authorAnswer: '',
    }

    toogleLoading(){
        this.setState({loading: !this.state.loading})
    }

    toogleLoadingMore(){
        this.setState({loadingMore: !this.state.loadingMore})
    }

    async getHistory(){
        await this.toogleLoading()
        const _id = this.props.match.params.id

        const url = `${backendUrl}/comments/history/${_id}?page=${this.state.page}&limit=${this.state.limit}`

        await axios(url).then(res => {
            this.setState({
                comment: res.data.comment,
                answers: res.data.answers,
                count: res.data.count
            })
        }).catch(error => this.setState({error: true}))

        this.toogleLoading()
    }

    async includeMoreComments(){
        const page = this.state.page + 1
        await this.setState({page})
        await this.toogleLoadingMore()
        
        const _id = this.state.comment._id
        const url = `${backendUrl}/comments/history/${_id}?page=${this.state.page}&limit=${this.state.limit}`

        await axios(url).then(async res => {
            let answers = this.state.answers
            if(res.data.answers.length === 0){
                this.setState({existMore: false})
                toast.info((<div className="centerVertical"><Icon className="marginRight">clear</Icon>Não existem mais respostas a este comentário</div>), {autoClose: 5000, closeOnClick: true})
            }else{
                const count = this.state.count + res.data.count
                answers.push(...res.data.answers)
                await this.setState({
                    answers,
                    count
                })
            }
        }).catch(error => {
            this.setState({error: true})
        })

        this.toogleLoadingMore()
        
    }

    closeAnswerDialog(){
        this.setState({dialogAnswer: false, answer: '', authorAnswer: ''})
    }

    componentDidMount(){
        this.getHistory()
    }

    render() { 
        return ( 
            <Container id="component">
                <Header icon="history" title="Histórico de comentários" description={`Visualize o histórico do comentário abaixo`} />
                <Box mb={3}>
                    <Breadcrumbs separator={<Icon>navigate_next_icon</Icon>}>
                        <Link to="/comments" className="defaultFontColor">
                            <strong>Comentarios</strong>
                        </Link>
                        { this.state.comment._id && 
                            <strong>
                            Comentário de <u>{this.state.comment.userName}</u>
                            </strong>
                        }
                        { !this.state.comment._id && this.state.loading &&
                            <strong>
                            Carregando commentario...
                            </strong>
                        }
                    </Breadcrumbs>
                </Box>
                { !this.state.loading && this.state.comment._id &&
                    <Paper className="paper">
                        <Grid item xs={12}>
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center">
                                    <Box mr={1} display="flex" alignItems="center">
                                        <Icon>comment</Icon>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <h2>Comentário</h2>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} className="form-comment">
                                <Grid item xs={12} md={6} className="form-container">
                                    <TextField
                                        className="form-input"
                                        label="Leitor"
                                        value={this.state.comment.userName}
                                        disabled
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} className="form-container">
                                    <TextField
                                        className="form-input"
                                        label="E-mail de contato"
                                        value={this.state.comment.userEmail}
                                        disabled
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className="form-container">
                                <TextField 
                                    className="form-input"
                                    label="Comentário"
                                    value={this.state.comment.comment}
                                    disabled
                                    fullWidth
                                    multiline
                                />
                            </Grid>
                            <Box width="100%" mb={3} mt={3}>
                                <Divider/>
                            </Box>
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center">
                                    <Box display="flex" alignItems="center" mr={1}>
                                        <Icon>question_answer</Icon>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <h2>Respostas deste comentário</h2>
                                    </Box>
                                </Box>
                            </Grid>
                            { this.state.answers.length > 0 &&
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
                                                            Pessoa
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
                                                                av_timer
                                                            </Icon>
                                                            Comentado em
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {/* Geração dos registros na tabela  */}
                                            {this.state.answers.map(comment => (
                                                <TableRow key={comment._id} id={comment._id} tabIndex="-1">
                                                    <TableCell scope="userName">
                                                        {comment.userName}
                                                    </TableCell>
                                                    <TableCell scope="userEmail">
                                                        {comment.userEmail}
                                                    </TableCell>
                                                    <TableCell scope="created_at">
                                                        {displayFullDate(comment.created_at)}
                                                    </TableCell>
                                                    <TableCell scope="_id">
                                                        <CustomIconButton icon="speaker_notes"
                                                            aria-label="SeeComment" color="default"
                                                            tooltip="Ver comentário"
                                                            onClick={() => this.setState({dialogAnswer: true, authorAnswer: comment.userName, answer: comment.comment})}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            </TableBody>
                                            { this.state.existMore &&
                                                <TableFooter>
                                                    <TableRow>
                                                        <TableCell>
                                                            <CustomButton 
                                                                text="Ver mais"
                                                                icon="expand_more"
                                                                onClick={() => this.includeMoreComments()}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            }
                                        </Table>
                                    </Container>
                                </Paper>
                            }
                            <Dialog open={this.state.dialogAnswer} onClose={() => this.setState({dialogAnswer: false})} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Resposta de {this.state.authorAnswer}</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        margin="dense"
                                        label="Autor da resposta"
                                        type="text"
                                        fullWidth
                                        value={this.state.authorAnswer}
                                        className="form-input"
                                        disabled
                                    />
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        label="Resposta"
                                        type="text"
                                        multiline
                                        fullWidth
                                        value={this.state.answer}
                                        className="form-input"
                                        disabled
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <CustomButton 
                                        text="Fechar"
                                        onClick={() => {
                                            this.closeAnswerDialog()
                                        }} 
                                        color="default"
                                        variant="contained"
                                        icon="clear"
                                    />
                                </DialogActions>
                            </Dialog>
                            { this.state.answers.length === 0 && !this.state.error && !this.state.loading &&
                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
                                        <p>Ops, parece que este comentário não possui respostas</p>
                                    </Box>
                                </Grid>
                            }
                        </Grid>
                    </Paper>
                }
                { this.state.loading && 
                    <Grid item xs={12} className="comment-content">
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                            <img src={Searching} alt="Carregando comentário" />
                            <h4>Carregando, por favor aguarde...</h4>
                        </Box>
                    </Grid>
                }
                { this.state.error && 
                    <ErrorBlock />
                }
            </Container> 
        )
    }
}

export default Comment