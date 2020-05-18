import React from 'react';
import PropTypes from 'prop-types';
import { useScrollTrigger, Slide } from '@material-ui/core';

const HideOnScroll = (props) => {
  const {
    children,
    direction,
    appear,
    window,
  } = props;

  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={appear} direction={direction} in={!trigger}>
      {children}
    </Slide>
  );
};

HideOnScroll.propTypes = {
  window: PropTypes.node,
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['left', 'right', 'up', 'down']),
  appear: PropTypes.bool,
};

HideOnScroll.defaultProps = {
  window: null,
  direction: 'down',
  appear: false,
};

export default HideOnScroll;
