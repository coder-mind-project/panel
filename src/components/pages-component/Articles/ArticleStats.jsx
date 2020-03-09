import React, { Component } from 'react'
import { Grid, Box, Table, TableBody, TableCell,
    TableHead, TableRow,
    Container, Paper, Icon, DialogTitle, DialogActions,
    DialogContent, DialogContentText, Dialog, TextField } from '@material-ui/core'

import axios from 'axios'
import { backendUrl, defineErrorMsg } from '../../../config/backend'

import Searching from '../../../assets/loading.gif'
import ErrorBlock from '../../ErrorBlock.jsx'
import StatsBlock from '../../Statistics/StatsBlock.jsx'
import CustomChip from '../../Chip.jsx'
import CustomIconButton from '../../IconButton.jsx'
import CustomButton from '../../Buttons/Button'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { callToast } from '../../../redux/toast/toastActions'
import { success, error, info } from '../../../config/toasts'

import { DEFAULT_LIMIT } from '../../../config/dataProperties'

import './css/ArticleStats.css'

const INITIAL_COMMENT = {
    _id: '',
    userName: '',
    userEmail: '',
    comment: '',
    readed: false,
    confirmed: false,
    article: null
}

class ArticleStats extends Component {
    state = {
        loading: false,
        countViews: 0,
        countComments: 0,
        comments: [],
        countLikes: 0,
        error: false,

        limitComments: DEFAULT_LIMIT,
        pageComments: 1,

        comment: INITIAL_COMMENT,
        dialogAnswer: false,
        answer: '',
        sendingAnswer: false,
    }

    toogleLoading(){
        this.setState({loading: !this.state.loading})
    }

    changePage = async (event, page) => {
        /* Realiza a alternação de páginas da tabela de registros */

        await this.setState({
            pageComments: ++page
        })

        //this.searchUsers()
    }

    openComment(comment){
        if(!comment.readed){
            this.readComment(comment)
        }
        this.setState({dialogAnswer: true, comment})
    }

    aproveComment(comment){
        if(comment.confirmed)
            return this.props.callToast(info('Este comentário já está aprovado'))

        comment.confirmed = true

        const url = `${backendUrl}/comments`
        axios.patch(url, comment).then(() => {
            this.props.callToast(success('Comentário aprovado com sucesso'))
            this.getComments()
        }).catch(async err => {
            const msg = await defineErrorMsg(err)
            this.props.callToast(error(msg))
        })
    }

    getComments(){
        if(!this.props.article) return this.props.callToast(error('Ocorreu um erro ao encontrar o artigo, se persistir reporte!'))
        const page = this.state.pageComments
        const limit = this.state.limitComments

        const url = `${backendUrl}/articles/comments/${this.props.article._id}?page=${page}&limit=${limit}`
        axios(url).then(res => {
            this.setState({
                comments: res.data.comments,
                countComments: res.data.count
            })
        })
    }

    readComment(comment){
        const readed = {
            _id: comment._id,
            readed: true
        }

        const url = `${backendUrl}/comments`

        axios.patch(url, readed)
    }

    closeAnswerDialog(){
        this.setState({dialogAnswer: false, answer: '', comment: INITIAL_COMMENT})
    }

    toogleSendingAnswer(){
        this.setState({sendingAnswer: !this.state.sendingAnswer})
    }

    async sendAnswer(){
        const url = `${backendUrl}/comments`

        const body = {
            ...this.state.comment,
            answer: this.state.answer
        }

        await this.toogleSendingAnswer()

        await axios.post(url, body).then(res => {
            this.props.callToast(success(res.data))
            this.closeAnswerDialog()
        }).catch( async err => {
            const msg = await defineErrorMsg(err)
            this.props.callToast(error(msg))
        })

        this.toogleSendingAnswer()
    }

    async getStats(){
        try {
            const articleId = this.props.article._id
            if(!articleId) return this.setState({error: true})

            await this.toogleLoading()
            const url = `${backendUrl}/articles/stats/${articleId}`
            await axios(url).then( res => {
                this.setState({
                    countViews: res.data.views.count,
                    countComments: res.data.comments.count,
                    comments: res.data.comments.comments,
                    countLikes: res.data.likes.count,
                    error: false
                })
            })

            this.toogleLoading()
        } catch (error) {
            this.setState({error: true})
        }
    }

