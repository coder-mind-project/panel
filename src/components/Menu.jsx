import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Link} from 'react-router-dom'
import logo from '../assets/dev.png'


//Material UI imports for config Menu 
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Slide from '@material-ui/core/Slide'
import AccountCircle from '@material-ui/icons/AccountCircle'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MenuIcon from '@material-ui/icons/Menu'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import useMediaQuery from '@material-ui/core/useMediaQuery'


const HideOnScroll = props => {
    const {children, window} = props

    const trigger = useScrollTrigger({target: window ? window() : undefined})

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    )
}

const useStyles = makeStyles(theme => ({
    menu: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'rgb(50,50,50)',
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    link: {
        color: 'inherit',
        textDecoration: 'none',
        padding: 23,
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,.1)'
        }
    },
    buttonLink:{
        color: 'inherit',
        textDecoration: 'none'
    },
    drawer: {
        width: 250,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    drawerButton: {
        display: 'flex',
        justifyContent: 'center',
    },
    logo:{
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
    }
}))

export default (props) => {
    const classes = useStyles()

    const matches = useMediaQuery('(min-width: 565px)')

    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const openMyAccountIcon = e => {
        setAnchorEl(e.currentTarget)
    }

    const closeMyAccountIcon = () => {
        setAnchorEl(null)
    }

    const [state, setState] = React.useState({
        drawerMenu: false
    })

    return (
        <div>
            <HideOnScroll {...props}>
                <AppBar className={classes.menu}>
                    <Toolbar>
                        <IconButton onClick={() => setState({drawerMenu: true})} edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        {matches && <Link to="/stats" className={classes.link}>Estatísticas</Link>}
                        {matches && <Link to="/articles" className={classes.link}>Artigos</Link>}
                        {matches && <Link to="/users" className={classes.link}>Usuários</Link>}
                    </Toolbar>
                    <div>
                        <IconButton
                            aria-label="My account"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={openMyAccountIcon}
                            color="inherit">
                            <AccountCircle/>
                        </IconButton>
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
                            
                            <MenuItem>Meus dados</MenuItem>
                            <MenuItem>Meus artigos</MenuItem>
                            <MenuItem>Sair</MenuItem>
                        </Menu>
                    </div>
                </AppBar>
            </HideOnScroll>
            <Drawer open={state.drawerMenu} onClose={() => setState({drawerMenu: false  })}>
                <Link to="/" onClick={() => setState({drawerMenu: false})}>
                    <div className={classes.logo}>
                        <img src={logo} width="125" alt="Estudante TI Logo"/>
                    </div>
                </Link>
                <div className={classes.drawer}>
                    <List className={classes.list}>
                        <Link to="/articles" className={classes.buttonLink} onClick={() => setState({drawerMenu: false})}><ListItem button key={'Artigos'} className={classes.drawerButton}>Artigos</ListItem></Link>
                        <Link to="/users" className={classes.buttonLink} onClick={() => setState({drawerMenu: false})}><ListItem button key={'Usuários'} className={classes.drawerButton}>Usuários</ListItem></Link>
                        <Link to="/stats" className={classes.buttonLink} onClick={() => setState({drawerMenu: false})}><ListItem button key={'Estatísticas'} className={classes.drawerButton}>Estatísticas</ListItem></Link>
                    </List>
                    <List className={classes.list}>
                        <ListItem button onClick={() => setState({drawerMenu: false})} className={classes.drawerButton}>Sair</ListItem>
                    </List>
                </div>  
            </Drawer>
        </div>
    )
}