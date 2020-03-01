import React from 'react';
import {
  Slide, Fab, Icon, useScrollTrigger,
} from '@material-ui/core';

import '../pages/css/defaultPage.css';

function FloatingButton(props) {
  const { window, action, icon } = { ...props };

  const params = { target: window ? window() : undefined, disableHysteresis: true };
  const trigger = useScrollTrigger(params);

  return trigger ? (
    <Slide direction="up" in mountOnEnter unmountOnExit>
      <Fab
        color="primary"
        className="floatingButton"
        onClick={action}
      >
        <Icon>{icon || 'keyboard_arrow_up'}</Icon>
      </Fab>
    </Slide>
  ) : null;
}

export default FloatingButton;
