import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Typography,
  Box,
} from '@material-ui/core';

import { CustomChip } from './styles';

function Chip(props) {
  const {
    size,
    sizeIcon,
    icon,
    text,
    variant,
    color,
  } = props;


  return (
    <CustomChip
      color={color}
      size={size}
      label={
        (
          <Box display="flex" alignItems="center">
            {icon && (
              <Icon fontSize={sizeIcon}>
                {icon}
              </Icon>
            )}
            <Typography component="span" variant="body2">
              {text}
            </Typography>
          </Box>
        )
      }
      variant={variant}
    />
  );
}

Chip.propTypes = {
  size: PropTypes.string,
  sizeIcon: PropTypes.string,
  icon: PropTypes.string,
  text: PropTypes.string.isRequired,
  variant: PropTypes.string,
  color: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
  ]),
};

Chip.defaultProps = {
  size: 'medium',
  sizeIcon: 'default',
  icon: '',
  variant: 'default',
  color: 'default',
};

export default Chip;
