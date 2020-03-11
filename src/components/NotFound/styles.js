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
  },
});

export default { NotFoundBox };
