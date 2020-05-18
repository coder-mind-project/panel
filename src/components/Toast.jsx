import React from 'react';
import PropTypes from 'prop-types';

import {
  Snackbar,
  useMediaQuery,
} from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import { CustomToast } from './styles';

function Toast(props) {
  const {
    hideTime,
    color,
    text,
    closeToast,
    show,
  } = props;

  const matches = useMediaQuery('(max-width: 565px)');

  const anchorOrigin = { vertical: 'top', horizontal: matches ? 'center' : 'right' };

  function close() {
    closeToast();
  }

  return (
    <div>
      { show
        && (
          <CustomToast in>
            <Snackbar
              anchorOrigin={anchorOrigin}
              open
              autoHideDuration={hideTime}
              onClose={close}
            >
              <Alert
                onClose={close}
                severity={color}
                variant="filled"
              >
                {text}
              </Alert>
            </Snackbar>
          </CustomToast>
        )}
    </div>
  );
}

Toast.propTypes = {
  hideTime: PropTypes.number,
  color: PropTypes.oneOf([
    'success',
    'warning',
    'info',
    'error',
  ]),
  text: PropTypes.string.isRequired,
  closeToast: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

Toast.defaultProps = {
  hideTime: 3000,
  color: 'success',
  show: false,
};

export default Toast;
