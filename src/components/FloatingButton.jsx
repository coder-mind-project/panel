import React from 'react';
import PropTypes from 'prop-types';
import {
  Slide, Icon, useScrollTrigger,
} from '@material-ui/core';

import { CustomFab } from '@/components/Buttons/styles';

function FloatingButton(props) {
  const {
    window,
    action,
    icon,
    color,
    direction,
  } = props;

  const params = { target: window ? window() : undefined, disableHysteresis: true };
  const trigger = useScrollTrigger(params);

  return trigger ? (
    <Slide direction={direction} in mountOnEnter unmountOnExit>
      <CustomFab
        color={color}
        onClick={action}
      >
        <Icon>{icon}</Icon>
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
};

FloatingButton.defaultProps = {
  window: null,
  icon: 'keyboard_arrow_up',
  color: 'primary',
  direction: 'up',
};
export default FloatingButton;
