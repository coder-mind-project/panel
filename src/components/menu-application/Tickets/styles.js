import {
  styled,
  Grid,
  Box,
  Menu,
} from '@material-ui/core';

import { Link } from 'react-router-dom';

export const CustomGrid = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '5px',
  width: '100%',
});

export const BoxMessage = styled(Box)({
  fontSize: '0.85rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const CustomMenu = styled(Menu)({
  marginTop: '.5rem',
});

export const CustomLink = styled(Link)({
  textDecoration: 'none',
});
