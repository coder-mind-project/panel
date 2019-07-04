import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Icon from '@material-ui/core/Icon'
import Grid from '@material-ui/core/Grid'


const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 20,
        marginBottom: 20,
    },
    icon: {
        color: 'rgb(50,50,50)'
    },
    line: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'baseline'
    },
    title: {
        color: 'rgb(50,50,50)',
        margin: 0,
        marginLeft: 5,
        fontSize: '1.8rem'
    },
    description: {
        color: 'rgba(0,0,0,.54)',
        margin: 5
    },
}))

export default (props) => {
    const classes = useStyles()
    return(
        <Grid container className={classes.container}>
            <Grid item xs={12} className={classes.line}>
                <Icon fontSize="large" className={classes.icon}>{props.icon}</Icon>
                <h1 className={classes.title}>{props.title}</h1>
            </Grid>
            <Grid item xs={12} className={classes.line}>
                <small className={classes.description}>{props.description}</small>
            </Grid>
            <Divider/>
        </Grid>
    )
}