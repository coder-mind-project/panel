import {
  styled,
  Grid,
  TextField,
  FormControl,
  Box,
  InputBase,
  Icon,
} from '@material-ui/core';

import { devices } from '../../../config/devices';

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

export default {
  CustomGrid,
  CustomGridForButton,
  CustomTextField,
  CustomFormControl,
  BoxAnswers,
  BoxFieldAnswer,
  CustomInputBase,
  BoxMessageAdmin,
  BoxMessageIcon,
};
