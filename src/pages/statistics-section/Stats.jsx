import React, { Component } from 'react'
import { Container, Grid, Box, Icon, Paper,
    TableHead, TableBody, TableCell, TableRow,
    Table, Button, FormGroup, InputLabel,
    Checkbox, CircularProgress, Divider, Switch, MenuItem,
    FormControl, Select } from '@material-ui/core'
import AsyncSelect from 'react-select/async'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy, faMedal, faThumbsUp, faUsers, faBookOpen} from '@fortawesome/free-solid-svg-icons'

import { connect } from 'react-redux'
import { setUser } from '../../redux/userActions'
import { setToast } from '../../redux/toastActions'
import { bindActionCreators } from 'redux'
import { error, info} from '../../config/toasts'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

import Header from '../../components/Header.jsx'
import StatsBlock from '../../components/pages-component/Stats/StatsBlock.jsx'


import { displayFullDate, randomNumber } from '../../config/masks'
import axios from 'axios'
import { backendUrl } from '../../config/backend'

import IpInfoStatsDialog from '../../components/Dialogs/Stats/IpInfoStats.jsx'
import FloatingButton from '../../components/FloatingButton.jsx'

import './css/Stats.css'

import { Line, Doughnut} from 'react-chartjs-2'

import LoadingGraph from '../../assets/loading-graph.gif'

class Stats extends Component{

    state = {
        platformStats: false,
        lastViews: [],
        loadingViews: false,
        lastLikes: [],
        loadingLikes: false,
        views: {},
        comments: {},
        likes: {},
        chartData: {},
        viewsChartData: {},
        viewsTableDataByArticle: [],
        viewsTableDataByAuthor: [],
        likesChartData: {},
        likesTableDataByArticle: [],
        likesTableDataByAuthor: [],

        loadingStats: false,
        loadingArticleStats: false,

        dialogModal: false,
        ipSelected: '',
        year: "",

        article: '',
        dateBegin: null,
        dateEnd: null,
        onlyViews: true,
        onlyLikes: false,
        both: false,
        years: []
    }

    defineYears(){
        const begin = 2019
        let years = this.state.years

        for (let year = begin; year <= new Date().getFullYear(); year++) {
            years.push(year)
        }
        years.sort((x, y) => y-x)

        const year = new Date().getFullYear()

        this.setState({years, year})
    }

    toogleLoadingLikes(){
        this.setState({loadingLikes: !this.state.loadingLikes})
    }

    toogleLoadingViews(){
        this.setState({loadingViews: !this.state.loadingViews})
    }

    toogleLoadingStats(){
        this.setState({loadingStats: !this.state.loadingStats})
    }

    toogleLoadingArticleStats(){
        this.setState({
            loadingArticleStats: !this.state.loadingArticleStats
        })
    }

    filterSubmit(){
        if(!this.state.both && !this.state.onlyLikes && !this.state.onlyViews)
            return this.props.setToast(info('Selecione pelos menos um tipo de busca'))

        if(this.state.both){
            this.getLikes()
            this.getViews()
            return
        }

        if(this.state.onlyLikes) return this.getLikes()
        if(this.state.onlyViews) return this.getViews()
    }

    async getLikes(){
        this.toogleLoadingLikes()

        const dateBegin = this.state.dateBegin || ''
        const dateEnd = this.state.dateEnd || ''
        const article = this.state.article.title || ''

        const url = `${backendUrl}/likes?db=${dateBegin}&de=${dateEnd}&art=${article}`
        await axios(url).then(res => {
            this.setState({lastLikes: res.data.likes})
        })
        this.toogleLoadingLikes()
    }

    async getViews(){
        await this.toogleLoadingViews()

        const dateBegin = this.state.dateBegin || ''
        const dateEnd = this.state.dateEnd || ''
        const article = this.state.article.title || ''

        const url = `${backendUrl}/views?db=${dateBegin}&de=${dateEnd}&art=${article}`
        await axios(url).then(res => {
            this.setState({lastViews: res.data.views})
        })
        this.toogleLoadingViews()
    }

