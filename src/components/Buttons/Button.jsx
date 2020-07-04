import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  useMediaQuery,
  CircularProgress,
  Box,
} from '@material-ui/core';

import { devices } from '@/config/devices';
import { CustomButton } from './styles';

function Button(props) {
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
    size,
    marginBottom,
  } = props;

  const matches = useMediaQuery(devices.tablet);

  return (
    <CustomButton
      fullWidth={fullWidth || matches}
      variant={variant}
      color={color}
      onClick={onClick}
      disabled={disabled}
      size={size}
      mb={marginBottom}
    >
      { !disabledIcon && !loading
        && (
          <Icon
            fontSize={iconSize}
            applymargin={text}
          >
            {icon}
          </Icon>
        )
      }
      { loading
        && (
          <CircularProgress
            size={circularProgressSize}
            color={CircularProgressColor}
          />
        )
      }
      <Box ml={loading || (icon && !disabledIcon && text) ? 1 : 0}>
        {text}
      </Box>
    </CustomButton>
  );
}

Button.propTypes = {
  fullWidth: PropTypes.bool,
  variant: PropTypes.oneOf([
    'text',
    'contained',
    'outlined',
  ]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  disabledIcon: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.string,
  iconSize: PropTypes.oneOf([
    'default',
    'inherit',
    'large',
    'small',
  ]),
  circularProgressSize: PropTypes.number,
  CircularProgressColor: PropTypes.oneOf([
    'inherit',
    'primary',
    'secondary',
  ]),
  text: PropTypes.string,
  color: PropTypes.oneOf([
    'default',
    'inherit',
    'primary',
    'secondary',
  ]),
  size: PropTypes.oneOf([
    'large',
    'medium',
    'small',
  ]),
  marginBottom: PropTypes.string,
};

Button.defaultProps = {
  fullWidth: false,
  variant: 'contained',
  disabled: false,
  disabledIcon: false,
  loading: false,
  icon: '',
  iconSize: 'default',
  circularProgressSize: 15,
  CircularProgressColor: 'inherit',
  text: '',
  color: 'primary',
  onClick: null,
  size: 'medium',
  marginBottom: '',
};

export default Button;
