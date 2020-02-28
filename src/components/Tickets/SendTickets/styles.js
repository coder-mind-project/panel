import {
  styled,
  Card,
  CardActions,
  TextField,
  Box,
} from '@material-ui/core';

import { devices } from '../../../config/devices';


export const CustomCard = styled(Card)({
  maxWidth: '25%',
  minHeight: '230px',
  margin: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: '0px 1px 8px 0px rgba(0,0,0,0.2), 0px 1px 2px 0px rgba(0,0,0,0.14), 0px 5px 1px -1px rgba(0,0,0,0.12)',
  [devices.laptop]: {
    maxWidth: '40%',
  },
  [devices.tablet]: {
    maxWidth: '70%',
  },
  [devices.mobileLarge]: {
    maxWidth: '100%',
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


export default {
  CustomCard,
  CustomCardActions,
  CustomTextField,
  CustomBox,
  IconBox,
};