    async getStats(){
        const url = `${backendUrl}/stats?y=${this.state.year}`

        if(this.props.user && this.props.user.platformStats) {
            this.setState({
                platformStats: Boolean(this.props.user.platformStats)
            })
        }

        this.toogleLoadingStats()
        await axios(url).then( res => {
            const chartData = {
                labels: res.data.chartData.month,
                datasets: [
                    {
                        label: 'Visualizações',
                        backgroundColor: 'rgba(19, 78, 94,0.4)',
                        borderColor: 'rgba(19, 78, 94,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(19, 78, 94,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(19, 78, 94,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: res.data.chartData.views
                    },
                    {
                        label: 'Avaliações',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(230, 92, 0, 0.4)',
                        borderColor: 'rgba(230, 92, 0, 1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(230, 92, 0, 1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(230, 92, 0, 1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: res.data.chartData.likes
                    },
                    {
                        label: 'Comentários',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(244,0,0, 0.4)',
                        borderColor: 'rgba(244,0,0, 1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(244,0,0, 1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(244,0,0, 1)',
                        pointHoverBorderColor: 'rgba(244,0,0, 0.4)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: res.data.chartData.comments
                    },
                ]
            }

            this.setState({
                views: res.data.views || [],
                comments: res.data.comments || [],
                likes: res.data.likes || [],
                chartData: chartData || {},
            })
        })
        this.toogleLoadingStats()

        this.getViews()
        this.getLikes()
        this.getArticleStats()
    }

    async getArticleStats(){
        this.toogleLoadingArticleStats()

        const url = `${backendUrl}/stats/articles`

        await axios(url).then(async res => {

            const viewsByArticle = res.data.views.byArticle
            const viewsByAuthor = res.data.views.byAuthor
            const likesByArticle = res.data.likes.byArticle
            const likesByAuthor = res.data.likes.byAuthor

            /* Define os dados originais para persistir na tabela de mais visualizados e mais avaliados*/
            let viewsTableDataByArticle = viewsByArticle.originalData
            let viewsTableDataByAuthor = viewsByAuthor.originalData
            let likesTableDataByArticle = likesByArticle.originalData
            let likesTableDataByAuthor = likesByAuthor.originalData

            /** Ordenando os resultados para apresentar os mais visualizados e mais avaliados */
            viewsTableDataByArticle.sort((elem , secElem) => secElem.quantity - elem.quantity)
            viewsTableDataByAuthor.sort((elem , secElem) => secElem.quantity - elem.quantity)
            likesTableDataByArticle.sort((elem , secElem) => secElem.quantity - elem.quantity)
            likesTableDataByAuthor.sort((elem , secElem) => secElem.quantity - elem.quantity)

            const viewsChartData = this.defineChartByArticle(viewsByArticle)
            // const likesChartData = this.defineChartByArticle(likesByArticle)

            this.setState({viewsChartData, viewsTableDataByArticle, viewsTableDataByAuthor, likesTableDataByArticle, likesTableDataByAuthor})

        })

        this.toogleLoadingArticleStats()
    }

    defineChartByArticle = (byArticle) => {
        /**Define as propriedades para o grafico de views por artigo */

        /** Definição de cores e cores ao passar o mouse para o grafico de visualizações por artigos */
        const colors = byArticle.views.map( _ => {
            return `rgb(${randomNumber(1,255)},${randomNumber(1,255)},${randomNumber(1,255)})`
        })

        const hoverColors = colors.map( color => {
            return color.replace('rgb', 'rgba').replace(')', ',0.5)')
        })

        return {
            labels: byArticle.articles,
            datasets: [{
                data: byArticle.views,
                backgroundColor: colors,
                hoverBackgroundColor: hoverColors
            }]
        }
    }

    async toogleDialogModal(ipAddress){
        await this.setState({ipSelected: !this.state.dialogModal ? ipAddress : ''})

        this.setState({
            dialogModal: !this.state.dialogModal
        })
    }

    handleChange = attr => async evt => {
        await this.setState({
            [attr]: evt.target.value
        })

        if(attr === 'year') this.getStats()
    }

