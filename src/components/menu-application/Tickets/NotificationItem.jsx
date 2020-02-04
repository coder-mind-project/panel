import React from 'react'
import { Box, Grid, Divider } from '@material-ui/core'
import { displayFullDate } from "../../../config/masks"

import './css/NotificationItem.css'

const NotificationItem = props => {

    const defineType = type => {
        switch(type){
            case 'account-changed':{
                return 'Conta alterada - Perfil 2'
            }
            case 'simple-account-problem':{
                return 'Conta alterada - Perfil 1'
            }
            case 'bug-report':{
                return 'Reporte de Bug'
            }
            case 'improvement-suggestion':{
                return 'Sugestão de melhoria'
            }
            default:{
                return 'N/D'
            }
        }
    }

    return (
        <Box className="notification">
            <Grid item xs={12} className="notification-content">
                <h4 className="title"><strong>{defineType(props.notification.type)}</strong></h4>
                <span className="message">Enviado em: { displayFullDate(props.notification.createdAt)}</span>
                <Box className="message">
                    Mensagem: { props.notification.msg.length > 40 ? `${props.notification.msg.slice(0, 37)} ...` : props.notification.msg}
                </Box>
                <Box mt={2}>
                    <Divider />
                </Box>
            </Grid>
        </Box>
    )
}

export default NotificationItem