import {
  styled,
  Paper,
  Box,
} from '@material-ui/core';

import { devices } from '@/config/devices';

export const Block = styled(Paper)({
  height: '170px',
  margin: '5px',
  padding: '15px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  [devices.laptop]: {
    height: '200px',
  },
  [devices.tablet]: {
    height: '170px',
  },
  [devices.mobileMedium]: {
    height: '200px',
  },
});

export const BlockDataInfo = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '5px 15px',
});
