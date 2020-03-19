import {
  styled,
  Box,
  Icon,
} from '@material-ui/core';

import { Link } from 'react-router-dom';
import SearchBar from 'material-ui-search-bar';
import { devices } from '@/config/devices';

export const HudLink = styled(Link)({
  textDecoration: 'none',
  [devices.tablet]: {
    width: '100%',
    margin: 0,
  },
});

export const HudButtons = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  width: '60%',
  [devices.tablet]: {
    width: '100%',
  },
  '& a': {
    margin: '0 8px',
  },
  '& > button': {
    margin: '0 8px 10px 8px',
    [devices.tablet]: {
      width: '100%',
    },
  },
});

export const HudSearchBar = styled(SearchBar)({
  [devices.tablet]: {
    width: '100%',
  },
});

export const TableIcon = styled(Icon)({
  marginRight: '5px',
});
