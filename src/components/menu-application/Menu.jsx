import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import Avatar from 'react-avatar'

import { AppBar, Toolbar, useScrollTrigger, Slide,
    IconButton, Menu, MenuItem, Drawer, List, ListItem,
    useMediaQuery, Icon, Box, Divider, Tooltip } from '@material-ui/core'

import Logo from '../../assets/coder-mind-painelv1-branco.png'
import LogoBlack from '../../assets/coder-mind-painelv1-preto.png'

import Notifications from './Comments/Notifications.jsx'
import MoreInfo from '../Dialogs/MoreInfo.jsx'

import { styles } from './styles/Menu'
import { backendUrl } from '../../config/backend'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCode } from '@fortawesome/free-solid-svg-icons'

const HideOnScroll = props => {
    const {children, window} = props

    const trigger = useScrollTrigger({target: window ? window() : undefined})

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    )
}

const useStyles = makeStyles(styles)

const MenuApp = props => {
    const classes = useStyles()
    // const matches350 = useMediaQuery('(min-width: 350px)')
    const matches460 = useMediaQuery('(min-width: 460px)')

    const [anchorEl, setAnchorEl] = React.useState(null)
    
    const [dialog, setDialog] = React.useState(false)

    const open = Boolean(anchorEl)

    const openDialog = () => {
        closeMyAccountIcon()
        setDialog(true)
    }

    const closeDialog = () => {
        setDialog(false)
    }

    const openMyAccountIcon = e => {
        setAnchorEl(e.currentTarget)
    }

    const closeMyAccountIcon = () => {
        setAnchorEl(null)
    }

    const logout = () => {
        localStorage.removeItem('user')
        window.location.href = "/auth"
    }

    const [state, setState] = React.useState({
        drawerMenu: false,
        redirectTo: ''
    })

    return (
        
        <div className={props.menu ? "" : classes.hide}>
            {state.redirectTo && 
                <Redirect to={`/${state.redirectTo}`}/>
            }
            <HideOnScroll {...props}>
                <AppBar className={classes.menu}>
                    <Toolbar>
                        <IconButton onClick={() => setState({drawerMenu: true})} 
                            edge="start" className={classes.menuButton}
                            color="inherit" aria-label="Menu"
                        >
                            <Icon>menu</Icon>
                        </IconButton>
                        <Link className={classes.link} to="/">
                            <img src={Logo} width="130"
                                className={classes.menuLogo}
                                alt="Painel Coder Mind"
                            />
                        </Link>
                    </Toolbar>
                    <div>
                        { props.user && props.user.name ?
                            <Box display="flex" alignItems="center">
                                { matches460 && 
                                    <Notifications />
                                }
                                { props.user.tagAuthor && <Box mr={3}>
                                    <Tooltip title={`Olá ${props.user.name}, seu nivel de acesso atual é: Autor`}>
                                        <IconButton onClick={openDialog} >
                                            <FontAwesomeIcon icon={faBook} color="#fff"/> 
                                        </IconButton>
                                    </Tooltip>
                                </Box>}
                                { props.user.tagAdmin && <Box mr={3}>
                                    <Tooltip title={`Olá ${props.user.name}, seu nivel de acesso atual é: Administrador`}>
                                        <IconButton onClick={openDialog} >
                                            <FontAwesomeIcon icon={faCode} color="#fff"/> 
                                        </IconButton>
                                    </Tooltip>
                                </Box>}
                                { matches460 && 
                                    <div className={classes.menuButton}>
                                        <Avatar onClick={openMyAccountIcon} 
                                            style={{cursor: 'pointer'}} color="#888"
                                            name={props.user.name} size="50" round="30px" src={`${backendUrl}/${props.user.profilePhoto}`}
                                        />
                                    </div>
                                }
                            </Box> : '' 
                            
                        }
                        <Menu
                            id="my-account-menu"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={open}
                            onClose={closeMyAccountIcon}>
                            <Link to="/my-account" onClick={() => closeMyAccountIcon()} className="linkRouterBlack">
                                <MenuItem>
                                    <span className={classes.menuButtonContent}>
                                        <Icon className={classes.iconButtonMenu}>
                                            person_outline
                                        </Icon>
                                        Meus dados
                                    </span>
                                </MenuItem>
                            </Link>
                            <Link to="/ticket" onClick={() => closeMyAccountIcon()} className="linkRouterBlack">
                                <MenuItem>
                                    <span className={classes.menuButtonContent}>
                                        <Icon className={classes.iconButtonMenu}>
                                            feedback
                                        </Icon>
                                        Fale conosco
                                    </span>
                                </MenuItem>
                            </Link>
                            <MenuItem onClick={logout}>
                                <span className={classes.menuButtonContent}>
                                    <Icon className={classes.iconButtonMenu}>
                                        exit_to_app
                                    </Icon>
                                    Sair
                                </span>
                            </MenuItem>
                        </Menu>
                    </div>
                </AppBar>
            </HideOnScroll>

            {/* Modal de mais informações */}
            { dialog && <MoreInfo closeDialog={closeDialog} user={props.user} />}

            <Drawer open={state.drawerMenu} 
                onClose={() => setState({drawerMenu: false})}
            >
                <Link to="/" onClick={() => setState({drawerMenu: false})}>
                    <div className={classes.logo}>
                            <img src={LogoBlack} width="180"
                                alt="Painel Coder Mind"
                            />
                    </div>
                </Link>
                <Divider />
                <div className={classes.drawer}>
                    <List className={classes.list}>
                        <Link to="/articles" className={classes.buttonLink}
                            onClick={() => setState({drawerMenu: false})}
                        >
                            <ListItem button  
                                className={classes.drawerButton}
                            >
                                <strong className={classes.menuButtonContent}>
                                    <Icon className={classes.iconButtonMenu}>
                                        library_books
                                    </Icon>
                                    Artigos
                                </strong>
                            </ListItem>
                        </Link>
                        <Link to="/stats" className={classes.buttonLink}
                            onClick={() => setState({drawerMenu: false})}
                        >
                            <ListItem button 
                                className={classes.drawerButton}
                            >
                                <strong className={classes.menuButtonContent}>
                                    <Icon  className={classes.iconButtonMenu}>
                                        assessment
                                    </Icon>
                                    Estatísticas
                                </strong>
                            </ListItem>
                        </Link>
                        <Link to="/comments" className={classes.buttonLink}
                            onClick={() => setState({drawerMenu: false})}
                        >
                            <ListItem button 
                                className={classes.drawerButton}
                            >
                                <strong className={classes.menuButtonContent}>
                                    <Icon  className={classes.iconButtonMenu}>
                                        question_answer
                                    </Icon>
                                    Comentários
                                </strong>
                            </ListItem>
                        </Link>
                        { props.user.tagAuthor && <Link to="/themes" className={classes.buttonLink}
                            onClick={() => setState({drawerMenu: false})}
                        >
                            <ListItem button
                                className={classes.drawerButton}
                            >
                                <strong className={classes.menuButtonContent}>
                                    <Icon  className={classes.iconButtonMenu}>
                                        bookmark
                                    </Icon>
                                    Temas
                                </strong>
                            </ListItem>
                        </Link>}
                        {props.user.tagAuthor && <Link to="/categories" className={classes.buttonLink}
                            onClick={() => setState({drawerMenu: false})}
                        >
                            <ListItem button
                                className={classes.drawerButton}
                            >
                                <strong className={classes.menuButtonContent}>
                                    <Icon  className={classes.iconButtonMenu}>
                                        category
                                    </Icon>
                                    Categorias
                                </strong>
                            </ListItem>
                        </Link>}
                        <Link to="/my-account" className={classes.buttonLink}
                            onClick={() => setState({drawerMenu: false})}
                        >
                            <ListItem button
                                className={classes.drawerButton}
                            >
                                <strong className={classes.menuButtonContent}>
                                    <Icon  className={classes.iconButtonMenu}>
                                        person_outline
                                    </Icon>
                                    Meus dados
                                </strong>
                            </ListItem>
                        </Link>
                        { props.user.tagAdmin && <Link to="/management" className={classes.buttonLink}
                            onClick={() => setState({drawerMenu: false})}
                        >
                            <ListItem button 
                                className={classes.drawerButton}
                            >
                                <strong className={classes.menuButtonContent}>
                                    <Icon  className={classes.iconButtonMenu}>
                                        settings
                                    </Icon>
                                    Configurações
                                </strong>
                            </ListItem>
                        </Link>}
                    </List>
                    <List className={classes.list}>
                        <ListItem button onClick={logout} 
                            className={classes.drawerButton}
                        >
                            <strong className={classes.menuButtonContent}>
                                <Icon  className={classes.iconButtonMenu}>
                                    exit_to_app
                                </Icon>
                                Sair
                            </strong>
                        </ListItem>
                    </List>
                </div>  
            </Drawer>
        </div>
        )
}

const mapStateToProps = state => ({user: state.user, menu: state.menu})

export default connect(mapStateToProps)(MenuApp)