    handleDateBegin = date => {
        this.setState({
            dateBegin: date
        })
    }

    handleDateEnd = date => {
        this.setState({
            dateEnd: date
        })
    }

    handleChangeSelect = (article) => {
        this.setState({article})
    }

    handleChecked = async (evt, attr) => {
        const value = evt.target.checked

        await this.setState({
            [attr]: value
        })

        if(this.state.both && attr === 'both'){
            this.setState({
                onlyLikes: true,
                onlyViews: true
            })
        }

        if(!(!this.state.both && attr === 'both')){
            if(this.state.onlyViews && this.state.onlyLikes){
                this.setState({
                    onlyLikes: true,
                    onlyViews: true,
                    both: true
                })
            }
        }else{
            this.setState({
                onlyLikes: false
            })
        }
    }

    tooglePlatformStats(evt){
        const payload = {
            option: Boolean(evt.target.checked)
        }

        this.setState({
            platformStats: payload.option
        })

        const url = `${backendUrl}/stats/authors`

        axios.patch(url, payload).then( async res => {
            await this.props.setUser(res.data)
            localStorage.setItem('user', JSON.stringify({token: res.data.token}))
            this.getStats()
        }).catch( () => {
            this.props.setToast(error('Ocorreu um erro desconhecido, tente novamente'))
            this.setState({
                platformStats: !payload.option
            })
        })

    }

    loadArticles = async (query) => {
        //Carrega os artigos condicionado pela busca digitada

        if(query.length < 3) return

        const limit = 5
        const url = `${backendUrl}/articles?query=${query}&limit=${limit}`

        const response = await axios(url)
        let articles = response.data.articles.map((article) => {
            return {
                ...article,
                label: article.title,
                value: article.title,
            }
        }) || []

        return articles
    }

    clearFilters(){
        this.setState({
            dateBegin: null,
            dateEnd: null,
            article: ''
        })
    }

    componentDidMount(){
        this.getStats()
        this.defineYears()
    }


