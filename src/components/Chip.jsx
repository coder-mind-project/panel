import React from 'react'
import {Chip, makeStyles, Icon} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    success: {
        backgroundColor: 'rgb(30,178,15)',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgba(20,168,10)',
        },
    },
    danger: {
        backgroundColor: 'rgb(215,49,12)',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgba(205,39,7)',
        },
    },
    default: {
        backgroundColor: 'rgb(17,125,187)',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgba(10,115,177)',
        },
    },
    gray: {
        backgroundColor: 'rgb(213,213,213)',
        color: '#000',
        '&:hover':{
            backgroundColor: 'rgba(203,203,203)',
        },
    },
    warning: {
        backgroundColor: 'rgb(255,195,0)',
        color: '#000',
        '&:hover':{
            backgroundColor: 'rgba(245,185,0)',
        },
    },
    chipContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 125
    }
}))
export default (props) => {
    const classes = useStyles()

    return (
        <Chip className={classes[props.color] || classes.default}
            size={props.size || 'medium'}
            label={(<span className={classes.chipContent}><Icon fontSize={props.sizeIcon || 'default'}>{props.icon}</Icon>{props.text}</span>)}
            variant={props.variant || 'default'}
        />
    )
}