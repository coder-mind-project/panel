import React from 'react';
import PropTypes from 'prop-types';

import { Box, Typography } from '@material-ui/core';

import { SettingsIcon } from './styles';

function SettingsDialogContentHeader(props) {
  const {
    title,
    icon,
  } = props;

  return (

    <Box
      display="flex"
      alignItems="center"
      width="100%"
      mb={2}
    >
      { icon && (
      <SettingsIcon color="action">
        {icon}
      </SettingsIcon>
      )}
      <Typography component="h4" variant="h6">
        {title}
      </Typography>
    </Box>
  );
}

SettingsDialogContentHeader.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
};

SettingsDialogContentHeader.defaultProps = {
  icon: '',
};

export default SettingsDialogContentHeader;
