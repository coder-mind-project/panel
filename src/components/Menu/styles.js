import {
  styled,
  Box,
  AppBar,
  IconButton,
  Icon,
  ListItem,
  Drawer,
  Menu,
} from '@material-ui/core';

import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

import { devices } from '@/config/devices';


const drawerWidth = 80;

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
  zIndex: 11,
  width: '100%',
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
  color: '#666',
});

export const DrawerList = styled(Box)({
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
  alignItems: 'center',
  paddingTop: 20,
  paddingBottom: 20,
});

export const CustomDrawer = styled(Drawer)({
  flexShrink: 0,
  width: drawerWidth + 120,
  zIndex: 10,
  position: 'fixed',
  [devices.mobileLarge]: {
    display: 'none',
    width: 0,
  },
  '& .MuiDrawer-paper': {
    transitionProperty: 'width',
    overflowX: 'hidden',
    width: drawerWidth,
    '& .MuiTypography-root, #coder-mind-logo': {
      display: 'none',
    },
    '& #coder-mind-logo': {
      width: 120,
    },
    '&:hover': {
      '& .MuiButtonBase-root': {
        justifyContent: 'flex-start',
      },
      '& #logout-button': {
        justifyContent: 'center',
      },
      '& .MuiTypography-root, #coder-mind-logo': {
        display: 'block',
        marginLeft: '.6rem',
      },
      width: 'inherit',
    },
  },
});

export const AppBarBottom = styled(AppBar)({
  display: 'none',
  [devices.mobileLarge]: {
    display: 'block',
    top: 'auto',
    bottom: 0,
    height: 60,
  },
});

export const AppBarIconButton = styled(IconButton)({
  width: '25%',
});

export const CustomMenu = styled(Menu)({
  marginTop: '.5rem',
  '& .MuiTypography-root': {
    marginLeft: '.6rem',
  },
});
