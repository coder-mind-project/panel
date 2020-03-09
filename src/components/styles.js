import {
  styled,
  Box,
  Slide,
  Grid,
  Icon,
  Chip,
} from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

export const CustomHeader = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  marginTop: (props) => (props.withoutmargin ? 10 : '1rem'),
  paddingLeft: (props) => (props.withoutmargin ? 0 : '1rem'),
  paddingRight: (props) => (props.withoutmargin ? 0 : '1rem'),
  marginBottom: 20,
});

export const CustomIcon = styled(Icon)({
  color: '#444',
});

export const CustomFaIcon = styled(FontAwesomeIcon)({
  color: '#444',
});

export const CustomChip = styled(Chip)({
  '& .MuiIcon-root': {
    marginRight: '5px',
  },
});
