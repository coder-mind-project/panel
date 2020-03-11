import {
  styled,
  Grid,
  Box,
  TextField,
  Button,
  ButtonBase,
  Paper,
  FormControl,
} from '@material-ui/core';

import { Alert } from '@material-ui/lab';

import { COLOR_APP, COLOR_APP_HOVER } from '@/config/dataProperties';
import { devices } from '@/config/devices';

export const GridPresentation = styled(Grid)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  minHeight: '100%',
  width: '100vw',
  color: '#fff',
  fontWeight: 700,
  backgroundColor: '#8a05be', /* fallback for old browsers */
  background: 'linear-gradient(to top, #9733EE, #8a05be)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  padding: '0px 15px',
  '& h1': {
    textAlign: 'center',
  },
  '& h2': {
    fontSize: '1.2rem',
    textAlign: 'center',
  },
  '& img': {
    width: '250px',
    margin: '2.5rem 0',
  },
  '& button': {
    margin: '0.6rem',
  },
});

export const AuthSection = styled(Paper)({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
});

export const LogoArea = styled(Box)({
  height: '160px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const FormArea = styled(Box)({
  height: '80%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  '& form': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    padding: '25px',
  },
});

export const CustomTextField = styled(TextField)({
  width: '60%',
  margin: '0.8rem 0',
  [devices.tablet]: {
    width: '100%',
  },
});

export const CustomFormControl = styled(FormControl)({
  width: '60%',
  margin: '0.8rem 0',
  [devices.tablet]: {
    width: '100%',
  },
});

export const SpecialButton = styled(Button)({
  display: 'none',
  [devices.laptop]: {
    display: 'block',
  },
});

export const SubmitArea = styled(Grid)({
  width: '60%',
  margin: '0.8rem 0',
  [devices.tablet]: {
    width: '100%',
  },
});

export const CustomAlert = styled(Alert)({
  width: '52%',
  margin: '0.8rem 0',
  [devices.tablet]: {
    width: '80%',
  },
});

export const CustomButtonBase = styled(ButtonBase)({
  backgroundColor: COLOR_APP,
  color: '#fff',
  '&:hover': {
    backgroundColor: COLOR_APP_HOVER,
  },
  marginBottom: '10px',
  fontSize: '1rem',
  fontWeight: 100,
  padding: 10,
  borderRadius: 4,
  width: (props) => (props.fullwidth === 'true' ? '100%' : 'auto'),
  '& .MuiCircularProgress-root': {
    marginRight: '5px',
  },
  '& .MuiIcon-root': {
    marginRight: '5px',
  },
});
