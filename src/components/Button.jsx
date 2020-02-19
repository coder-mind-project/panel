import React from 'react';
import {
  Button, Icon, makeStyles,
  useMediaQuery, CircularProgress,
} from '@material-ui/core';

import { styles } from './styles/Button';

const useStyles = makeStyles(styles);
export default (props) => {
  /*
        Propriedades disponíveis

        prop: type - Description
            options : default

        color: String - Define o modelo dentre os disponíveis
            <['success', 'danger', 'default', 'gray', 'warning', 'none', 'noneNoPadding',
            'defaultOutlined', 'noneOutlinedNoPadding']> : 'default'
        fullWidth: Boolean - Define se terá tamanho máximo. Referente ao componente pai
            <[true, false]> : false
        variant: String - Modelo de variant para ser usado, assim como no material UI
            <['text', 'outlined', 'contained']> : 'contained'
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
        disabled: Boolean - Desabilita o botão
            <[true, false]> : false

    */

  const classes = useStyles();
  const matches = useMediaQuery('(max-width: 690px)');

  const {
    color,
    fullWidth,
    variant,
    onClick,
    disabled,
    disabledIcon,
    loading,
    icon,
    iconSize,
    circularProgressSize,
    CircularProgressColor,
    text,
  } = { ...props };
  return (
    <Button
      className={classes[color] || classes.default}
      fullWidth={fullWidth || matches}
      variant={variant || 'contained'}
      onClick={onClick}
      disabled={disabled || false}
    >
      { Boolean(!disabledIcon && !loading)
                && (
                <Icon
                  fontSize={iconSize || 'default'}
                  className={classes.icon}
                >
                  {icon}
                </Icon>
                )}
      { loading
                && (
                <CircularProgress
                  className={classes.icon}
                  size={circularProgressSize || 15}
                  color={CircularProgressColor || 'inherit'}
                />
                )}
      {text}
    </Button>
  );
};
