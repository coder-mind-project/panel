import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import Avatar from 'react-avatar'

import { AppBar, Toolbar, useScrollTrigger, Slide,
    IconButton, Menu, MenuItem, Drawer, List, ListItem,
    useMediaQuery, Icon, Box, Divider } from '@material-ui/core'

import Logo from '../assets/logo-gestao-branco.png'
import LogoBlack from '../assets/logo-gestao-preto.png'

import Notifications from './Notifications.jsx'

import { styles } from './styles/Menu'
import { backendUrl } from '../config/backend';

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
    const matches = useMediaQuery('(min-width: 820px)')

    const [anchorEl, setAnchorEl] = React.useState(null)

    const open = Boolean(anchorEl)

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
                        { !matches && 
                            <IconButton onClick={() => setState({drawerMenu: true})} 
                                edge="start" className={classes.menuButton}
                                color="inherit" aria-label="Menu"
                            >
                                <Icon>menu</Icon>
                            </IconButton>
                        }
                        <Link className={classes.link} to="/">
                            <img src={Logo} width="130"
                                className={classes.menuLogo}
                                alt="Coder Mind | Gestão"
                            />

                            {/* <h2>Coder Mind</h2> */}
                        </Link>
                        { matches && 
                            <Link to="/articles" className={classes.menuLink}>
                                <strong className={classes.menuButtonContent}>
                                    Artigos
                                </strong>
                            </Link>
                        }
                        { matches && 
                            <Link to="/users" className={classes.menuLink}>
                                <strong className={classes.menuButtonContent}>
                                    Usuários
                                </strong>
                            </Link>
                        }
                        { matches && 
                            <Link to="/management" className={classes.menuLink}>
                                <strong className={classes.menuButtonContent}>
                                    Configurações
                                </strong>
                            </Link>
                        }
                    </Toolbar>
                    <div>
                        { props.user && props.user.name ?
                            <Box display="flex" alignItems="center">
                                <Notifications />
                                <div className={classes.menuButton}>
                                    <Avatar onClick={openMyAccountIcon} 
                                        style={{cursor: 'pointer'}} color="#888"
                                        size="50" round="30px" src={`${backendUrl}/${props.user.profilePhoto}`}
                                        />
                                </div>
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
                            {/*  */}
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
                            { /* <MenuItem>
                                <span className={classes.menuButtonContent}>
                                    <Icon className={classes.iconButtonMenu}>
                                        library_books
                                    </Icon>
                                    Meus artigos
                                </span>
                            </MenuItem> */}
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
            <Drawer open={state.drawerMenu} 
                onClose={() => setState({drawerMenu: false})}
            >
                <Link to="/" onClick={() => setState({drawerMenu: false})}>
                    <div className={classes.logo}>
                            <img src={LogoBlack} width="180"
                                alt="Coder Mind | Gestão"
                            />
                        {/* <h2>Coder Mind</h2> */}
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
                        <Link to="/users" className={classes.buttonLink}
                            onClick={() => setState({drawerMenu: false})}
                        >
                            <ListItem button  
                                className={classes.drawerButton}
                            >
                                <strong className={classes.menuButtonContent}>
                                    <Icon  className={classes.iconButtonMenu}>
                                        person_outline
                                    </Icon>
                                    Usuários
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
                        <Link to="/management" className={classes.buttonLink}
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
                        </Link>
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