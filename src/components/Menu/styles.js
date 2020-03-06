import {
  styled,
  Box,
  AppBar,
  IconButton,
  Icon,
  ListItem,
} from '@material-ui/core';

import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

import { devices } from '@/config/devices';


export const MenuRoot = styled(Box)({
  display: (props) => (props.display ? 'block' : 'none'),
});

export const CustomAppBar = styled(AppBar)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 1rem',
  backgroundColor: 'rgb(20,20,20)',
});

export const CustomIconButton = styled(IconButton)({
  marginRight: '1rem',
});

export const AppBarItems = styled(Box)({
  '& div': {
    [devices.tablet]: {
      display: 'none',
    },
  },
});

export const CustomAvatar = styled(Avatar)({
  marginRight: '1rem',
  [devices.mobileLarge]: {
    display: 'none',
  },
});

export const IconMenuItem = styled(Icon)({
  marginRight: '.6rem',
  color: '#666',
});

export const DrawerList = styled(Box)({
  width: 300,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

export const CustomLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'none',
});


export const CustomListItem = styled(ListItem)({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 20,
  paddingBottom: 20,
});