    render(){
        return(
            <Container id="component">
                <Header icon="assessment" title="Estatísticas" description="Acompanhe o desempenho de suas publicações"/>
                { this.props.user.tagAdmin && <Box width="100%" display="flex" alignItems="center" justifyContent="flex-end">
                    <InputLabel>Estatísticas da plataforma?</InputLabel>
                    <Switch
                        checked={this.state.platformStats}
                        onChange={(evt) => this.tooglePlatformStats(evt)}
                        id="platform-stats"
                    />
                </Box>}
                <Grid item xs={12} className="stats-blocks-home">
                    <Grid item xs={12} md={4}>
                        <StatsBlock icon="touch_app" loading={this.state.loadingStats} title="Visualizações por mês" loadingMsg="Obtendo visualizações" data={this.state.views} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatsBlock icon="thumb_up" loading={this.state.loadingStats} title="Curtidas por mês" loadingMsg="Obtendo avaliações" data={this.state.likes} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatsBlock icon="comment" loading={this.state.loadingStats} title="Comentários por mês" loadingMsg="Obtendo comentários" data={this.state.comments} />
                    </Grid>
                </Grid>
                { !this.state.loadingStats &&
                    <form onSubmit={ (evt) => { evt.preventDefault(); this.getStats();} }>
                        <Box width="100%" display="flex" flexWrap="wrap" mt={7} mb={2} mr={2} ml={2} >
                            <Box mr={2} mb={2}>
                                <FormControl>
                                    <InputLabel>Ano</InputLabel>
                                    <Select
                                        id="year"
                                        value={this.state.year}
                                        onChange={this.handleChange('year')}
                                    >
                                    {
                                        this.state.years.map( year => <MenuItem value={year} key={year}>{year}</MenuItem>)
                                    }
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </form>
                }
                { this.state.loadingStats &&
                    <Box width="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={5} mb={5}>
                        <img src={LoadingGraph} alt="Carregando"/>
                        <span>Carregando visualizações...</span>
                    </Box>
                }
                { !this.state.loadingStats &&
                    <Line data={this.state.chartData}  options={{title:{ display: `Visualizações ${this.props.user.platformStats && this.props.user.tagAdmin ? 'da plataforma' : `de ${this.props.user.name}`} - Ano ${this.state.year}`, text: `Visualizações ${this.props.user.platformStats && this.props.user.tagAdmin ? 'da plataforma' : `de ${this.props.user.name}`} - Ano ${this.state.year}` , fontSize: 20, padding: 15}}}
                />}
                <Paper className="paper-section">
                    <Box mt={3} display="flex" alignItems="center">
                        <Box mr={1}>
                            <Icon id="filter-for-recent-info">filter_list</Icon>
                        </Box>
                        <Box>
                            <span >Aplique filtros para a relação das ultimas visualizações e avaliações</span>
                        </Box>
                    </Box>
                    <Box width="100%" mt={2} mb={1} display="flex" alignItems="baseline" flexWrap="wrap">
                        <Grid item xs={12} md={4} className="filter-hud">
                            <Box mr={4}>
                                <FormGroup>
                                    <InputLabel className="margin_bottom_x1">Artigo</InputLabel>
                                    <AsyncSelect cacheOptions value={this.state.article} loadOptions={this.loadArticles} isClearable onChange={(value) => this.handleChangeSelect(value)} noOptionsMessage={(event) => event.inputValue.length >= 3 ? 'Nenhum resultado encontrado' : 'Faça uma busca com pelo menos 3 caracteres'} loadingMessage={() => "Carregando..."} placeholder="Informe o artigo" />
                                </FormGroup>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3} className="filter-hud">
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardDatePicker label="Data Inicio"
                                    clearable cancelLabel="Cancelar"
                                    clearLabel="Limpar"
                                    className="form-input-data"
                                    value={this.state.dateBegin}
                                    onChange={ date => this.handleDateBegin(date)}
                                    mask="__/__/____"
                                    maxDateMessage="Data acima do permitido"
                                    minDateMessage="Data abaixo do permitido"
                                    format="DD/MM/YYYY"
                                    invalidDateMessage="Formato de data inválido" />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} md={3} className="filter-hud">
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardDatePicker label="Data fim"
                                    clearable cancelLabel="Cancelar"
                                    clearLabel="Limpar"
                                    className="form-input-data"
                                    value={this.state.dateEnd}
                                    onChange={this.handleDateEnd}
                                    mask="__/__/____"
                                    maxDateMessage="Data acima do permitido"
                                    minDateMessage="Data abaixo do permitido"
                                    format="DD/MM/YYYY"
                                    invalidDateMessage="Formato de data inválido" />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} className="filter-hud">
                            <Box display="flex" flexWrap="wrap" width="100%" alignItems="center" justifyContent="center" m={2}>
                                <Box display="flex" alignItems="center">
                                    <Checkbox
                                        checked={this.state.onlyViews}
                                        onChange={(evt) => this.handleChecked(evt, 'onlyViews')}
                                        value="primary"
                                        disabled={this.state.both}
                                        id="only-views"
                                    />
                                    <label htmlFor="only-views">Somente visualizações</label>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Checkbox
                                        checked={this.state.onlyLikes}
                                        onChange={(evt) => this.handleChecked(evt, 'onlyLikes')}
                                        value="primary"
                                        disabled={this.state.both}
                                        id="only-likes"
                                    />
                                    <label htmlFor="only-likes">Somente avaliações</label>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Checkbox
                                        checked={this.state.both}
                                        onChange={(evt) => this.handleChecked(evt, 'both')}
                                        value="primary"
                                        id="both"
                                    />
                                    <label htmlFor="both">Ambos</label>
                                </Box>
                            </Box>
                        </Grid>
                    </Box>
                    <Box width="100%" display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" className="filter-hud">
                        <Box mr={2} mb={2}>
                            <Button color="secondary" variant="contained" onClick={() => this.filterSubmit()}>Confirmar</Button>
                        </Box>
                        <Box mr={2} mb={2}>
                            <Button color="primary" variant="contained" onClick={() => this.clearFilters()}>Limpar</Button>
                        </Box>
                    </Box>
                </Paper>
                <Box width="100%" display="flex" flexWrap="wrap" justifyContent="center" alignItems="flex-start">
                    <Grid item xs={12} md={6} className="table-results">
                        <Box>
                            <Box width="100%" display="flex" alignItems="center">
                                <Box mr={1}>
                                    <Icon id="recent-views">
                                        access_time
                                    </Icon>
                                </Box>
                                <Box>
                                    <h3>Ultimas visualizações</h3>
                                </Box>
                            </Box>
                            <Box width="100%" mb={1}>
                                <small className="section-description">As mais recentes <strong>visualizações</strong> são apresentadas na tabela abaixo, utilize o filtro acima para melhorar sua busca.</small>
                            </Box>
                            <Box width="100%" mb={2} mt={2}>
                                <Divider/>
                            </Box>
                            { this.state.lastViews.length === 0 && !this.state.loadingViews &&
                                <Box display="flex" mt={5} alignItems="center" justifyContent="center" width="100%">
                                    <Icon>clear</Icon>
                                    <h4>Ops, nenhuma visualização encontrada.</h4>
                                </Box>
                            }
                            { this.state.loadingViews &&
                                <Box display="flex" mt={5} alignItems="center" flexDirection="column" justifyContent="center" width="100%">
                                    <CircularProgress size={70} />
                                    <Box m={1}>
                                        <span>Carregando...</span>
                                    </Box>
                                </Box>
                            }
                            { this.state.lastViews.length > 0 && !this.state.loadingViews &&
                                <Paper className="stats-wrapper-table">
                                    <Table size="small" className="stats-table">
                                    <TableHead>
                                        <TableRow>
                                        <TableCell align="center">Artigo</TableCell>
                                        <TableCell align="center">Leitor</TableCell>
                                        <TableCell align="center">Data de leitura</TableCell>
                                        <TableCell align="center">Acessos</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.lastViews.map(view => (
                                        <TableRow key={view._id}>
                                            <TableCell scope="row">
                                                {Boolean(view.article) &&
                                                    <span>{view.article.title}</span>
                                                }
                                                {!Boolean(view.article) &&
                                                    <span>N/D</span>
                                                }
                                            </TableCell>
                                            <TableCell align="right"><Button size="small" variant="text" color="secondary" onClick={() => this.toogleDialogModal(view.reader)} className="">{view.reader}</Button></TableCell>
                                            <TableCell align="right">{displayFullDate(view.startRead)}</TableCell>
                                            <TableCell align="right">{view.viewsQuantity}</TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                    </Table>
                                </Paper>
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} className="table-results">
                        <Box>
                            <Box width="100%" display="flex" alignItems="center">
                                <Box mr={1}>
                                    <Icon id="recent-avaliation">
                                        thumbs_up_down
                                    </Icon>
                                </Box>
                                <Box>
                                    <h3>Ultimas avaliações</h3>
                                </Box>
                            </Box>
                            <Box width="100%" mb={1}>
                                <small className="section-description">As mais recentes <strong>avaliações</strong> são apresentadas na tabela abaixo, utilize o filtro acima para melhorar sua busca.</small>
                            </Box>
                            <Box width="100%" mb={2} mt={2}>
                                <Divider/>
                            </Box>
                            { this.state.lastLikes.length === 0 && !this.state.loadingLikes &&
                                <Box display="flex" mt={5} alignItems="center" justifyContent="center" width="100%">
                                    <Icon>clear</Icon>
                                    <h4>Ops, nenhuma avaliação encontrada.</h4>
                                </Box>
                            }
                            { this.state.loadingLikes &&
                                <Box display="flex" mt={5} alignItems="center" flexDirection="column" justifyContent="center" width="100%">
                                    <CircularProgress size={70} />
                                    <Box m={1}>
                                        <span>Carregando...</span>
                                    </Box>
                                </Box>
                            }
                            { this.state.lastLikes.length > 0 && !this.state.loadingLikes &&
                                <Paper className="stats-wrapper-table">
                                    <Table size="small" className="stats-table">
                                    <TableHead>
                                        <TableRow>
                                        <TableCell>Artigo</TableCell>
                                        <TableCell align="right">Leitor (IP)</TableCell>
                                        <TableCell align="right">Data da avaliação</TableCell>
                                        <TableCell align="right">Like Ativo</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.lastLikes.map(like => (
                                        <TableRow key={like._id}>
                                            <TableCell scope="row">
                                                {like.article.title}
                                            </TableCell>
                                            <TableCell align="right"><Button size="small" variant="text" color="secondary" onClick={() => this.toogleDialogModal(like.reader)} className="">{like.reader}</Button></TableCell>
                                            <TableCell align="right">{displayFullDate(like.created_at)}</TableCell>
                                            <TableCell align="right">{like.confirmed ? 'Sim' : 'Não'}</TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                    </Table>
                                </Paper>
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        { this.state.viewsChartData && this.state.viewsChartData.datasets && this.state.viewsChartData.datasets[0].data.length > 0 && !this.state.loadingArticleStats &&
                            <Box width="100%">
                                <Box width="100%" display="flex" alignItems="center">
                                    <Box mr={1}>
                                        <Icon id="article-stats">menu_book</Icon>
                                    </Box>
                                    <Box>
                                        <h3>Informações por artigo</h3>
                                    </Box>
                                </Box>
                                <Box width="100%" mb={1}>
                                    <small className="section-description">Informações como visualizações gerais dos artigos, avaliações e mais comentários</small>
                                </Box>
                                <Divider/>
                                <Grid item xs={12}>
                                    <Doughnut data={this.state.viewsChartData} options={{title:{ display: 'Artigos visualizados', text: 'Artigos visualizados', fontSize: 20, padding: 15}}}/>
                                </Grid>
                            </Box>
                        }
                        { this.state.loadingArticleStats &&
                            <Box width="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                <img src={LoadingGraph} alt="Carregando"/>
                                Carregando...
                            </Box>
                        }
                        <Box width="100%" display="flex" alignItems="flex-start" flexWrap="wrap" mt={3}>
                            { this.state.viewsTableDataByArticle.length > 0 &&
                                <Grid item xs={12} md={6}>
                                    <Paper className="stats-short-table">
                                        <Box display="flex" alignItems="center" justifyContent="center" mt={1} mb={1}>
                                            <Box mr={1}>
                                                <FontAwesomeIcon icon={faBookOpen} color="#000" />
                                            </Box>
                                            <Box>
                                                <h4>Mais visualizações</h4>
                                            </Box>
                                        </Box>
                                        <Table size="small" className="stats-table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>#</TableCell>
                                                    <TableCell>Artigo</TableCell>
                                                    <TableCell align="center">Visualizações</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.viewsTableDataByArticle.map((view, index) => (
                                                <TableRow key={view._id}>
                                                    <TableCell scope="row">
                                                        { index === 0 && <FontAwesomeIcon icon={faTrophy} color="#F9A602"/> }
                                                        { index === 1 && <FontAwesomeIcon icon={faMedal} color="#C4CACE"/> }
                                                        { index === 2 && <FontAwesomeIcon icon={faMedal} color="#CD7F32"/> }
                                                        { index > 2 && <span>{ index + 1}</span>}
                                                    </TableCell>
                                                    <TableCell scope="row">
                                                        {view.title}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {view.quantity}
                                                    </TableCell>
                                                </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Paper>
                                </Grid>
                            }
                            { this.state.viewsTableDataByAuthor.length > 0 &&
                                <Grid item xs={12} md={6}>
                                    <Paper className="stats-short-table">
                                        <Box display="flex" alignItems="center" justifyContent="center" mt={1} mb={1}>
                                            <Box mr={1}>
                                                <FontAwesomeIcon icon={faUsers} color="#000" />
                                            </Box>
                                            <Box>
                                                <h4>Top autores - visualizações</h4>
                                            </Box>
                                        </Box>
                                        <Table size="small" className="stats-table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>#</TableCell>
                                                    <TableCell>Autor</TableCell>
                                                    <TableCell align="center">Visualizações</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.viewsTableDataByAuthor.map((view, index) => (
                                                <TableRow key={view._id}>
                                                    <TableCell scope="row">
                                                        { index === 0 && <FontAwesomeIcon icon={faTrophy} color="#F9A602"/> }
                                                        { index === 1 && <FontAwesomeIcon icon={faMedal} color="#C4CACE"/> }
                                                        { index === 2 && <FontAwesomeIcon icon={faMedal} color="#CD7F32"/> }
                                                        { index > 2 && <span>{ index + 1}</span>}
                                                    </TableCell>
                                                    <TableCell scope="row">
                                                        {view.name}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {view.quantity}
                                                    </TableCell>
                                                </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Paper>
                                </Grid>
                            }
                            { this.state.likesTableDataByArticle.length > 0 &&
                                <Grid item xs={12} md={6}>
                                    <Paper className="stats-short-table">
                                        <Box display="flex" alignItems="center" justifyContent="center" mt={1} mb={1}>
                                            <Box mr={1}>
                                                <FontAwesomeIcon icon={faThumbsUp} color="#000" />
                                            </Box>
                                            <Box>
                                                <h4>Mais avaliados</h4>
                                            </Box>
                                        </Box>
                                        <Table size="small" className="stats-table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>#</TableCell>
                                                    <TableCell>Artigo</TableCell>
                                                    <TableCell align="center">Avaliações</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.likesTableDataByArticle.map((view, index) => (
                                                <TableRow key={view._id}>
                                                    <TableCell scope="row">
                                                        { index === 0 && <FontAwesomeIcon icon={faTrophy} color="#F9A602"/> }
                                                        { index === 1 && <FontAwesomeIcon icon={faMedal} color="#C4CACE"/> }
                                                        { index === 2 && <FontAwesomeIcon icon={faMedal} color="#CD7F32"/> }
                                                        { index > 2 && <span>{ index + 1}</span>}
                                                    </TableCell>
                                                    <TableCell scope="row">
                                                        {view.title}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {view.quantity}
                                                    </TableCell>
                                                </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Paper>
                                </Grid>
                            }
                            { this.state.likesTableDataByAuthor.length > 0 &&
                                <Grid item xs={12} md={6}>
                                    <Paper className="stats-short-table">
                                        <Box display="flex" alignItems="center" justifyContent="center" mt={1} mb={1}>
                                            <Box mr={1}>
                                                <FontAwesomeIcon icon={faUsers} color="#000" />
                                            </Box>
                                            <Box>
                                                <h4>Top autores - avaliações</h4>
                                            </Box>
                                        </Box>
                                        <Table size="small" className="stats-table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>#</TableCell>
                                                    <TableCell>Autor</TableCell>
                                                    <TableCell align="center">Avaliações</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.likesTableDataByAuthor.map((view, index) => (
                                                <TableRow key={view._id}>
                                                    <TableCell scope="row">
                                                        { index === 0 && <FontAwesomeIcon icon={faTrophy} color="#F9A602"/> }
                                                        { index === 1 && <FontAwesomeIcon icon={faMedal} color="#C4CACE"/> }
                                                        { index === 2 && <FontAwesomeIcon icon={faMedal} color="#CD7F32"/> }
                                                        { index > 2 && <span>{ index + 1}</span>}
                                                    </TableCell>
                                                    <TableCell scope="row">
                                                        {view.name}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {view.quantity}
                                                    </TableCell>
                                                </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Paper>
                                </Grid>
                            }
                        </Box>
                    </Grid>
                    <IpInfoStatsDialog opened={this.state.dialogModal} closeDialog={() => this.toogleDialogModal()} ipAddress={this.state.ipSelected}/>
                </Box>
                <FloatingButton action={() => document.documentElement.scrollTop = 0} />
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user, toast: state.config})
const mapDispatchToProps = dispatch => bindActionCreators({setUser, setToast}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Stats)
