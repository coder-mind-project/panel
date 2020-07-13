import {
  styled,
  Card,
  CardActions,
  TextField,
  Box,
  Paper,
  FormControl,
} from '@material-ui/core';

import { devices } from '@/config/devices';
import { KeyboardDateTimePicker } from '@material-ui/pickers';

export const CustomCard = styled(Card)({
  width: '30%',
  minHeight: '300px',
  margin: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: '0px 1px 8px 0px rgba(0,0,0,0.2), 0px 1px 2px 0px rgba(0,0,0,0.14), 0px 5px 1px -1px rgba(0,0,0,0.12)',
  [devices.laptop]: {
    width: '40%',
  },
  [devices.tablet]: {
    minHeight: '250px',
    width: '100%',
  },
});

export const CustomCardActions = styled(CardActions)({
  display: 'flex',
  justifyContent: 'flex-end',
  marginRight: '3px',
  marginBottom: '8px',
  [devices.laptop]: {
    ' button': {
      width: '100%',
    },
  },
});

export const CustomTextField = styled(TextField)({
  margin: '10px',
  width: '320px',
  [devices.tablet]: {
    width: '100%',
  },
});

export const CustomFormControl = styled(FormControl)({
  margin: '10px',
  width: '320px',
  [devices.tablet]: {
    width: '100%',
  },
});

export const CustomKeyboardDateTimePicker = styled(KeyboardDateTimePicker)({
  margin: '10px',
  width: '320px',
  [devices.tablet]: {
    width: '100%',
  },
});

export const CustomBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  height: '100vh',
  [devices.laptop]: {
    flexDirection: 'column',
  },
});

export const IconBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginRight: '10px',
  [devices.laptop]: {
    marginRight: 0,
  },
});

export const CustomPaper = styled(Paper)({
  padding: '1.3rem',
});

export default {
  CustomCard,
  CustomCardActions,
  CustomTextField,
  CustomBox,
  IconBox,
  CustomPaper,
};
