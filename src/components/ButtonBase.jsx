import React from 'react'
import {ButtonBase, Icon, makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    success: {
        backgroundColor: 'rgb(30,178,15)',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgb(20,158,10)',
        },
        marginBottom: '10px',
        fontSize: '1rem',
        fontWeight: 100,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 4
    },
    danger: {
        backgroundColor: 'rgb(215,49,12)',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgb(200,38,7)',
        },
        marginBottom: '10px',
        fontSize: '1rem',
        fontWeight: 100,
        padding: 10,
        borderRadius: 4
    },
    default: {
        backgroundColor: 'rgb(17,125,187)',
        color: '#fff',
        '&:hover':{
            backgroundColor: 'rgb(10,115,160)',
        },
        marginBottom: '10px',
        fontSize: '1rem',
        fontWeight: 100,
        padding: 10,
        borderRadius: 4
    },
    gray: {
        backgroundColor: 'rgb(213,213,213)',
        color: '#000',
        '&:hover':{
            backgroundColor: 'rgb(200,200,200)',
        },
        marginBottom: '10px',
        fontSize: '1rem',
        fontWeight: 100,
        padding: 10,
        borderRadius: 4
    },
    warning: {
        backgroundColor: 'rgb(255,195,0)',
        color: '#000',
        '&:hover':{
            backgroundColor: 'rgb(235,175,0)',
        },
        marginBottom: '10px',
        fontSize: '1rem',
        fontWeight: 100,
        padding: 10,
        borderRadius: 4
    },
    none:{
        backgroundColor: 'transparent',
        color: '#000',
        '&:hover':{
            backgroundColor: 'transparent',
        },
        marginBottom: '10px',
        fontSize: '1rem',
        fontWeight: 100,
        padding: 10,
        borderRadius: 4
    },
    icon: {
        marginRight: '5px'
    },
}))
export default (props) => {
    const classes = useStyles()

    return (
        <ButtonBase className={classes[props.class] || classes.default}
                type={props.type || 'button'}
                disabled={props.disabled || false}
                onClick={props.onClick}
                >
            <Icon fontSize={props.iconSize || 'default'} className={props.text ? classes.icon : ''}>{props.icon}</Icon>{props.text}
        </ButtonBase>
    )
}