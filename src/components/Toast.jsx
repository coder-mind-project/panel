import React from 'react';

import {
  Snackbar,
  Slide,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import { styles } from './styles/Toast';

const useStyles = makeStyles(styles);

function Toast(props) {
  const {
    hideTime,
    color,
    text,
    closeToast,
    show,
  } = { ...props };

  const { toast } = useStyles();

  const matches = useMediaQuery('(max-width: 565px)');

  const anchorOrigin = { vertical: 'top', horizontal: matches ? 'center' : 'right' };
  const autoHideDuration = hideTime || 3000;
  const severity = color || 'success';
  const msg = text || '';
  const variant = 'filled';

  function close() {
    closeToast();
  }

  return (
    <div>
      { show
        && (
          <Slide in className={toast}>
            <Snackbar
              anchorOrigin={anchorOrigin}
              open
              autoHideDuration={autoHideDuration}
              onClose={close}
            >
              <Alert onClose={close} severity={severity} variant={variant}>
                {msg}
              </Alert>
            </Snackbar>
          </Slide>
        )}
    </div>
  );
}

export default Toast;
