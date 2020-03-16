import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import { ErrorFromDataContainer, ErrorFromDataIcon } from './styles';

const ErrorFromData = (props) => {
  const {
    msg,
    icon,
    reload,
    reloadIndicator,
  } = props;

  return (
    <Paper>
      <ErrorFromDataContainer>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          ml={4}
          mr={4}
          mb={3}
        >
          <ErrorFromDataIcon color="action">
            {icon}
          </ErrorFromDataIcon>
        </Box>
        <Box>
          <Box mb={2}>
            <Typography component="h4" variant="h6" align="center">
              {msg}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              color="primary"
              variant="contained"
              onClick={reload}
            >
              {reloadIndicator}
            </Button>
          </Box>
        </Box>
      </ErrorFromDataContainer>
    </Paper>
  );
};

ErrorFromData.propTypes = {
  msg: PropTypes.string.isRequired,
  icon: PropTypes.string,
  reload: PropTypes.func,
  reloadIndicator: PropTypes.string,
};

ErrorFromData.defaultProps = {
  icon: 'clear',
  reloadIndicator: 'Recarregar',
  reload: () => null,
};

export default ErrorFromData;
