import {
  styled,
  Box,
  Slide,
} from '@material-ui/core';

import { Link } from 'react-router-dom';
import { devices } from '@/config/devices';


export const CustomLink = styled(Link)({
  textDecoration: 'none',
});

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

export const CustomToast = styled(Slide)({
  marginTop: 50,
});
