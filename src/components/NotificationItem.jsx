import React from 'react'
import axios from 'axios'
import { backendUrl } from '../config/backend'
import { Box, Grid, Icon, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'

import './css/NotificationItem.css'

const checkNotification = (props) => {
    const readed = {
        _id: props.notification._id,
        readed: true
    }

    const url = `${backendUrl}/comments`

    axios.patch(url, readed).then( () => {
        props.reloadComments()
    })
}

const NotificationItem = props => {
    return (
        <Box className="notification">
            <Grid item xs={2} className="notification-aside">
                <Icon fontSize="large">info</Icon>
                <Button color="secondary" variant="text" onClick={() => checkNotification(props)}>
                    Lido
                </Button>
            </Grid>
            <Grid item xs={10} className="notification-content">
                <h4 className="title"><strong>{props.notification.userName}</strong> fez um novo comentário</h4>
                <small className="description">Artigo <Link to={`/article/${props.notification.article.customURL}`} onClick={() => props.close()}><strong>{props.notification.article.title}</strong></Link></small>
                <Box className="message">
                    { props.notification.comment.length > 40 ? `${props.notification.comment.slice(0, 37)} ...` : props.notification.comment}
                </Box>
            </Grid>
        </Box>
    )
}

export default NotificationItem