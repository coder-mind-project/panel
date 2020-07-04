import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Typography,
  Box,
} from '@material-ui/core';

import { AppBarIconButton } from './styles';

function ButtonMobileAppBar(props) {
  const {
    icon,
    label,
    color,
    onClick,
    isActive,
  } = props;

  return (
    <AppBarIconButton onClick={onClick}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Icon fontSize="small" color={color}>
          {icon}
        </Icon>
        <Typography component="span" variant="caption" color={color} noWrap>
          {isActive ? <strong>{label}</strong> : label }
        </Typography>
      </Box>
    </AppBarIconButton>
  );
}

ButtonMobileAppBar.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.oneOf([
    'inherit',
    'primary',
    'secondary',
  ]),
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
};

ButtonMobileAppBar.defaultProps = {
  color: 'inherit',
  isActive: false,
};

export default ButtonMobileAppBar;
