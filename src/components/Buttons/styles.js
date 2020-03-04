import { styled, Fab } from '@material-ui/core';

export const CustomFab = styled(Fab)({
  zIndex: 1000,
  position: 'fixed',
  left: '90%',
  top: '80%',
  overflow: 'hidden',
});

export default { CustomFab };
