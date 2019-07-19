import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Divider, Icon, Grid } from '@material-ui/core'

import { styles } from './styles/Header'


const useStyles = makeStyles(styles)

export default (props) => {

    /*
        Propriedades disponíveis

        prop: type - Description
            options : default

        icon: String - Define o ícone do cabeçalho
            <[Opções disponíveis no site https://material.io/tools/icons/]> : '' (String vazia)
        title: String - Define o titulo do cabeçalho
            <[]> : '' (String vazia)
        description: String - Define a descrição do cabeçalho
            <[]> : '' (String vazia)

        
    */

    const classes = useStyles()
    return(
        <Grid container className={classes.container}>
            <Grid item xs={12} className={classes.line}>
                <Icon fontSize="large" className={classes.icon}>
                    {props.icon}
                </Icon>
                <h1 className={classes.title}>
                    {props.title}
                </h1>
            </Grid>
            <Grid item xs={12} className={classes.line}>
                <small className={classes.description}>
                    {props.description}
                </small>
            </Grid>
            <Divider/>
        </Grid>
    )
}