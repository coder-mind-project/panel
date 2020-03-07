import React from 'react';
import {
  Paper,
  Box,
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import TiredRobot from '@/assets/tired_robot_by_vonholdt.jpg';

import { NotFoundBox } from './styles';

const NotFound = (props) => {
  const {
    msg,
    alt,
  } = props;

  return (
    <Paper>
      <NotFoundBox>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          ml={4}
          mr={4}
          mb={3}
        >
          <img
            src={TiredRobot}
            alt={alt}
          />
          <Typography component="figcaption" variant="body2">
            Tired Robot by Vonholdt
          </Typography>
        </Box>
        <Typography component="h4" variant="h6">
          {msg}
        </Typography>
      </NotFoundBox>
    </Paper>
  );
};

NotFound.propTypes = {
  msg: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

NotFound.defaultProps = {
  alt: 'Resource not found',
};

export default NotFound;
