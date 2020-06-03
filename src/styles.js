import { styled, Box, Grid } from '@material-ui/core';

import { devices } from './config/devices';

export const AppContent = styled(Box)({
  paddingTop: (props) => (props.user._id || props.isvalidating ? 80 : 0),
  paddingLeft: (props) => (props.user._id || props.isvalidating ? 80 : 0),
  paddingBottom: (props) => (props.user._id || props.isvalidating ? 20 : 0),
  [devices.mobileLarge]: {
    marginLeft: '0 !important',
    marginBottom: (props) => (props.user._id || props.isvalidating ? '80px !important' : 0),
  },
});

export const AppContainer = styled(Grid)({
  backgroundColor: (props) => (props.theme === 'dark' ? 'rgba(40, 40, 40, .8)' : 'rgba(245, 245, 245, .8)'),
  color: (props) => (props.theme === 'dark' ? 'white' : 'auto'),
});

export default { AppContent };
