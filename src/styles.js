import { styled, Box } from '@material-ui/core';

import { devices } from './config/devices';

export const AppContent = styled(Box)({
  height: '100vh',
  marginTop: (props) => (props.user._id || props.isvalidating ? 80 : 0),
  marginLeft: (props) => (props.user._id || props.isvalidating ? 80 : 0),
  marginBottom: (props) => (props.user._id || props.isvalidating ? 20 : 0),
  [devices.mobileLarge]: {
    marginLeft: '0 !important',
    marginBottom: (props) => (props.user._id || props.isvalidating ? '80px !important' : 0),
  },
});

export default { AppContent };
