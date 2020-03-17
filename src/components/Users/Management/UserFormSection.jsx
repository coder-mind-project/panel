import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Typography,
} from '@material-ui/core';

import { CustomIcon } from './styles';

function UserFormSection(props) {
  const {
    icon,
    title,
    description,
  } = props;

  return (
    <Box display="flex" alignItems="center" width="100%">
      <CustomIcon color="action" fontSize="large">
        {icon}
      </CustomIcon>
      <Box>
        <Typography component="h3" variant="h6">
          {title}
        </Typography>
        <Typography component="p" variant="body2">
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

UserFormSection.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

UserFormSection.defaultProps = {
  description: '',
};

export default UserFormSection;
