import { styled, Fab } from '@material-ui/core';

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

export default { CustomFab };
