import React from 'react'
import Container from '@material-ui/core/Container'
import {makeStyles} from '@material-ui/core/styles'
import LogoTest from '../assets/dev.png'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        boxShadow: '0px 0px 2px 1px rgba(0,0,0,.5)',
        borderRadius: 10,
        marginBottom: 10,
        padding: 10,
        height: 170
    },
    logo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    textLogo: {
        display: 'flex',
        justifyContent: 'center'
    },
    description: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        height: '100%'
    },
    info:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        maxHeight: '125',
    },
    footBar: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    buttonGreen: {
        color: 'green'
    },
    buttonRed: {
        color: 'red'
    },
    buttonBegge: {
        color: '#B3862B'
    }
}))

export default (props) => {

    const classes = useStyles()
    return (
        <Grid container className={classes.container}>
            <Grid item xs={4} className={classes.logo}>
                <img src={LogoTest} alt="Logo test" width="100"/>
                <p className={classes.textLogo}>{props.title}</p>
            </Grid>
            <Grid item xs={8} className={classes.description}>
                <Container className={classes.info}>
                    <p>{props.description}</p>
                    <span>Autor: {props.author}</span>
                </Container>
                <Container className={classes.footBar}>
                    <Divider />
                    <Button color="primary">Ver/Editar</Button>
                    <Button className={classes.buttonBegge}>Inativar</Button>
                    <Button className={classes.buttonGreen}>Impulsionar</Button>
                    <Button className={classes.buttonRed}>Remover</Button>
                </Container>
            </Grid>
        </Grid>
    )
}