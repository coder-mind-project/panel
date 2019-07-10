import React from 'react'
import { Button, Icon, makeStyles,
    useMediaQuery, CircularProgress } from '@material-ui/core'

import { styles } from './styles/Button'

const useStyles = makeStyles(styles)
export default (props) => {
    const classes = useStyles()
    const matches = useMediaQuery('(max-width: 690px)')

    /*
        Propriedades disponíveis

        prop: type - Description
            options : default

        color: String - Define o modelo dentre os disponíveis
            <['success', 'danger', 'default', 'gray', 'warning', 'none', 'noneNoPadding', 'defaultOutlined', 'noneOutlinedNoPadding']> : 'default'
        fullWidth: Boolean - Define se terá tamanho máximo. Referente ao componente pai
            <[true, false]> : false
        variant: String - Modelo de variant para ser usado, assim como no material UI
            <['small', 'medium', 'large']> : false
        onClick: Function - Ação realizada ao clicar no botão
            <[]> : undefined
        disabledIcon: Boolean - Flag para habilitar ou desabilitar o ícone
            <[true, false]> : false
        loading: Boolean - Flag para habilitar o loading indicator
            <[true, false]> : false
        iconSize: String - Define o tamanho do ícone, assim como no material UI
            <['inherit','default','small','large']> : 'default'
        icon: String - Define o ícone
            <[Opções disponíveis no site https://material.io/tools/icons/]> : '' (String vazia)
        circularProgressSize: Number | String - Define o tamanho do loading indicator
            <[]> : 15
        CircularProgressColor: String - Define a cor do loading indicator
            <['primary','secondary','inherit']> : 'inherit'
        text: String - Texto do botão
            <[]> : '' (String vazia)
        
    */


    return (
        <Button className={classes[props.color] || classes.default}
                fullWidth={props.fullWidth || matches}
                variant={props.variant || 'contained'}
                onClick={props.onClick}
        >
            { Boolean(!props.disableIcon && !props.loading) &&
                <Icon fontSize={props.iconSize || 'default'} 
                    className={classes.icon}
                >
                    {props.icon}
                </Icon>
            }
            { props.loading && 
                <CircularProgress className={classes.icon}
                    size={props.circularProgressSize || 15}
                    color={props.CircularProgressColor || 'inherit'} 
                />
            }
            {props.text}
        </Button>
    )
}