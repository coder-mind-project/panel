import { styled, Fab, Button } from '@material-ui/core';

import { devices } from '@/config/devices';

export const CustomFab = styled(Fab)({
  zIndex: 1000,
  position: 'fixed',
  left: '90%',
  top: '80%',
  overflow: 'hidden',
  [devices.mobileLarge]: {
    left: '75%',
    top: '75% ',
  },
});

export const CustomButton = styled(Button)({
  marginBottom: '10px',
  paddingLeft: '10px',
  paddingRight: '10px',
  '& .MuiCircularProgress-root': {
    marginRight: (props) => (props.applymargin ? '5px' : 0),
  },
  '& .MuiIcon-root': {
    marginRight: (props) => (props.applymargin ? '5px' : 0),
  },
});
