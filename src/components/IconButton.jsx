import React from 'react'
import {IconButton, makeStyles, Icon, Tooltip} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    success: {
        color: 'rgb(30,178,15)',
        '&:hover':{
            backgroundColor: 'rgba(30,178,15,0.1)',
        },
    },
    danger: {
        color: 'rgb(215,49,12)',
        '&:hover':{
            backgroundColor: 'rgba(215,49,12,0.1)',
        },
    },
    default: {
        color: 'rgb(17,125,187)',
        '&:hover':{
            backgroundColor: 'rgba(17,125,187,0.1)',
        },
    },
    gray: {
        color: 'rgb(213,213,213)',
        '&:hover':{
            backgroundColor: 'rgba(213,213,213,0.1)',
        },
    },
    warning: {
        color: 'rgb(255,195,0)',
        '&:hover':{
            backgroundColor: 'rgba(255,195,0,0.1)',
        },
    },
    icon: {
        marginRight: '5px'
    }
}))
export default (props) => {
    const classes = useStyles()

    return (
        <Tooltip title={props.tooltip || ''}>
            <IconButton className={classes[props.color] || classes.default}
                    onClick={props.onClick}
                    disabled={props.disabled || false}
                    size={props.size || 'medium'}
                >
                <Icon>{props.icon}</Icon>
            </IconButton>
        </Tooltip>
    )
}