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
  } = props;


  return (
    <CustomChip
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
};

Chip.defaultProps = {
  size: 'medium',
  sizeIcon: 'default',
  icon: '',
  variant: 'default',
};

export default Chip;
