import { styled, Box } from '@material-ui/core';

import { devices } from './config/devices';

export const AppContent = styled(Box)({
  marginTop: (props) => (props.user._id || props.isvalidating ? 80 : 0),
  marginLeft: (props) => (props.user._id || props.isvalidating ? 80 : 0),
  marginBottom: 20,
  [devices.mobileLarge]: {
    marginLeft: '0 !important',
    marginBottom: '80px !important',
  },
});

export default { AppContent };
