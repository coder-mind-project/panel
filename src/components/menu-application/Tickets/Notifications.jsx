import React, { Component } from 'react'
import axios from 'axios'
import { backendUrl } from '../../../config/backend'

import { Box, IconButton, Icon,
    CircularProgress, Badge, Fade,
    Divider, Menu, BottomNavigation,
    BottomNavigationAction, Tooltip,
    Typography } from '@material-ui/core'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faIdCard } from "@fortawesome/free-solid-svg-icons"

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
        count: 0,
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
        const url = `${backendUrl}/tickets/notifications`

        await axios(url).then( res => {
            this.setState({notifications: res.data.tickets, count: res.data.count})
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
                        <Tooltip title={(<Typography component="p" variant="body2">Tickets não visualizados</Typography>)}>
                            <IconButton color="inherit" onClick={() => this.openMenuNotifications()} aria-controls="fade-menu" aria-haspopup="true" ref={this.menuRef}>
                                <FontAwesomeIcon icon={faIdCard} size="sm" />
                            </IconButton>
                        </Tooltip>
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
                                            <FontAwesomeIcon icon={faIdCard} />
                                        </Box>
                                        <Box>
                                            <h4>Tickets</h4>
                                            <small>Tickets não visualizados</small>
                                        </Box>
                                    </Box>
                                </div>
                                <Divider/>
                                <Box p={1} mb={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                    <span>Ops, não há nenhum</span>
                                    <span>ticket novo recebido</span>
                                </Box>
                                <BottomNavigation
                                    onChange={(event, bottomNavigationValue) => {
                                        this.setState({bottomNavigationValue})
                                    }}
                                    showLabels
                                    value={0}
                                >
                                    <BottomNavigationAction label="Visualizar Tickets" className="notification-footer-button" onClick={() => window.location.href = '/tickets'} icon={<Icon color="primary">more_horiz</Icon>} />
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
                            <Tooltip title={(<Typography component="p" variant="body2">Tickets não visualizados</Typography>)}>
                                <IconButton color="inherit" onClick={() => this.openMenuNotifications()} aria-controls="fade-menu" aria-haspopup="true" ref={this.menuRef}>
                                    <Badge badgeContent={this.state.count} max={10} color="primary">
                                        <FontAwesomeIcon icon={faIdCard} />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
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
                                    <Box display="flex" alignItems="center" mr={2}>
                                        <Box mr={1}>
                                            <FontAwesomeIcon icon={faIdCard} />
                                        </Box>
                                        <Box>
                                            <h4>Tickets</h4>
                                            <small>Tickets não visualizados</small>
                                        </Box>
                                    </Box>
                                    <IconButton onClick={() => this.closeMenuNotifications()}>
                                        <Icon>clear</Icon>
                                    </IconButton>
                                </div>
                                <Divider/>
                                <Box p={1} mb={2}>
                                    {this.state.notifications.map(notification => (
                                        <NotificationItem key={notification._id} notification={notification.content} reloadComments={this.removeNotification.bind(this, notification)} close={this.closeMenuNotifications.bind(this)}/>
                                    ))}
                                </Box>
                                <BottomNavigation
                                    onChange={(event, bottomNavigationValue) => {
                                        this.setState({bottomNavigationValue})
                                    }}
                                    showLabels
                                    value={0}
                                >
                                    <BottomNavigationAction label="Visualizar Tickets" className="notification-footer-button" onClick={() => window.location.href = '/tickets'} icon={<Icon color="primary">more_horiz</Icon>} />
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
