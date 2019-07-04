import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, Grow, ClickAwayListener, 
    MenuList, MenuItem, useMediaQuery,
    Popper, Paper, Box, Icon, IconButton } from '@material-ui/core'
import { Done, Clear, RestoreFromTrash as Restore,
    Block } from '@material-ui/icons'
import { backendUrl } from '../config/backend'
import { toast } from 'react-toastify'

import CustomButton from './Button.jsx'
import CustomChip from './Chip.jsx'

import LogoDefault from '../assets/HPArticleThumb.png'
import '../pages/defaultPage.css'
import axios from 'axios'

import { Link, Redirect } from 'react-router-dom'


const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        width: '100%',
        borderRadius: 10,
        marginBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        minHeight: 170,
        backgroundColor: '#fff'
    },
    containerXs: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        width: '100%',
        borderRadius: 10,
        marginBottom: 10,
        minHeight: 300,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 8,
        backgroundColor: '#fff'
    },
    logo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgArticle: {
        width: 200,
        marginBottom: 20
    },
    description: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        height: '100%',
    },
    moreInformation: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '.8rem',
        color: 'rgba(0,0,0,.54)',
        padding: 10
    },
    descriptionArea: {
        display: 'flex',
        flexWrap: 'wrap',
        minHeight: 50,
    },
    descriptionText: {
        color: 'rgba(0,0,0,.54)',
        fontSize: '0.8rem',
    },
    info:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        maxHeight: '130',
        padding: 0
    },
    buttonsOptions: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        padding: 0,
        fontSize: '0.8rem'
    },
    iconButton: {
        marginRight: theme.spacing(1),
    },
    button:{
        fontSize: '0.8rem',
        marginTop: 5
    },
    buttonXsScreen: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    }
}))

