import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Divider, Icon, Grid } from '@material-ui/core'

import { styles } from './styles/Header'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

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
        fontAwesomeIcon: Boolean - Define a utilização do fontawesome para os icons
            <[true, false]> : false
        faIcon: fontAwesomeIcon - Icone da lib do fontawesome
            <[Consulte a lib @fortawesome/free-solid-svg-icons]>
        
    */

    const classes = useStyles()
    return(
        <Grid container className={props.noMarginTop ? classes.containerNoMarginTop : classes.container}>
            <Grid item xs={12} className={classes.line}>
                { !props.fontAwesomeIcon &&
                    <Icon fontSize="large" className={classes.icon}>
                        {props.icon}
                    </Icon>
                }
                { props.fontAwesomeIcon &&
                    <FontAwesomeIcon icon={props.faIcon} size="2x" className={classes.icon}/>
                }
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