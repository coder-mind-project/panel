import {
  styled,
  Grid,
  TextField,
  FormControl,
  Box,
  InputBase,
  Icon,
  Typography,
  Button,
  Menu,
  Container,
} from '@material-ui/core';

import { Link } from 'react-router-dom';

import { devices } from '@/config/devices';

export const CustomGrid = styled(Grid)({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '10px',
  flexWrap: 'wrap',
});

export const CustomGridForButton = styled(CustomGrid)({
  justifyContent: 'flex-end',
});

export const CustomTextField = styled(TextField)({
  minWidth: '250px',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  [devices.tablet]: {
    width: '100%',
  },
  [devices.mobileLarge]: {
    marginRight: 0,
  },
  '& .disabled-text-field': {
    color: '#000',
  },
});

export const CustomFormControl = styled(FormControl)({
  minWidth: '250px',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  [devices.tablet]: {
    width: '100%',
  },
  [devices.mobileLarge]: {
    width: '100%',
    marginRight: 0,
  },
});

export const BoxAnswers = styled(Box)({
  padding: '1rem',
  overflowY: 'scroll',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  height: '100%',
});

export const BoxFieldAnswer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgb(235,235,235)',
  width: '100%',
  maxHeight: '4rem',
  padding: '1rem 0',
});

export const BoxAnswerIdentifier = styled(Typography)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '0.875rem',
  fontWeight: '400',
  lineHeight: '1.43',
});

export const BoxAnswerButton = styled(Button)({
  padding: 0,
  '& .MuiButton-label': {
    width: '100%',
    display: 'inherit',
    alignItems: 'inherit',
    justifyContent: 'flex-end',
  },
});

export const CustomInputBase = styled(InputBase)({
  backgroundColor: '#FFF',
  borderRadius: '10rem',
  width: '80%',
  maxHeight: '4.5rem',
  overFlowY: 'scroll',
  padding: '0.40rem 1rem',
  margin: '0 0.40rem',
});

export const BoxMessageAdmin = styled(Box)({
  backgroundColor: (props) => (props.fromadmin ? 'rgba(138, 5, 190, 0.3)' : '#fff'),
  display: 'flex',
  flexWrap: 'wrap',
  padding: '0.45rem',
  borderRadius: '0.50rem',
  marginBottom: '0.70rem',
  wordWrap: 'break-word',
});

export const BoxMessageIcon = styled(Icon)({
  fontSize: '1rem',
  margin: '0.3rem',
});

export const CustomGridMenu = styled(Grid)({
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

export const TableIcon = styled(Icon)({
  marginRight: '5px',
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

export const HudLink = styled(Link)({
  textDecoration: 'none',
  [devices.tablet]: {
    width: '100%',
    margin: 0,
  },
});

export const TableWrapper = styled(Container)({
  marginBottom: '20px',
  overflowX: 'scroll',
  minHeight: '80vh',
  '& th': {
    fontSize: '0.875rem !important',
    fontWeight: '400 !important',
  },
});