export default (props) => {
    const matches = useMediaQuery('(min-width: 900px)')
    const classes = useStyles()

    const [open, setOpen] = React.useState(false)
    const [article, setArticle] = React.useState(props.article)
    const [redirectTo, setRedirectTo] = React.useState('')
    
    const anchorRef = React.useRef(null)

    
    const toogle = event => {
        if(open && anchorRef.current && anchorRef.current.contains(event.target)) return
        setOpen(!open)
    }
    
    const formatDate = (date) => {
        if(typeof date === 'string'){
            const aux = date.split('T')
            const aux2 = aux[0].split('-')
            return `${aux2[2]}/${aux2[1]}/${aux2[0]}`
        }
    }

    const reloadPage = () => {
        setTimeout(() => window.location.href = '/articles', 3000)
    }

    const remove = (id) => event => {
        if(!id) toast.error((<div className="centerInline"><Clear className="marginRight"></Clear>Artigo não encontrado</div>), {autoClose: 3000, closeOnClick: true})
    
        const url = `${backendUrl}/article/${id}`
        axios.delete(url).then(async () => {
            await toast.success((<div className="centerInline"><Done className="marginRight"></Done>Artigo&nbsp;<strong>removido</strong>&nbsp;com sucesso</div>), {autoClose: 3000, closeOnClick: true})
            reloadPage()
        }).catch(error => {
            toast.error((<div className="centerInline"><Clear className="marginRight"></Clear>{error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'}</div>))
        })
    }

    const publish = (id) => event => {
        if(!id) toast.error((<div className="centerInline"><Clear className="marginRight"></Clear>Artigo não encontrado</div>), {autoClose: 3000, closeOnClick: true})
    
        const url = `${backendUrl}/article/${id}`
        axios.post(url).then(async (res) => {
            await toast.success((<div className="centerInline"><Done className="marginRight"></Done>Artigo&nbsp;<strong>publicado</strong>&nbsp;com sucesso</div>), {autoClose: 3000, closeOnClick: true})
            setArticle(res.data)
        }).catch(error => {
            toast.error((<div className="centerInline"><Clear className="marginRight"></Clear>{error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'}</div>))
        })
    }

    const inactive = (id) => event => {
        if(!id) toast.error((<div className="centerInline"><Clear className="marginRight"></Clear>Artigo não encontrado</div>), {autoClose: 3000, closeOnClick: true})
    
        const url = `${backendUrl}/article/management/${id}`
        axios(url).then(async (res) => {
            await toast.success((<div className="centerInline"><Done className="marginRight"></Done>Artigo&nbsp;<strong>inativado</strong>&nbsp;com sucesso</div>), {autoClose: 3000, closeOnClick: true})
            setArticle(res.data)
        }).catch(error => {
            toast.error((<div className="centerInline"><Clear className="marginRight"></Clear>{error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'}</div>))
        })
    }
    
    const boost = (id) => event => {
        if(!id) toast.error((<div className="centerInline"><Clear className="marginRight"></Clear>Artigo não encontrado</div>), {autoClose: 3000, closeOnClick: true})
        
        const url = `${backendUrl}/article/management/${id}`
        axios.post(url).then(async (res) => {
            await toast.success((<div className="centerInline"><Done className="marginRight"></Done>Artigo&nbsp;<strong>impulsionado</strong>&nbsp;com sucesso</div>), {autoClose: 3000, closeOnClick: true})
            setArticle(res.data)
        }).catch(error => {
            toast.error((<div className="centerInline"><Clear className="marginRight"></Clear>{error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'}</div>))
        })
    }
    
    const active = (id) => event => {
        if(!id) toast.error((<div className="centerInline"><Clear className="marginRight"></Clear>Artigo não encontrado</div>), {autoClose: 3000, closeOnClick: true})
    
        const url = `${backendUrl}/article/management/${id}`
        axios.put(url).then(async (res) => {
            await toast.success((<div className="centerInline"><Done className="marginRight"></Done>Artigo&nbsp;<strong>reativado</strong>&nbsp;com sucesso</div>), {autoClose: 3000, closeOnClick: true})
            setArticle(res.data)
        }).catch(error => {
            toast.error((<div className="centerInline"><Clear className="marginRight"></Clear>{error.response.data || 'Ocorreu um erro desconhecido, se persistir reporte'}</div>))
        })
    }
    
    
    return (
        <Grid container className={!matches ? classes.containerXs : classes.container}>
            {redirectTo && <Redirect to={redirectTo}/>}
            {!matches && <Container className={classes.info}>
                    <Box className="betweenInline fullWidth">
                            <h3>{article.title}</h3>      
                            <Box ref={anchorRef}>
                                <IconButton aria-haspopup="true" aria-owns="menu-list-options" onClick={toogle}>
                                    <Icon>more_vert</Icon>
                                </IconButton>
                            </Box>
                            <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                    {...TransitionProps}
                                        style={{
                                            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                        }}
                                    >
                                        <Paper id="menu-list-options">
                                            <ClickAwayListener onClickAway={toogle}>
                                                <MenuList>
                                                    {article.published && !article.inactivated && <MenuItem className="centerInline" key={1} onClick={inactive(article._id)}><Block className={classes.iconButton} />Inativar</MenuItem>}
                                                    {article.published && article.inactivated && <MenuItem className="centerInline" key={2} onClick={active(article._id)}><Restore className={classes.iconButton} />Reativar</MenuItem>}
                                                    <MenuItem key={3} onClick={boost(article._id)} ><Icon className="marginRight">share</Icon>Impulsionar</MenuItem>
                                                    <MenuItem key={4} onClick={remove(article._id)}><Icon className="marginRight">delete</Icon>Remover</MenuItem>
                                                    {!article.published && <MenuItem key={5} onClick={publish(article._id)}><Icon className="marginRight">publish</Icon>Publicar</MenuItem>}
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                                
                            </Popper>
                        </Box>
                    <Box className={classes.descriptionArea}><p className={classes.descriptionText}>{article.shortDescription}</p></Box>
                </Container>}
            <Grid item xs={4} className={classes.logo}>
                <img className={classes.imgArticle} src={article.smallImg ? `${backendUrl}/${article.smallImg}` : LogoDefault } alt={article.title}/>
            </Grid>
            {!matches && <Container className={classes.buttonXsScreen}>
                <CustomButton fullWidth={true} text="Ver/Editar" icon="edit" color="a" onClick={() => setRedirectTo(`/edit-article/${article._id}`)} />
            </Container>}
            {matches && <Grid item xs={8} className={classes.description}>
                <Grid item xs={8} className={classes.info}>
                    <h3>{article.title}</h3>
                    <Box className={classes.descriptionArea}><p className={classes.descriptionText}>{article.shortDescription}</p></Box>
                    {article.inactivated && <CustomChip color="warning" sizeIcon="small" icon="warning" text="Inativo" />}
                {article.published && !article.inactivated && !article.boosted && <CustomChip color="success" sizeIcon="small" icon="done" text="Publicado" />}
                {article.boosted && <CustomChip color="primary" sizeIcon="small" icon="star" text="Impulsionado" />}
                </Grid>
                <Grid item xs={4} className={classes.buttonsOptions}>
                    <Link to={`/edit-article/${article._id}`} className="linkRouter">
                        <CustomButton className={classes.button} fullWidth={true} color="default" icon="create" text="Ver/Editar" />
                    </Link>
                    {article.published && <CustomButton className={classes.button} fullWidth={true} icon={article.inactivated ? "restore" : "block"} text={article.inactivated ? "Reativar" : "Inativar" } color="noneOutlinedNoPadding" onClick={article.inactivated ? active(article._id) : inactive(article._id)} />}
                    {!article.published && <CustomButton className={classes.button} fullWidth={true} icon="publish" text="Publicar" color="noneOutlinedNoPadding" onClick={publish(article._id)} />}
                    <CustomButton className={classes.button} fullWidth={true} icon="share" text="Impulsionar" color="noneOutlinedNoPadding" onClick={boost(article._id)} />
                    <CustomButton className={classes.button} fullWidth={true} icon="delete" text="Remover" color="noneOutlinedNoPadding" onClick={remove(article._id)} />
                    <Grid className={classes.moreInformation}>
                        <Box>{article.author && article.author.name ? article.author.name  : 'Autor desconhecido'}</Box>
                        <Box>Criado em: {formatDate(article.createdAt) || 'N/C'}</Box>
                    </Grid>
                </Grid>
            </Grid>}
        </Grid>
    )
}