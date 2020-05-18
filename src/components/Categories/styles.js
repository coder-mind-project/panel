import {
  styled,
  Box,
  Icon,
  TextField,
  FormGroup,
  InputLabel,
  Container,
} from '@material-ui/core';

import { Link } from 'react-router-dom';
import SearchBar from 'material-ui-search-bar';
import { devices } from '@/config/devices';

import { COLOR_APP, COLOR_APP_LIGHT } from '@/config/dataProperties';

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

export const CustomTextField = styled(TextField)({
  margin: '1rem',
  minWidth: '300px',
  [devices.tablet]: {
    width: '100%',
    minWidth: '100%',
    margin: '1rem 0',
  },
});

export const CustomFormGroup = styled(FormGroup)({
  width: '100%',
  margin: '1rem 1rem 0 1rem',
  [devices.tablet]: {
    margin: '1rem 0 0 0',
  },
});

export const CustomInputLabel = styled(InputLabel)({
  marginBottom: '10px',
  color: (props) => (props.theme === 'dark' ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.54)'),
  fontSize: '0.75rem',
});

export const TableWrapper = styled(Container)({
  marginBottom: '20px',
  overflowX: 'scroll',
  '& th': {
    fontSize: '0.875rem !important',
    fontWeight: '400 !important',
  },
});

/**
 * @function
 * @description The styles of `react-select` component, @see https://react-select.com/styles#style-object
 * @param {Object} props Parent props
 * @returns The styles
 */
export const searchThemeStyle = (props) => ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: props.theme === 'dark' ? '#424242' : '#fff', // #424242 equal to `dark theme`
    borderColor: state.isFocused ? '#8a05be' : `${props.theme === 'dark' ? '#fff' : 'rgba(0,0,0,.42)'}`, // rgba(0,0,0,.42) equal to default `TextField` border color
    boxShadow: state.isFocused ? `0 0 0 1px ${COLOR_APP}` : 'none',
    '&:hover': {
      borderColor: state.isFocused ? COLOR_APP : `${props.theme === 'dark' ? '#fff' : 'rgba(0,0,0,.42)'}`,
      boxShadow: `0 0 0 1px ${state.isFocused ? COLOR_APP : `${props.theme === 'dark' ? '#fff' : '#000'}`}`,
    },
  }),
  input: (provided) => ({
    ...provided,
    color: props.theme === 'dark' ? '#fff' : 'currentColor',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: props.theme === 'dark' ? '#fff' : 'currentColor',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: props.theme === 'dark' ? '#fff' : 'currentColor',
  }),
  option: (provided, state) => ({
    ...provided,
    color: '#000',
    backgroundColor: state.isFocused ? COLOR_APP_LIGHT : '#fff',
    '&:hover': {
      backgroundColor: COLOR_APP_LIGHT,
    },
  }),
});
