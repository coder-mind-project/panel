import React from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Icon,
  Tooltip,
} from '@material-ui/core';

function CustomIconButton(props) {
  const {
    tooltip,
    color,
    onClick,
    disabled,
    size,
    icon,
  } = props;

  return (
    <Tooltip title={disabled ? '' : tooltip}>
      <IconButton
        color={color}
        onClick={onClick}
        disabled={disabled}
        size={size}
      >
        <Icon>
          {icon}
        </Icon>
      </IconButton>
    </Tooltip>
  );
}

CustomIconButton.propTypes = {
  tooltip: PropTypes.string,
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'inherit',
    'default',
  ]),
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  icon: PropTypes.string.isRequired,
};

CustomIconButton.defaultProps = {
  tooltip: '',
  color: 'default',
  disabled: false,
  size: 'medium',
};

export default CustomIconButton;
