import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 30
    }
}))

export default (props) => {
    const classes = useStyles()
    return(
        <Container className={classes.container}>
            <h2>{props.title}</h2>
            <small>{props.description}</small>
            <Divider/>
        </Container>
    )
}