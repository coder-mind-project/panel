import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Icon } from '@material-ui/core';

function SectionDescription(props) {
  const {
    icon,
    title,
    description,
  } = props;

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="column">
        <Box display="flex">
          <Icon color="action" fontSize="small">{icon}</Icon>
          <Typography component="span" variant="body2">{title}</Typography>
        </Box>
        {description && (
          <Box ml={2}>
            <Typography component="span" variant="caption">{description}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

SectionDescription.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

SectionDescription.defaultProps = {
  icon: 'keyboard_arrow_right',
  description: '',
};

export default SectionDescription;
