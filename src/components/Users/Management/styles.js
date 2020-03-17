import {
  styled,
  Box,
  Icon,
  TableCell,
  Container,
  TextField,
  Grid,
  Paper,
  Tooltip,
  withStyles,
} from '@material-ui/core';

import { Link } from 'react-router-dom';
import SearchBar from 'material-ui-search-bar';
import { devices } from '@/config/devices';

import { KeyboardDatePicker } from '@material-ui/pickers';

export const HudLink = styled(Link)({
  textDecoration: 'none',
  [devices.tablet]: {
    width: '100%',
    margin: 0,
  },
});

export const CustomLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
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

export const CustomTextField = styled(TextField)({
  margin: '1rem',
  minWidth: '300px',
  [devices.tablet]: {
    width: '100%',
    minWidth: '100%',
    margin: '1rem 0',
  },
});

export const CustomKeyboardDatePicker = styled(KeyboardDatePicker)({
  margin: '1rem',
  minWidth: '300px',
  [devices.tablet]: {
    width: '100%',
    minWidth: '100%',
    margin: '1rem 0',
  },
});

export const CustomIcon = styled(Icon)({
  marginRight: '5px',
});

export const CustomGrid = styled(Grid)({
  margin: '15px 0',
});

export const Form = styled(Paper)({
  marginBottom: '20px',
  paddingBottom: '20px',
});

export const FormHudButtons = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
  width: '100%',
  [devices.mobileLarge]: {
    justifyContent: 'center',
  },
  '& button': {
    margin: '0px 5px',
    [devices.tablet]: {
      margin: '5px 0px',
    },
  },
});

export const CustomTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 320,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);
