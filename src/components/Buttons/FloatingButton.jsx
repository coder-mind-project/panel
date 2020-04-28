import React from 'react';
import PropTypes from 'prop-types';
import {
  Slide,
  Icon,
  useScrollTrigger,
  CircularProgress,
} from '@material-ui/core';

import { CustomFab } from '@/components/Buttons/styles';

function FloatingButton(props) {
  const {
    window,
    action,
    icon,
    color,
    direction,
    loading,
    loadingIndicatorColor,
    loadingIndicatorSize,
  } = props;

  const params = { target: window ? window() : undefined, disableHysteresis: true };
  const trigger = useScrollTrigger(params);

  return trigger ? (
    <Slide direction={direction} in mountOnEnter unmountOnExit>
      <CustomFab
        color={color}
        onClick={action}
      >
        { loading
          && (
            <CircularProgress
              color={loadingIndicatorColor}
              size={loadingIndicatorSize}
            />
          )}
        {icon && !loading
          && (
            <Icon>
              {icon}
            </Icon>
          )}
      </CustomFab>
    </Slide>
  ) : null;
}

FloatingButton.propTypes = {
  window: PropTypes.node,
  action: PropTypes.func.isRequired,
  icon: PropTypes.string,
  color: PropTypes.oneOf([
    'default',
    'inherit',
    'primary',
    'secondary',
  ]),
  direction: PropTypes.string,
  loading: PropTypes.bool,
  loadingIndicatorColor: PropTypes.oneOf([
    'inherit',
    'primary',
    'secondary',
  ]),
  loadingIndicatorSize: PropTypes.number,
};

FloatingButton.defaultProps = {
  window: null,
  icon: 'keyboard_arrow_up',
  color: 'primary',
  direction: 'up',
  loading: false,
  loadingIndicatorColor: 'inherit',
  loadingIndicatorSize: 25,
};
export default FloatingButton;