    componentDidMount(){
        this.getStats()
    }

    render() {
        return (
            <Grid item xs={12}>
                { this.state.loading &&
                    <Box display="flex" alignItems="center" flexDirection="column" m={5} p={5}>
                        <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                            <img src={Searching} alt="Carregando artigo"/>
                        </Box>
                        <h4>Carregando estatísticas, por favor aguarde...</h4>
                    </Box>
                }
                { !this.state.loading && !this.state.error &&
                    <Grid item xs={12}>
                        <Box pl={5} pr={5}>
                            <Box display="flex" alignItems="center" width="100%">
                                <Box mr={1}>
                                    <Icon>show_chart</Icon>
                                </Box>
                                <Box>
                                    <h4>Força do artigo</h4>
                                </Box>
                            </Box>
                        </Box>
                        <Box className="stats-blocks">
                            <Grid item xs={12}>
                                <Grid item xs={12} md={4}>
                                    <StatsBlock icon="touch_app" title="Visualizações" loadingMsg="Obtendo visualizações" data={{id: 'none', count: this.state.countViews}} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <StatsBlock icon="thumb_up" title="Curtidas" loadingMsg="Obtendo avaliações" data={{id: 'none', count: this.state.countLikes}} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <StatsBlock icon="comment" title="Comentários" loadingMsg="Obtendo comentários" data={{id: 'none', count: this.state.countComments}} />
                                </Grid>
                            </Grid>
                        </Box>
                        { this.state.comments.length > 0 && !this.state.loading &&
                            <Box>
                                <Box pl={5} pr={5}>
                                    <Box display="flex" alignItems="center" width="100%">
                                        <Box mr={1}>
                                            <Icon>chat_bubble_outline</Icon>
                                        </Box>
                                        <Box>
                                            <h4>Comentários</h4>
                                        </Box>
                                    </Box>
                                </Box>
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
                                                                color="primary"
                                                                sizeIcon="small"
                                                                icon="done"
                                                                text="Aprovado"/> :
                                                            <CustomChip size="small"
                                                                className="chipTypeUser"
                                                                color="default"
                                                                sizeIcon="small"
                                                                icon="warning"
                                                                text="Não aprovado"
                                                            />
                                                        }
                                                    </TableCell>
                                                    <TableCell scope="_id">
                                                        { comment.confirmed &&
                                                            <CustomIconButton icon="more_horiz"
                                                                aria-label="Answer" color="default"
                                                                tooltip="Responder comentário"
                                                                onClick={() => this.openComment(comment)}
                                                            />
                                                        }
                                                        { !comment.confirmed &&
                                                            <CustomIconButton icon="done"
                                                                aria-label="Aprove" color="default"
                                                                tooltip="Aprovar comentário"
                                                                onClick={() => this.aproveComment(comment)}
                                                            />
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            </TableBody>
                                            {/* Footer da tabela */}
                                            {/*<TableFooter>
                                                <TableRow>
                                                    <TablePagination
                                                        rowsPerPageOptions={OPTIONS_LIMIT}
                                                        colSpan={4}
                                                        count={this.state.countComments}
                                                        rowsPerPage={this.state.limitComments}
                                                        labelRowsPerPage={LIMIT_LABEL}
                                                        labelDisplayedRows={DISPLAYED_ROWS}
                                                        page={this.state.pageComments - 1}
                                                        SelectProps={{ inputProps: {'aria-label': 'Limite'} }}
                                                        onChangePage={this.changePage}

                                                        onChangeRowsPerPage={this.defineLimit}
                                                    />
                                                </TableRow>
                                            </TableFooter>*/}
                                        </Table>
                                    </Container>
                                </Paper>
                        </Box>}
                    </Grid>
                }
                { this.state.error &&
                    <ErrorBlock />
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
                            color="secondary"
                            variant="contained"
                            icon="clear"
                            disabled={this.state.sendingAnswer}
                        />
                        <CustomButton
                            text={this.state.sendingAnswer ? 'Enviando...' : 'Enviar'}
                            onClick={() => this.sendAnswer()}
                            color="primary"
                            variant="contained"
                            icon="save"
                            disabled={this.state.sendingAnswer}
                        />
                    </DialogActions>
                </Dialog>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({toast: state.config})
const mapDispatchToProps = dispatch => bindActionCreators({ callToast }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ArticleStats)
