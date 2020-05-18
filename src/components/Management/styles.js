import { styled } from '@material-ui/core/styles';
import {
  Card, CardContent, Grid,
} from '@material-ui/core';

import { Link } from 'react-router-dom';

import { devices } from '../../config/devices';

export const CustomCard = styled(Card)({
  minHeight: '180px',
  margin: '8px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  [devices.tablet]: {
    margin: 0,
    marginBottom: '15px',
  },
});

export const CustomCardContent = styled(CardContent)({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
});

export const CustomGrid = styled(Grid)({
  padding: 15,
});

export const CustomShortcutOption = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '1px 1px 3px 1px #ccc',
  padding: '20px 10px',
  '& h4': {
    fontSize: '1rem',
    margin: 0,
  },
  minHeight: 110,
});

export const CustomLink = styled(Link)({
  textDecoration: 'none',
  color: '#fff',
  margin: '15px',
  minWidth: 200,
  background: (props) => `linear-gradient(45deg, ${props.colorleft} 20%, ${props.colorright} 90%)`,
  backgroundColor: (props) => props.colorleft,
  '&:hover': {
    background: (props) => `linear-gradient(45deg, ${props.colorright} 20%, ${props.colorleft} 90%)`,
    backgroundColor: (props) => props.right,
  },
  [devices.mobileLarge]: {
    margin: '10px 0px',
    minWidth: '100%',
  },
});

export default { CustomCard, CustomGrid };
