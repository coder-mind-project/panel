import {
  styled,
  Box,
  Icon,
  TableCell,
  Container,
} from '@material-ui/core';

import { Link } from 'react-router-dom';
import SearchBar from 'material-ui-search-bar';
import { devices } from '@/config/devices';

export const HudLink = styled(Link)({
  textDecoration: 'none',
  margin: '0 8px',
  [devices.tablet]: {
    width: '100%',
    margin: 0,
  },
});

export const CustomLink = styled(Link)({
  textDecoration: 'none',
});

export const HudButtons = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  width: '60%',
  [devices.tablet]: {
    width: '100%',
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

export const TableOrder = styled(TableCell)({
  color: (props) => (props.theme === 'light' ? 'rgba(0,0,0,0.87)' : '#FFFFFF'),
});

export const FakeTableOrder = styled(Box)({
  color: (props) => (props.theme === 'light' ? 'rgba(0,0,0,0.87)' : '#FFFFFF'),
});

export const TableWrapper = styled(Container)({
  marginBottom: '20px',
  overflowX: 'scroll',
  '& th': {
    fontSize: '0.875rem !important',
    fontWeight: '400 !important',
  },
});
