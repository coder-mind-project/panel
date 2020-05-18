import {
  styled,
  Box,
} from '@material-ui/core';

import { devices } from '@/config/devices';

export const NotFoundBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  [devices.tablet]: {
    flexDirection: 'column',
  },
  '& img': {
    maxWidth: '300px',
    [devices.tablet]: {
      maxWidth: '100%',
    },
  },
});

export default { NotFoundBox };
