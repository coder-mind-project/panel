import React from 'react';
import {
  Slide, Icon, useScrollTrigger,
} from '@material-ui/core';

import { CustomFab } from '@/components/Buttons/styles';

function FloatingButton(props) {
  const { window, action, icon } = { ...props };

  const params = { target: window ? window() : undefined, disableHysteresis: true };
  const trigger = useScrollTrigger(params);

  return trigger ? (
    <Slide direction="up" in mountOnEnter unmountOnExit>
      <CustomFab
        color="primary"
        onClick={action}
      >
        <Icon>{icon || 'keyboard_arrow_up'}</Icon>
      </CustomFab>
    </Slide>
  ) : null;
}

export default FloatingButton;
