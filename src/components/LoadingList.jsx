import React from 'react';
import PropTypes from 'prop-types';

import { Box, CircularProgress } from '@material-ui/core';

function LoadingList(props) {
  const {
    height,
    indicatorColor,
    indicatorSize,
  } = props;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height={`${height}px`}
    >
      <CircularProgress color={indicatorColor} size={indicatorSize} />
    </Box>
  );
}


LoadingList.propTypes = {
  height: PropTypes.number,
  indicatorColor: PropTypes.oneOf([
    'primary',
    'secondary',
    'inherit',
  ]),
  indicatorSize: PropTypes.number,
};

LoadingList.defaultProps = {
  height: 450,
  indicatorColor: 'primary',
  indicatorSize: 80,
};

export default LoadingList;
