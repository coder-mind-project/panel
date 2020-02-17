import React from 'react'
import { ButtonBase, Icon, makeStyles, CircularProgress } from '@material-ui/core'

import { styles } from './styles/ButtonBase'

const useStyles = makeStyles(styles)

export default (props) => {

    /*
        Propriedades disponíveis

        prop: type - Description
            options : default

        class: String - Define o modelo dentre os disponíveis
            <['success', 'danger', 'default', 'gray', 'warning', 'none', 'noneNoPadding', 'defaultOutlined', 'defaultMaxWidth', 'noneOutlinedNoPadding']> : 'default'
        type: String - Define o modelo de botão que será assumido
            <['submit', 'reset', 'button]> : 'button'
        disabled: Boolean - Se ativado disabilita o botão
            <[true, false]> : false
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


    const classes = useStyles()

    return (
        <ButtonBase className={ classes[props.class] || classes.default}
                type={props.type || 'button'}
                disabled={props.disabled ? true : false}
                onClick={props.onClick}
                >
            { Boolean(!props.disabledIcon && !props.loading) &&
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
        </ButtonBase>
    )
}