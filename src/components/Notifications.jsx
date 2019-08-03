import React, { Component } from 'react'
import axios from 'axios'
import { backendUrl } from '../config/backend'

import { Box, IconButton, Icon,
    CircularProgress, Badge, Fade,
    Divider, Menu, BottomNavigation, 
    BottomNavigationAction } from '@material-ui/core'

import NotificationItem from './NotificationItem.jsx'

import { connect } from 'react-redux'

import './css/Notifications.css'

class Notifications extends Component {

    constructor(props){
        super(props)
        this.menuRef = React.createRef()
    }

    state = { 
        notifications: [],
        openNotifications: false,
        loading: false,

        bottomNavigationValue: 0,
        selected: 0

    }

    toogleLoading(){
        this.setState({loading: !this.state.loading})
    }

    openMenuNotifications(){
        this.setState({openNotifications: true})
    }

    closeMenuNotifications(){
        this.setState({openNotifications: false})
    }

    async getNotifications(){
        await this.toogleLoading()
        const url = `${backendUrl}/comments?type=not-readed`

        await axios(url).then( res => {
            this.setState({notifications: res.data.comments})
        })

        this.toogleLoading()
    }

    async removeNotification(notification){
        const notifications = this.state.notifications

        const newNotifications = []

        notifications.map( elem => {
            if(elem._id !== notification._id)
                newNotifications.push(elem)

            return elem
        })

        this.setState({
            notifications: newNotifications,
            openNotifications: newNotifications.length === 0 ? false : true
        })
        
    }

    componentDidMount(){
        this.getNotifications()
    }


    render() { 
        return ( 
            <Box mr={3}>
                { this.state.notifications.length === 0 && !this.state.loading &&
                    <Box>
                        <IconButton color="inherit" onClick={() => this.openMenuNotifications()} aria-controls="fade-menu" aria-haspopup="true" ref={this.menuRef}>
                            <Icon>notifications</Icon>
                        </IconButton>
                        <Menu
                            id="fade-menu"
                            anchorEl={this.menuRef.current}
                            keepMounted
                            open={this.state.openNotifications}
                            onClose={() => this.closeMenuNotifications()}
                            TransitionComponent={Fade}
                        >
                            <Box pl={1.3} pr={1.3}>
                                <div className="header-menu">
                                    <Box display="flex" alignItems="center">
                                        <Box mr={1}>
                                            <Icon>notifications_active</Icon>
                                        </Box>
                                        <Box>
                                            <h4>Notificações</h4>
                                            <small>Comentários dos leitores</small>
                                        </Box>
                                    </Box>
                                    <IconButton onClick={() => this.closeMenuNotifications()}>
                                        <Icon>clear</Icon>
                                    </IconButton>
                                </div>
                                <Divider/>
                                <Box p={1} mb={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                    <span>Parabéns, você está em dia</span> 
                                    <span>com seus leitores</span>
                                </Box>
                                <BottomNavigation 
                                    onChange={(event, bottomNavigationValue) => {
                                        this.setState({bottomNavigationValue})
                                    }}
                                    showLabels
                                    value={0}
                                >
                                    <BottomNavigationAction label="Ver todos" className="notification-footer-button" onClick={() => window.location.href = '/comments'} icon={<Icon color="secondary">more_horiz</Icon>} />
                                    <BottomNavigationAction label="Fechar" onClick={() => this.closeMenuNotifications()} icon={<Icon>clear</Icon>} />
                                </BottomNavigation>
                            </Box>
                        </Menu>
                    </Box>
                }
                { this.state.loading &&
                    <Box p={2}>
                        <CircularProgress color="inherit" size={20} />
                    </Box>
                }
                { this.state.notifications.length > 0 && !this.state.loading &&
                    <Box>
                        <Box>
                            <IconButton color="inherit" onClick={() => this.openMenuNotifications()} aria-controls="fade-menu" aria-haspopup="true" ref={this.menuRef}>
                                <Badge badgeContent={this.state.notifications.length} max={99} color="secondary">
                                    <Icon>notifications_active</Icon>
                                </Badge>
                            </IconButton>
                        </Box>
                        <Menu
                            id="fade-menu"
                            anchorEl={this.menuRef.current}
                            keepMounted
                            open={this.state.openNotifications}
                            onClose={() => this.closeMenuNotifications()}
                            TransitionComponent={Fade}
                        >
                            <Box pl={1.3} pr={1.3}>
                                <div className="header-menu">
                                    <Box display="flex" alignItems="center">
                                        <Box mr={1}>
                                            <Icon>notifications_active</Icon>
                                        </Box>
                                        <Box>
                                            <h4>Notificações</h4>
                                            <small>Comentários dos leitores</small>
                                        </Box>
                                    </Box>
                                    <IconButton onClick={() => this.closeMenuNotifications()}>
                                        <Icon>clear</Icon>
                                    </IconButton>
                                </div>
                                <Divider/>
                                <Box p={1} mb={2}>
                                    {this.state.notifications.map(notification => (
                                        <NotificationItem key={notification._id} notification={notification} reloadComments={this.removeNotification.bind(this, notification)} close={this.closeMenuNotifications.bind(this)}/>
                                    ))}
                                </Box>
                                <BottomNavigation 
                                    onChange={(event, bottomNavigationValue) => {
                                        this.setState({bottomNavigationValue})
                                    }}
                                    showLabels
                                    value={0}
                                >
                                    <BottomNavigationAction label="Ver todos" className="notification-footer-button" onClick={() => window.location.href = '/comments'} icon={<Icon color="secondary">more_horiz</Icon>} />
                                    <BottomNavigationAction label="Fechar" onClick={() => this.closeMenuNotifications()} icon={<Icon>clear</Icon>} />
                                </BottomNavigation>
                            </Box>
                        </Menu>
                    </Box>
                }
            </Box>
        )
    }
}

const mapStateToProps = state => ({user: state.user})
export default connect(mapStateToProps)(Notifications)